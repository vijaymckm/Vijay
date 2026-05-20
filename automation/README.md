# JAS Studios — WhatsApp Lead Automation System

A production-ready, modular, scalable WhatsApp lead-capture automation built on:

- **n8n** — workflow orchestration
- **WhatsApp Cloud API** (Meta, Graph API **v25.0**) — chat I/O
- **Google Sheets** — lead store + per-user session/state store
- **Google Drive** — file uploads, auto-foldered per lead
- **Gmail** — admin email alerts
- **OpenAI** *(optional)* — fallback / human-handoff assistant
- **Webhook architecture** — secure, verified, retry-safe

## What it does

1. A user lands on the WhatsApp number (Meta Ads / Google Ads / website CTA / `wa.me` link).
2. The bot greets them and walks them through a **multi-step lead form** over WhatsApp:
   `service → name → phone → business → budget → timeline → docs → notes`.
3. Uploaded files (images / PDFs / docs) are pulled from WhatsApp's Media API and pushed into a **Google Drive folder named `YYYY-MM-DD_Name_Service`**.
4. The completed lead is appended to a **Google Sheet** (CRM-ready).
5. The admin gets notified via **WhatsApp + Email** with a full lead summary and the Drive link.
6. The user gets an automatic **confirmation message**.
7. Anywhere in the conversation the user can type `human` to escalate, `menu` to restart, or trigger an OpenAI fallback for free-form questions.

The whole thing runs on **two n8n workflows** (main + dedicated error handler) and a single Google Sheet with two tabs (`Leads` + `Sessions`).

---

## Folder structure

```
automation/
├── README.md                              ← you are here (overview, env vars, quickstart)
├── .env.example                           ← every env var the workflow needs
├── workflows/
│   ├── jas-studios-lead-automation.json   ← MAIN n8n workflow (import this)
│   ├── jas-studios-error-handler.json     ← Dedicated error-trigger sub-workflow
│   └── NODES.md                           ← Node-by-node explanation
├── docs/
│   ├── 01-setup-whatsapp-cloud-api.md     ← App, phone number, token, webhook subscribe
│   ├── 02-setup-google-sheets.md          ← Sheet schema + OAuth credential
│   ├── 03-setup-google-drive.md           ← Root folder + OAuth credential
│   ├── 04-setup-gmail-and-openai.md       ← Gmail OAuth + OpenAI key (optional)
│   ├── 05-webhook-setup.md                ← Webhook URL, HMAC verify, GET handshake
│   ├── 06-error-handling-and-testing.md   ← Crash prevention + manual + curl tests
│   ├── 07-deployment-and-checklist.md     ← Self-host / n8n cloud + go-live checklist
│   └── 08-security-and-scaling.md         ← Hardening + horizontal scaling patterns
└── samples/
    ├── google-sheet-schema.md             ← Exact column headers + types
    └── sample-payloads.json               ← Real WA Cloud API webhook payload examples
```

---

## High-level architecture

```
                 ┌──────────────────────────┐
 Meta Ads ──┐    │   WhatsApp Cloud API     │
 Google Ads ┤───►│   (Meta Graph v25.0)     │
 Website   ─┘    └─────────────┬────────────┘
                               │ webhook (POST)
                               ▼
            ┌──────────────────────────────────────┐
            │  n8n  —  jas-studios-lead-automation │
            │                                      │
            │  Webhook (GET verify + POST events)  │
            │      │                               │
            │      ▼                               │
            │  Safe Parse  (null-checks, returns   │
            │              200 for non-message     │
            │              events: status/read/    │
            │              delivery receipts)      │
            │      │                               │
            │      ▼                               │
            │  Load Session (Google Sheets)        │
            │      │                               │
            │      ▼                               │
            │  State Machine (Code node)           │
            │   ├─ greeting regex → reset          │
            │   ├─ menu / restart / human          │
            │   ├─ service → name → phone → …      │
            │   └─ media → Drive upload branch     │
            │      │                               │
            │      ▼                               │
            │  Persist Session (upsert)            │
            │      │                               │
            │      ▼                               │
            │  IF leadComplete                     │
            │   ├─ Append to Leads sheet           │
            │   ├─ Gmail → admin                   │
            │   └─ WhatsApp → admin                │
            │      │                               │
            │      ▼                               │
            │  Send WhatsApp reply  →  Respond 200 │
            └──────────────────────────────────────┘
                               │
                ┌──────────────┴───────────────┐
                ▼                              ▼
        ┌──────────────┐               ┌──────────────┐
        │ Google Sheet │               │ Google Drive │
        │ Leads        │               │ /JAS Leads/  │
        │ Sessions     │               │   YYYY-MM-DD_│
        └──────────────┘               │   Name_Svc/  │
                                       └──────────────┘
                ▲
                │ on error trigger
                │
            ┌───┴────────────────────────┐
            │ jas-studios-error-handler  │
            │   → log to Sheet + Email   │
            └────────────────────────────┘
```

