# 04 — Gmail + OpenAI Setup

Two optional-but-recommended add-ons. Gmail powers the admin email alerts. OpenAI is the free-form fallback when the bot doesn't know how to script a reply.

---

## Part A — Gmail OAuth credential (~5 min)

Gmail in n8n uses OAuth2 (the **same** Google project you set up for Sheets/Drive — no extra cloud config needed, just an extra scope).

### Step 1 — Enable the Gmail API

1. [Google Cloud Console](https://console.cloud.google.com) → your project → **APIs & Services → Library**.
2. Search **Gmail API** → **Enable**.

### Step 2 — Create the n8n credential

1. n8n **Settings → Credentials → New** → **Gmail OAuth2 API**.
2. Reuse the existing **Client ID** + **Client Secret** from your Google Cloud project.
3. The credential's redirect URI is the same as the others — already whitelisted in step 2 of [`02-setup-google-sheets.md`](./02-setup-google-sheets.md).
4. Click **Connect my account**, sign in **with the email address that should appear as the sender** (e.g. `bot@jasstudios.com` or your personal admin email), grant access.
5. Save.

### Step 3 — Wire it into both workflows

- Main workflow → `Email Admin` node → Credentials dropdown → pick the new Gmail credential.
- Error handler workflow → `Email Admin (alert)` node → same.

The imported JSONs have the placeholder `REPLACE_GMAIL_CRED_ID` — n8n will warn until you swap it.

### Step 4 — Set `ADMIN_EMAIL`

In `.env`, set `ADMIN_EMAIL` to the address that should **receive** the alerts. (It can be the same as the sender or different — Gmail will send-as the authenticated account.)

### Optional: send-as another address

If you want emails to appear from `notifications@jasstudios.com` even though the OAuth account is `someone@gmail.com`:

1. In Gmail web UI: **Settings → Accounts → Send mail as → Add another email address**.
2. Verify ownership of `notifications@jasstudios.com` (Gmail will email it a code).
3. In the n8n `Email Admin` node, add `From` under **Options** and set it to `notifications@jasstudios.com`.

---

## Part B — OpenAI fallback (~3 min)

The OpenAI branch is **optional**. If you leave `OPENAI_API_KEY` unset, the State Machine never sets `useAiFallback=true`, so the entire OpenAI sub-branch is a no-op and never costs anything.

### When does it run?

Only when **all three** are true:
1. `$env.OPENAI_API_KEY` is set.
2. The user is in step `DONE` or `HUMAN` (i.e. the lead form is finished).
3. The user sent free-form text (not a scripted command like `menu` / `human`).

So the user's first 7 messages always go through deterministic scripted replies. AI only kicks in for follow-up chat after the lead is captured.

### Setup

1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → **Create new secret key**, name it `JAS n8n bot`.
2. Copy the `sk-...` key into `.env` as `OPENAI_API_KEY`.
3. Pick a model — the workflow defaults to `gpt-4o-mini` (cheap + fast). Change `OPENAI_MODEL` in `.env` to anything OpenAI's chat completions supports (`gpt-4o`, `gpt-4.1-mini`, etc.).
4. Set up billing in your OpenAI dashboard. Even at 1000 follow-up messages/day, `gpt-4o-mini` costs around $0.50/day at the time of writing.

### System prompt

The system prompt is hard-coded into the `OpenAI fallback` HTTP node body and asks the model to:
- act as the JAS Studios concierge,
- never invent prices,
- never promise dates,
- escalate to a human if the user is upset.

To customize it, open the `OpenAI fallback` node in n8n and edit the `system` content inside `jsonBody`. No environment variable is needed — the prompt is short enough to live in the workflow itself.

### Cost guardrails

If you're paranoid about runaway cost:

- Set `OPENAI_MODEL=gpt-4o-mini` (you already have this).
- In the `OpenAI fallback` node body, lower `temperature` to `0` and add `"max_tokens": 250` (already roughly bounded by the system prompt's "max 4 short lines" instruction).
- Add a daily request counter via a Sheets `read` + `count` step before the OpenAI call, and short-circuit if the counter is above your threshold.

---

## Quick reference

| Variable | Required for | Example |
|---|---|---|
| `ADMIN_EMAIL` | Lead alerts + error alerts | `admin@jasstudios.com` |
| `ADMIN_FROM_NAME` | Display name on outgoing emails | `JAS Studios Bot` |
| `OPENAI_API_KEY` | AI fallback (optional) | `sk-...` |
| `OPENAI_MODEL` | Which model to call | `gpt-4o-mini` |

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `403 Permission denied` on Gmail send | Gmail API not enabled on the project, or the OAuth account isn't allowed to send mail (e.g. it's a personal account that triggered a security review) |
| Emails arrive, but `From` is wrong | n8n's Gmail node sends as the authenticated account by default; add a `From` under Options |
| OpenAI replies are slow (>3 s) | Switch `OPENAI_MODEL` to `gpt-4o-mini`, or lower `max_tokens`. Remember Meta retries if your webhook takes >5 s |
| `401 Unauthorized` from OpenAI | Key is wrong or your billing isn't set up |
| AI replies are wildly off-topic | Tighten the system prompt in the `OpenAI fallback` node — restrict it to the four services and forbid speculation |
