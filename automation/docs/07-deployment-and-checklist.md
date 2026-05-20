# 07 — Deployment & Production Checklist

How to put this in front of real customers, on either n8n Cloud or your own infra.

---

## Option A — n8n Cloud (fastest)

If you don't want to run servers, n8n Cloud is the path of least resistance. ~10 minutes from zero to live.

1. Sign up at [n8n.cloud](https://n8n.cloud).
2. Pick a plan that allows custom workflows + sufficient executions/day for your traffic.
3. Note the public URL of your instance (e.g. `https://jasstudios.app.n8n.cloud`).
4. Open **Settings → Variables** and add every variable from `.env.example` (n8n Cloud reads them as `$env.XYZ` exactly the same way).
5. Open **Settings → Credentials** and create the four OAuth credentials (Sheets, Drive, Gmail, optional OpenAI HTTP). See docs `02`–`04`.
6. Import both workflow JSONs (UI: top-right `…` → **Import from file**).
7. Open the imported main workflow → re-bind credentials on each Sheets/Drive/Gmail node.
8. Set the main workflow's **Settings → Error Workflow** dropdown to `JAS Studios — Error Handler`.
9. **Activate** both workflows.
10. Copy the production webhook URL of `Webhook (POST events)` and register it in Meta — see [`05-webhook-setup.md`](./05-webhook-setup.md#step-3--register-the-url-with-meta).

Pros: zero ops. Cons: cost grows with execution count; you can't tweak the underlying Node version.

---

## Option B — Self-hosted (Docker Compose)

Recommended for cost predictability, custom plugins, or compliance.

### Minimum viable `docker-compose.yml`

```yaml
version: "3.8"
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"   # bind to localhost; reverse-proxy handles TLS
    environment:
      # ---- n8n core ----
      - N8N_HOST=n8n.jasstudios.com
      - N8N_PROTOCOL=https
      - N8N_PORT=5678
      - WEBHOOK_URL=https://n8n.jasstudios.com/
      - GENERIC_TIMEZONE=Asia/Kolkata
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}        # generate once, never change
      - N8N_USER_MANAGEMENT_JWT_SECRET=${N8N_JWT_SECRET}
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=336                     # hours = 14 days
      - EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000
      # ---- our app vars ----
      - WHATSAPP_TOKEN=${WHATSAPP_TOKEN}
      - WHATSAPP_PHONE_NUMBER_ID=${WHATSAPP_PHONE_NUMBER_ID}
      - WHATSAPP_BUSINESS_ACCOUNT_ID=${WHATSAPP_BUSINESS_ACCOUNT_ID}
      - WHATSAPP_VERIFY_TOKEN=${WHATSAPP_VERIFY_TOKEN}
      - WHATSAPP_APP_SECRET=${WHATSAPP_APP_SECRET}
      - WHATSAPP_GRAPH_VERSION=v25.0
      - ADMIN_PHONE=${ADMIN_PHONE}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - LEADS_SHEET_ID=${LEADS_SHEET_ID}
      - LEADS_SHEET_TAB=Leads
      - SESSIONS_SHEET_TAB=Sessions
      - GDRIVE_ROOT_FOLDER_ID=${GDRIVE_ROOT_FOLDER_ID}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_MODEL=gpt-4o-mini
      - N8N_PUBLIC_URL=https://n8n.jasstudios.com
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  pg_data:
```

Bring it up:
```bash
docker compose up -d
docker compose logs -f n8n
```

Add the Nginx reverse proxy from [`05-webhook-setup.md`](./05-webhook-setup.md#option-b--self-host-with-a-reverse-proxy), point your DNS A-record at the host, run Certbot for Let's Encrypt.

### Why Postgres, not SQLite?
The default SQLite is fine for development but corrupts under concurrent webhook bursts. Postgres handles bursty traffic gracefully and is required for queue-mode if you horizontally scale (see [`08-security-and-scaling.md`](./08-security-and-scaling.md)).

### Generate a stable encryption key
n8n's `N8N_ENCRYPTION_KEY` is what encrypts your stored credentials at rest. **Generate it once and never change it** (changing it invalidates all stored credentials).

```bash
openssl rand -hex 32      # → use as N8N_ENCRYPTION_KEY
openssl rand -hex 32      # → use as N8N_JWT_SECRET
openssl rand -hex 24      # → use as POSTGRES_PASSWORD
```

Store these securely (1Password, AWS Secrets Manager, etc.) — losing them means losing every credential in n8n.

---

## Importing the workflows

Order matters because the main workflow references the error workflow's ID:

1. Import `workflows/jas-studios-error-handler.json` first.
2. Open it → in the URL bar copy the workflow ID:
   ```
   https://n8n.example.com/workflow/AbC123…/edit
                                   └─── this ID ───┘
   ```
3. Set `ERROR_HANDLER_WORKFLOW_ID` in your environment to that ID.
4. Import `workflows/jas-studios-lead-automation.json`.
5. Open its **Settings (gear icon top-right) → Error Workflow** and pick `JAS Studios — Error Handler` from the dropdown.
   *(Alternatively, edit `settings.errorWorkflow` in the JSON before import — replace `REPLACE_WITH_ERROR_HANDLER_WORKFLOW_ID` with the real ID.)*
6. On every Sheets / Drive / Gmail node in the main workflow, swap the placeholder credential to the one you set up.
7. Activate both.

---

## Production deployment checklist

Run through this before flipping the switch on real Meta Ads traffic. Tick each box.

### Credentials & secrets
- [ ] `WHATSAPP_TOKEN` is the **permanent** system-user token (not the 24-h temp)
- [ ] `WHATSAPP_APP_SECRET` is set so HMAC verification is **active** (test with a forged curl, expect 403)
- [ ] `WHATSAPP_VERIFY_TOKEN` is a fresh random string (not a default like `test123`)
- [ ] All four OAuth credentials (Sheets, Drive, Gmail, OpenAI) are wired into the workflow nodes (no red icons on the canvas)
- [ ] `N8N_ENCRYPTION_KEY` is set and backed up offline

### Workflows
- [ ] Both workflows are activated
- [ ] Main workflow's `Error Workflow` setting points at the error handler
- [ ] Webhook URL in Meta matches the **production** URL, not the test URL
- [ ] Subscribed to the `messages` field in Meta's webhook config

### Google
- [ ] `Leads` / `Sessions` / `Errors` tabs exist with **exact** header names from [`../samples/google-sheet-schema.md`](../samples/google-sheet-schema.md)
- [ ] Drive root folder exists and is shared with the OAuth user as Editor
- [ ] Drive parent folder ID is in `GDRIVE_ROOT_FOLDER_ID`
- [ ] Test upload via the workflow worked once and the file ended up in `YYYY-MM-DD_Name_Service/`

### Manual smoke test (5 min)
- [ ] `hi` → menu shown
- [ ] Walk a full lead end-to-end with a JPG and a PDF
- [ ] Lead row appears in `Leads`
- [ ] Admin email arrived (check Spam too — you may need to mark not-spam once)
- [ ] Admin WhatsApp DM arrived
- [ ] Drive folder created with `YYYY-MM-DD_Name_Service` format and contains both files

### Failure / chaos test
- [ ] Sent a forged unsigned curl → got 403, no crash
- [ ] Sent an empty `{}` body → got 200, no crash
- [ ] Sent the same wamid twice (replay) → no duplicate lead row
- [ ] Temporarily broke a credential → error email arrived

### Rate / cost guardrails
- [ ] WhatsApp test number's allowed-recipients list is configured (or you've moved off the test number)
- [ ] OpenAI billing limit set in the OpenAI dashboard (e.g. $20/month soft cap)
- [ ] n8n execution prune is on (`EXECUTIONS_DATA_PRUNE=true`) so the DB doesn't grow unbounded

### Compliance & sales-handoff
- [ ] Privacy notice on your website explains data flow (WhatsApp → Sheets → email)
- [ ] Sales team has access to the `Leads` sheet
- [ ] Lead status workflow defined (`NEW → CONTACTED → QUALIFIED → WON / LOST`)
- [ ] Backup plan for the Google Sheet (Drive trash retention is 30 days; consider a daily export to GCS or S3)

---

## Going live

Once every box is ticked:

1. Update Meta → WhatsApp → Configuration → Webhook → Callback URL to your production URL.
2. Click **Verify and Save**. Subscribe to `messages`.
3. In Meta → WhatsApp → Phone numbers → click **Promote to live** if you've been on the test number.
4. Update the WhatsApp click-to-chat link on your website / ads to the live number:
   ```
   https://wa.me/<E164_NUMBER>?text=Hi%20JAS%20Studios%20-%20Tell%20me%20more
   ```
5. Tail the n8n execution log for the first 24 hours. The State Machine will get exposed to many edge inputs (typos, voice notes, location messages) you didn't think of — read [`06-error-handling-and-testing.md`](./06-error-handling-and-testing.md) and watch the `Errors` tab fill in the gaps.
6. Schedule a weekly review of the `Errors` tab. Most rows there are extension opportunities, not bugs.