---

## Quickstart (5 steps)

> Detailed instructions are in [`docs/`](./docs/). This is the speedrun.

1. **Set up credentials in n8n** (see `docs/`):
   - Google Sheets OAuth2
   - Google Drive OAuth2
   - Gmail OAuth2
   - OpenAI API *(optional)*
2. **Create the Google Sheet** with tabs `Leads` and `Sessions` using the schema in [`samples/google-sheet-schema.md`](./samples/google-sheet-schema.md).
3. **Create a Google Drive root folder** (e.g. `JAS Leads`) and copy its folder ID.
4. **Set environment variables** in n8n (see `.env.example`).
5. **Import the two workflows** in n8n:
   - `workflows/jas-studios-error-handler.json` first (so its ID is available)
   - `workflows/jas-studios-lead-automation.json`
   Activate both. Copy the production webhook URL and register it in the Meta Developer Console (see `docs/01-setup-whatsapp-cloud-api.md`).

Send `hi` to your WhatsApp business number — the bot should reply with the menu within 2 seconds.

---

## Environment variables

All secrets live in n8n's environment, **never** in the workflow JSON. The full list with descriptions is in [`.env.example`](./.env.example). Quick reference:

| Variable | Purpose |
|---|---|
| `WHATSAPP_TOKEN` | Permanent system-user access token for Cloud API |
| `WHATSAPP_PHONE_NUMBER_ID` | The phone-number ID used to send messages |
| `WHATSAPP_VERIFY_TOKEN` | Random string used for the GET webhook handshake |
| `WHATSAPP_APP_SECRET` | Used to verify the `X-Hub-Signature-256` HMAC on incoming events |
| `WHATSAPP_GRAPH_VERSION` | Pin to `v25.0` |
| `ADMIN_PHONE` | E.164 number that gets the lead-summary WhatsApp DM |
| `ADMIN_EMAIL` | Email address that gets lead notifications |
| `GDRIVE_ROOT_FOLDER_ID` | Folder under which per-lead folders are created |
| `LEADS_SHEET_ID` | Google Sheet ID containing `Leads` + `Sessions` tabs |
| `OPENAI_API_KEY` | *(optional)* Enables the OpenAI fallback assistant |
| `ERROR_HANDLER_WORKFLOW_ID` | n8n workflow ID of the error handler |

---

## Tech & version pinning

| Component | Version |
|---|---|
| n8n | `>= 1.60.0` (any recent version works; node typeVersions are forward-compatible) |
| WhatsApp Cloud API | `v25.0` |
| Node.js (n8n runtime) | `>= 18` |

---

## Safety guarantees built in

- ✅ **GET webhook verification** — handshake with Meta on `hub.mode=subscribe`.
- ✅ **HMAC verification** — every POST is checked against `X-Hub-Signature-256`.
- ✅ **Null-safe payload parse** — `entry[0]?.changes[0]?.value?.messages?.[0]` style throughout.
- ✅ **Status-event short-circuit** — delivery / read / sent receipts return 200 immediately, never reach the state machine.
- ✅ **Idempotency** — every message has a `wamid`; we de-dupe on it before persisting.
- ✅ **Retry policy** — every external HTTP call retries 3× with exponential backoff.
- ✅ **Always responds 200** to Meta within 5 seconds (Meta retries otherwise → duplicate leads).
- ✅ **Dedicated error workflow** — uncaught failures are logged to a Sheet *and* emailed.

---

## What to read next

- Beginners: → [`docs/01-setup-whatsapp-cloud-api.md`](./docs/01-setup-whatsapp-cloud-api.md)
- Existing n8n users: → [`workflows/NODES.md`](./workflows/NODES.md)
- Going live: → [`docs/07-deployment-and-checklist.md`](./docs/07-deployment-and-checklist.md)
