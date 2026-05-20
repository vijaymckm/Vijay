# 08 — Security & Scaling

How to harden this for production traffic and how to grow it from "1 lead/day" to "10,000 leads/day."

---

## Security best practices

### 1. Webhook authenticity (HMAC)

**Always set `WHATSAPP_APP_SECRET` in production.** When set, the `Safe Parse + HMAC` node:
- reads the raw POST body (the webhook node's `rawBody: true` option preserves it byte-for-byte),
- computes `sha256=` HMAC,
- compares to `X-Hub-Signature-256` using `crypto.timingSafeEqual` (no timing-attack leakage),
- routes failed checks to a 403 response and never invokes the State Machine.

Verify it's enforcing:
```bash
curl -X POST https://<host>/webhook/whatsapp \
  -H 'Content-Type: application/json' \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"1","id":"x","type":"text","text":{"body":"hi"}}]}}]}]}'
# expected: 403 forbidden
```

### 2. Secrets management

| Secret | Where to store |
|---|---|
| `WHATSAPP_TOKEN`, `WHATSAPP_APP_SECRET` | `.env` (file mode `600`) or AWS SSM / Vault, never in workflow JSON |
| `N8N_ENCRYPTION_KEY` | Backed up offline (1Password, hardware token). **Lose this and every n8n credential is unusable.** |
| OAuth refresh tokens | n8n encrypts these at rest with `N8N_ENCRYPTION_KEY` — that's why above matters |
| `OPENAI_API_KEY` | Same as WhatsApp token — env only, with a low billing cap as a backstop |

Rotation cadence:
- Permanent WhatsApp system-user token: rotate annually.
- App secret: only if you suspect a leak. Rotation requires re-subscribing the webhook.
- OpenAI key: rotate quarterly or on staff changes.
- n8n credentials: re-authorize OAuth annually (most refresh tokens are valid indefinitely but Google may require re-consent).

### 3. Network controls

- **TLS only.** The Nginx config in [`07-deployment-and-checklist.md`](./07-deployment-and-checklist.md) terminates TLS. Block port 80 except for Certbot HTTP-01 challenges.
- **n8n editor auth.** Set `N8N_BASIC_AUTH_ACTIVE=true` plus `N8N_BASIC_AUTH_USER` / `N8N_BASIC_AUTH_PASSWORD`, OR enable n8n's built-in user management (`N8N_USER_MANAGEMENT_DISABLED=false`). The webhook URL stays public but the editor doesn't.
- **Reverse-proxy IP allowlist (optional).** Meta publishes its webhook source IP ranges. You can restrict POST `/webhook/whatsapp` to those ranges in Nginx if you want defense-in-depth, but be ready to update the list — Meta changes ranges occasionally.
- **Outbound egress.** The workflow makes outbound calls to `graph.facebook.com`, `googleapis.com`, `lookup-*.googleusercontent.com`, and `api.openai.com`. If you're behind a strict egress firewall, allow only those.

### 4. Data minimization & PII

The bot collects: name, phone, business, budget, timeline, optional file uploads. These are **personal data** under GDPR / DPDP Act / equivalents.

- Add a privacy notice to your WhatsApp landing copy: e.g. _"By replying you agree we'll store your details to follow up on your enquiry."_
- Keep the `Sessions` tab pruned — old completed sessions don't need to live there forever. Add a daily Cron workflow that deletes rows where `step = 'DONE'` and `updatedAt < now - 30 days`.
- For `Leads`, set a calendar reminder to review and archive leads older than your retention policy (e.g. 24 months for cold leads).

### 5. Strict idempotency

The current workflow is "soft idempotent" via the upsert-by-phone pattern, but two simultaneous webhook deliveries for the same `wamid` could in theory both succeed and produce two `Leads` rows.

If that becomes a real concern (it usually doesn't because Meta retries serially), add at the top of the State Machine:

```js
// At the top of the State Machine code:
const wamid = incoming.wamid;
const existingByWamid = await $helpers.googleSheetsLookup({ // pseudocode
  sheet: $env.LEADS_SHEET_TAB,
  column: 'wamid',
  value: wamid
});
if (existingByWamid) {
  return [{ json: { ...everythingElse, reply: '', leadComplete: false } }];
}
```

…and add a `wamid` column to the `Leads` schema. For high-throughput deployments, replace this with a Redis `SETNX` keyed on `wamid` — see Scaling section.

### 6. Audit & access logs

Three sources of truth:

- **n8n executions** — every webhook hit, retained 14 days by default.
- **Google audit log** — Workspace admin → Security → Investigation tool. Every Sheets / Drive read/write by the OAuth user is logged.
- **Meta business log** — Meta Business Manager → Security Center.

For SOC2 / ISO-style audits, ship n8n's logs to a long-term store (S3 / Loki / ELK) — see Observability.

---

## Scaling to thousands of leads per day

The single-instance setup handles ~10–50 concurrent webhooks comfortably. Beyond that, you need to think about queueing, horizontal scaling, and storage choices.

### Stage 1 — Tune the single instance (handles ~100 leads/min)

1. **Postgres, not SQLite.** Already in [`07-deployment-and-checklist.md`](./07-deployment-and-checklist.md).
2. **Move OpenAI off the critical path.** OpenAI calls can take 1–3 s. Set `onError: continueRegularOutput` (already done) and consider replacing the OpenAI node with a queue-and-respond-later pattern.
3. **Reduce execution log retention.** Set `EXECUTIONS_DATA_MAX_AGE=72` (3 days) to keep the DB lean.
4. **Increase Node heap.** Add `NODE_OPTIONS=--max-old-space-size=2048` to the n8n container env.

### Stage 2 — Queue mode (handles ~1000 concurrent / second)

n8n's [queue mode](https://docs.n8n.io/hosting/scaling/queue-mode/) splits the work into a **main** (handles webhooks + UI) and N **workers** (run executions). Webhook responses become near-instant; long executions don't block.

```yaml
services:
  redis:
    image: redis:7-alpine
    restart: unless-stopped

  n8n-main:
    image: n8nio/n8n:latest
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      # ... same env as before
    ports: ["127.0.0.1:5678:5678"]

  n8n-worker:
    image: n8nio/n8n:latest
    command: ["worker"]
    deploy:
      replicas: 4
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      # ... same env as before
```

Workers consume jobs from Redis. Scale horizontally with `replicas`.

> Caveat: in queue mode, the webhook node has to use `responseMode: 'lastNode'` or `responseMode: 'onReceived'` for instant 200s. Our workflow already uses `responseMode: 'responseNode'` and explicitly responds 200 at the end — that works in queue mode but the response goes out only after the execution finishes. If you regularly hit Meta's 5 s deadline, switch the GET handshake branch to `responseMode: 'lastNode'` and the POST branch to a fire-and-forget pattern: webhook responds 200 immediately, then publishes a Redis message that a separate worker workflow consumes. That's a 2-workflow refactor — happy to write it up if/when you need it.

### Stage 3 — Move state out of Sheets (handles 10,000+ leads/day)

Google Sheets has hard limits:
- 5,000,000 cells per spreadsheet.
- API quota: 60 read-requests/min/user (pre-2023) → ~300 (current).
- Latency: 200–500 ms per call.

At ~10,000 leads/day with ~6 turns per conversation, you're at ~60,000 Sheets reads/day, which is fine on paper but will start hitting quota during traffic spikes.

Migration path:
1. Replace `Sessions` storage with **Redis** (key = phone, value = JSON of session). Sub-millisecond reads, infinite scale.
2. Replace `Leads` storage with **Postgres** or a real CRM (HubSpot / Pipedrive / Salesforce). Use n8n's native nodes for those.
3. Keep the Google Sheet as a periodic export ("CRM mirror") so the sales team's existing workflows don't break.

Concretely, swap the `Load Session` and `Upsert Session` nodes for an HTTP Request to a tiny Redis HTTP API (or use n8n's native Redis node), keep everything else the same.

---

## Observability

For anything past 1000 leads/day you want metrics + alerts beyond the admin email.

### Metrics

n8n doesn't ship Prometheus metrics out of the box, but you can:

1. Add a final `HTTP Request` node in the success path that POSTs to a metrics endpoint (StatsD / pushgateway / your APM) with `lead_completed`, `duration_ms`, `service`.
2. Same in the error workflow with `workflow_failed`, `last_node`.

### Alerting

- The error workflow already emails the admin on failure. Wire the same trigger to PagerDuty / Slack / Opsgenie via their webhook for after-hours coverage.
- Add a **dead-man's switch**: a Cron-triggered workflow that runs every hour and pings a healthcheck URL like [healthchecks.io](https://healthchecks.io/). If n8n is down, healthchecks.io alerts you.

### Logs

```yaml
# In n8n container env
- N8N_LOG_LEVEL=info
- N8N_LOG_OUTPUT=console
```

Pipe `docker logs n8n` to your aggregator (Loki / Datadog / CloudWatch). The `executionId` in logs links back to the n8n UI for one-click debugging.

---

## Multi-tenant / multi-user notes

The current workflow is single-tenant (one WhatsApp number, one sheet, one Drive folder). To run multiple JAS Studios brands or franchisees on one n8n:

1. Add a `tenantId` column to `Sessions` and `Leads`.
2. Pass the tenant in via the webhook **path** — register a separate URL per brand:
   - `…/webhook/wa/jasdelhi`
   - `…/webhook/wa/jasmumbai`
3. Read the path segment in `Safe Parse + HMAC` and inject `tenantId` into every downstream item.
4. Use tenant-specific env vars (`WHATSAPP_TOKEN_DELHI`, `LEADS_SHEET_ID_DELHI`, …) and resolve them in a Set node based on `tenantId`.

For very large multi-tenant deployments, consider one workflow file per tenant rather than branching inside one workflow — it's easier to debug and roll out changes per-brand.

---

## Cost ballpark

| Component | 100 leads/day | 1,000 leads/day | 10,000 leads/day |
|---|---|---|---|
| n8n Cloud Pro | $50/mo | overflow plan | self-host required |
| Self-host (DigitalOcean) | $12/mo | $48/mo | $200+/mo (queue mode) |
| Google Sheets / Drive | Free (under limits) | Free | Migrate to CRM |
| WhatsApp business conversations | Free <1k user-initiated | ~$15/mo | ~$150/mo (bulk-rate region-dependent) |
| OpenAI gpt-4o-mini | ~$1/mo | ~$10/mo | ~$100/mo |

Numbers are rough — actual WhatsApp pricing varies by recipient country and conversation category. Always check the [Meta WhatsApp pricing page](https://developers.facebook.com/docs/whatsapp/pricing) for your target market.
