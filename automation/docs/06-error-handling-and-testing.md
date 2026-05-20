# 06 — Error Handling & Testing

How the workflow stays standing when things go wrong, plus exactly how to test it before flipping the switch on production.

---

## How errors are contained

The system has **four** layers of defense, in order of how often each one actually triggers:

### Layer 1 — Defensive parsing (Code node)
The `Safe Parse + HMAC` node never throws on a weird Meta payload. Empty entries, missing `value`, no `messages` array, partial deliveries, status updates with no body — all flow through with `isMessage=false` and short-circuit at the `IF isMessage` branch with a 200 response.

This is the layer that catches **delivery / read / sent receipts**, which Meta sends for every outbound message. Without this layer, every reply you send would trigger a re-execution of the bot logic against a "messages-less" payload and crash the State Machine.

### Layer 2 — Per-node retry
HTTP, Google Sheets, Google Drive, Gmail, and OpenAI nodes have:
```
retryOnFail: true
maxTries: 3
waitBetweenTries: 2000  (ms)
```
A transient 502 from Meta or a Sheets rate-limit gets retried automatically before the workflow fails.

### Layer 3 — `continueOnFail` for non-critical paths
The OpenAI node has `onError: 'continueRegularOutput'` — if OpenAI is down, the user still gets the generic fallback line set in `Set AI reply`. The error workflow's two terminal nodes have `continueOnFail: true` so a Sheet outage can't silence the email and vice versa.

### Layer 4 — Dedicated error workflow
If any node still throws after retries, n8n triggers `jas-studios-error-handler.json` automatically (configured via `settings.errorWorkflow` in the main workflow).

That workflow:
1. Captures the failure context.
2. Appends a row to the `Errors` tab.
3. Emails `$env.ADMIN_EMAIL` with a link straight to the failed execution.

---

## Status / receipt events explained

Meta will hit your webhook for **every** outbound message you send, with payloads like:

```json
{
  "entry": [{
    "changes": [{
      "value": {
        "statuses": [
          {
            "id": "wamid.XXX",
            "status": "delivered",
            "timestamp": "1747740000",
            "recipient_id": "919999999999"
          }
        ],
        "metadata": { ... },
        "messaging_product": "whatsapp"
      },
      "field": "messages"
    }]
  }],
  "object": "whatsapp_business_account"
}
```

Note: there's a `statuses` array but **no `messages` array**. The `Safe Parse + HMAC` node sets `isMessage = false`, the `IF isMessage` branch routes to `Respond 200 (status/empty)`, and the bot does nothing further. That's correct — never reply to a status event.

To see this in action, send a test message from your phone, then watch n8n's executions tab: you'll see one execution for the inbound message followed by 1–3 executions for the `sent → delivered → read` status updates that Meta fires back.

---

## Idempotency / dedup

WhatsApp will retry an event up to 3 times if it doesn't get a 200 within 5 seconds. To make sure the same `wamid` never produces two leads:

The `Sessions` upsert keys on `phone`, so re-running the same conversation step is naturally idempotent (it just re-writes the same row). For full safety, you can extend the `Append Lead` step with a `wamid` column and a check before insert. That's left as an opt-in extension — see [`08-security-and-scaling.md`](./08-security-and-scaling.md#strict-idempotency).

---

## Manual testing checklist

Before running real traffic, walk through this list. Each item is a single human action and an expected observable.

