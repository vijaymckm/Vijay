# 05 — Webhook Setup

The Meta-facing surface of this automation is **two** webhook endpoints (technically one URL serving GET + POST). This doc covers exposing n8n publicly, the verification handshake, and how to debug it.

---

## URL anatomy

The workflow defines two nodes both pointing at path `whatsapp`:

- `Webhook (GET verify)` → method `GET`
- `Webhook (POST events)` → method `POST`

n8n exposes them at:

```
https://<your-n8n-host>/webhook/whatsapp           ← production (workflow active)
https://<your-n8n-host>/webhook-test/whatsapp      ← test (only while editor is open)
```

> The same path on different methods is fine — n8n routes by method.

You give the **production** URL to Meta. If you want to test interactively, switch to the test URL temporarily, click **Listen for test event**, and trigger it.

---

## Step 1 — Make n8n publicly reachable

You need a stable HTTPS URL pointing at your n8n instance. Options ranked from quick to production-grade:

### Option A — n8n Cloud (no work needed)
You already have a public HTTPS URL. Skip to Step 2.

### Option B — Self-host with a reverse proxy
Standard pattern for self-hosters.

```nginx
# /etc/nginx/sites-available/n8n
server {
    listen 443 ssl http2;
    server_name n8n.jasstudios.com;

    # Cert from Certbot / Let's Encrypt
    ssl_certificate     /etc/letsencrypt/live/n8n.jasstudios.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/n8n.jasstudios.com/privkey.pem;

    # n8n on the same host, default port 5678
    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Set on the n8n process:
```bash
N8N_HOST=n8n.jasstudios.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.jasstudios.com/
```
`WEBHOOK_URL` is critical — it's what n8n uses to compute the URL it shows in the editor.

### Option C — ngrok / cloudflared tunnel (development only)
```bash
ngrok http 5678
# or
cloudflared tunnel --url http://localhost:5678
```
The URL changes every restart unless you pay for a static domain — only use this for first-day setup.

---

## Step 2 — Activate the workflow

In the n8n editor, toggle **Active** in the top-right. The webhook URLs become live (production URLs).

> If you forget this, Meta's verify call returns "Cannot GET /webhook/whatsapp" and the dialog stays red.

Copy the production URL of `Webhook (POST events)` (the GET node has the same URL but on a different method) — it's shown at the top of the node's parameters panel.

---

## Step 3 — Register the URL with Meta

Follow [`01-setup-whatsapp-cloud-api.md`](./01-setup-whatsapp-cloud-api.md) **Step 7**. Summary:

1. Meta → WhatsApp → Configuration → Webhook → **Edit**.
2. Callback URL: `https://<your-n8n-host>/webhook/whatsapp`.
3. Verify token: the value of `$env.WHATSAPP_VERIFY_TOKEN`.
4. **Verify and Save**.
5. Subscribe to the `messages` field.

What happens under the hood:

```
Meta → GET https://yourhost/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=XXX&hub.challenge=12345

Workflow → Webhook (GET verify) → Verify GET token → Respond hub.challenge
       ← 200 OK, body: "12345"
```

---

## Step 4 — Confirm it's wired correctly

After clicking **Verify and Save**:

- Meta sends a small test webhook to your URL. In n8n → **Executions** tab, you should see a new execution from `Webhook (POST events)`.
- The test event has no `messages` array, so it'll route through `IF isMessage` → false → `Respond 200 (status/empty)`. That's expected.

Send `hi` to your WhatsApp business number from your phone. Within 2 s you should see the welcome menu come back, and an execution should be visible in n8n.

---

## HMAC signature verification (production)

When `$env.WHATSAPP_APP_SECRET` is set, the `Safe Parse + HMAC` node checks every incoming POST against the `X-Hub-Signature-256` header.

How Meta computes the signature:

```js
'sha256=' + crypto.createHmac('sha256', appSecret).update(rawRequestBody).digest('hex')
```

The verification is **timing-safe** (uses `crypto.timingSafeEqual`) and runs against the **raw body** (the `rawBody: true` option on the webhook node makes n8n preserve it verbatim). Tampered or unsigned requests get a 403.

To test:
```bash
# Forge a request without a valid signature - expect 403
curl -X POST https://<host>/webhook/whatsapp \
  -H 'Content-Type: application/json' \
  -d '{"foo":"bar"}'
# → forbidden (403)
```

To temporarily disable HMAC enforcement (only for local debugging), unset `WHATSAPP_APP_SECRET` and restart n8n. Re-enable before going live.

---

## Debugging: capture a real Meta request

Sometimes you want to see exactly what Meta is sending. The easiest path:

1. In **n8n → Executions**, click on a recent webhook execution.
2. The first node (`Webhook (POST events)`) shows the full request body and headers.
3. Copy the body and use it as a test fixture (we have a few in [`../samples/sample-payloads.json`](../samples/sample-payloads.json)).

To replay a captured event against your test URL:

```bash
curl -X POST https://<host>/webhook-test/whatsapp \
  -H 'Content-Type: application/json' \
  -d @samples/sample-payloads.json   # (after extracting one of the entries)
```

---

## Common webhook errors

| Symptom | Likely cause | Fix |
|---|---|---|
| Meta verify dialog stays red | Workflow not active, or wrong verify token | Toggle Active on the workflow. Check `WHATSAPP_VERIFY_TOKEN` matches Meta's UI |
| Verify dialog times out | n8n unreachable from internet | Check DNS, firewall, reverse proxy. `curl https://yourhost/webhook/whatsapp?hub.mode=foo` from outside should hit n8n |
| Returns 200 but no execution shows | You hit `/webhook-test/whatsapp` but the workflow is active (test URL only works in inactive editor mode). Use `/webhook/whatsapp` |
| Returns 403 on every event | HMAC verification failing — `WHATSAPP_APP_SECRET` is wrong. Double-check Meta → App Settings → Basic → App Secret |
| Returns 200 but no reply on phone | Your test recipient isn't in the allowed list (test number limitation). Add the recipient under WhatsApp → API Setup → To list |
| Random 504 timeouts under load | Workflow is taking >5 s. Add caching, move OpenAI off-path, or move replies to a queue (see [`08-security-and-scaling.md`](./08-security-and-scaling.md)) |