| # | Action | Expected result |
|---|---|---|
| 1 | Save & activate both workflows | n8n shows green dots, no warnings |
| 2 | Send `hi` from your phone | Welcome menu reply within 2 s |
| 3 | Reply `5` (invalid) | Bot reprompts with "Please reply with a number from 1-4" |
| 4 | Reply `2` | Bot asks for full name |
| 5 | Reply `Vijay McKM` | Bot asks if `+<your number>` is best |
| 6 | Reply `yes` | Bot asks for business name |
| 7 | Reply `JAS Studios` | Bot asks for budget |
| 8 | Reply `$1500` | Bot asks for timeline |
| 9 | Reply `2 weeks` | Bot asks for files |
| 10 | Send a JPG | Bot replies "📎 File received". Drive folder `YYYY-MM-DD_Vijay-McKM_Web-Design` exists with the file |
| 11 | Send a PDF | Same folder, second file |
| 12 | Reply `DONE` | Bot asks for notes |
| 13 | Reply `Need a landing page` | Bot says "🎉 Thanks Vijay!". `Leads` tab has 1 new row. Admin email + admin WhatsApp DM both arrive |
| 14 | Reply `menu` | Bot resets to welcome menu (Sessions row's `step` flips to `NEW`) |
| 15 | Reply `human` | Bot says "Connecting you to a human team member" |
| 16 | (After lead complete) Reply free-text `tell me about branding` | If `OPENAI_API_KEY` is set: AI reply. Otherwise: generic "we'll be in touch" |

If item 10 or 11 fail, you almost certainly have a Drive credential / scope problem — see [`03-setup-google-drive.md`](./03-setup-google-drive.md).

---

## Inducing errors (chaos testing)

Verify the error handler actually fires before you trust it:

### Test 1 — Bad Sheet ID
1. Temporarily set `LEADS_SHEET_ID=garbage` and restart n8n.
2. Send a normal message.
3. Expected: workflow fails at `Load Session`, error workflow appends a row to `Errors` tab, admin email arrives with subject `🚨 [n8n] JAS Studios — Lead Automation failed at Load Session`.
4. Restore the real ID.

### Test 2 — Revoked WhatsApp token
1. Temporarily set `WHATSAPP_TOKEN=expired_test`.
2. Send a message.
3. Expected: workflow fails at `WhatsApp → User`, error workflow fires.
4. Restore the real token.

### Test 3 — HMAC tamper
```bash
curl -X POST https://<host>/webhook/whatsapp \
  -H 'Content-Type: application/json' \
  -H 'X-Hub-Signature-256: sha256=DEADBEEF' \
  -d '{"entry":[{"changes":[{"value":{"messages":[{"from":"1","id":"x","type":"text","text":{"body":"hi"}}]}}]}]}'
```
Expected: `403 forbidden`. **No** execution against the State Machine.

### Test 4 — Empty body
```bash
curl -X POST https://<host>/webhook/whatsapp -H 'Content-Type: application/json' -d '{}'
```
Expected: `200 ok`. Single short execution that exits at `IF isMessage → false`. No errors logged.

---

## Local replay with sample payloads

The file [`../samples/sample-payloads.json`](../samples/sample-payloads.json) contains representative real Meta payloads — text, image, document, status, empty. Use them to test changes to the State Machine without involving Meta:

```bash
# Replay the text-message payload against the test webhook
curl -X POST 'https://<host>/webhook-test/whatsapp' \
  -H 'Content-Type: application/json' \
  -d "$(jq '.text_message' samples/sample-payloads.json)"
```

In n8n, click **Listen for test event** on `Webhook (POST events)` first, then run the curl. The execution will show up in the editor.

---

## Logging strategy

The bot is intentionally quiet about routine traffic — every successful execution is recorded in n8n's execution history (kept for 14 days by default; see `EXECUTIONS_DATA_PRUNE_MAX_COUNT`). Errors are loud:

| Event | Recorded where |
|---|---|
| Successful lead | `Leads` tab (permanent) |
| Session step | `Sessions` tab (live, mutable) |
| Failed execution | `Errors` tab + admin email + n8n execution log |
| Webhook call (success) | n8n execution log only |
| Webhook call (403/failed HMAC) | n8n execution log only — extend with a Code node `console.log(...)` if you need a sheet trail |

For higher-volume deployments, pipe n8n logs to ELK / Datadog / Loki — see [`08-security-and-scaling.md`](./08-security-and-scaling.md#observability).
