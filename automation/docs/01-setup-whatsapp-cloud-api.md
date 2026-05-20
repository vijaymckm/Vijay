# 01 — WhatsApp Cloud API Setup

End-to-end Meta setup for the JAS Studios bot. **Goal:** by the end of this doc you'll have a permanent token, a phone-number ID, an app secret, and a verify token — all four go straight into your `.env`.

> Time required: **~25 min** the first time, ~5 min on later projects.

---

## Prerequisites

- A Facebook account with admin access to a **Meta Business** account (create one free at [business.facebook.com](https://business.facebook.com)).
- A phone number you'll use for the bot. **It must NOT already be registered with the regular WhatsApp app.** (If it is, delete WhatsApp on that number first.) For testing you can use Meta's free sandbox number — see Step 3.

---

## Step 1 — Create a Meta App (type: Business)

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) → **Create app**.
2. Use case: **Other** → App type: **Business** → Next.
3. Name it `JAS Studios Bot`, set the contact email, attach to your Meta Business account.
4. After creation, in the left sidebar click **Add product → WhatsApp → Set up**.

---

## Step 2 — Capture the credentials

In the WhatsApp **API Setup** page:

| Field | Where to find it | `.env` variable |
|---|---|---|
| **Temporary access token** | Top of API Setup page (24-hour token — replace later) | `WHATSAPP_TOKEN` (temporary) |
| **Phone number ID** | "From" dropdown → ID below the test number | `WHATSAPP_PHONE_NUMBER_ID` |
| **WhatsApp Business Account ID** | Just below | `WHATSAPP_BUSINESS_ACCOUNT_ID` |
| **App Secret** | Left sidebar → App settings → Basic → click "Show" next to App Secret | `WHATSAPP_APP_SECRET` |

Set `WHATSAPP_GRAPH_VERSION=v25.0` in your `.env`.

---

## Step 3 — Use the test number (or add your own)

For the first 90 days Meta gives you a free **test phone number**. It can only message up to 5 pre-registered recipient numbers. Add your own personal WhatsApp number in **API Setup → To → Manage phone number list**.

When you're ready for production:
1. Click **Add phone number**.
2. Enter your business number, choose SMS or voice OTP, complete the verification.
3. Set a display name (this is what users see at the top of the chat — e.g. `JAS Studios`). Display name approval takes 1–2 business days.

---

## Step 4 — Create a permanent system-user token (production)

The 24-hour token from Step 2 is fine for testing, but it expires. For production you need a permanent token issued to a **System User**.

1. Go to [business.facebook.com/settings](https://business.facebook.com/settings) → **System users** → **Add**.
2. Name: `JAS n8n bot`, Role: **Admin**. Create.
3. Click **Add Assets** → **Apps** → select your app → grant **Full control**. Click **Save**.
4. Click **Add Assets** → **WhatsApp Accounts** → select your WABA → grant **Full control**.
5. Click **Generate new token** → select your app → check these scopes:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
   - Token expiration: **Never**.
6. Copy the long token starting with `EAAG…` and paste it into your `.env` as `WHATSAPP_TOKEN`. **This token never expires unless you revoke it.**

> Security tip: rotate this token annually. See [`08-security-and-scaling.md`](./08-security-and-scaling.md).

---

## Step 5 — Pick a verify token

Generate a long random string. Anything you like, just keep it secret.

```bash
openssl rand -hex 32
```

Paste it into `.env` as `WHATSAPP_VERIFY_TOKEN`. Meta will echo it back to you during the GET handshake (Step 7).

---

## Step 6 — Smoke-test the API from your laptop

Before involving n8n, prove the credentials work:

```bash
# Replace the three placeholders.
curl -X POST "https://graph.facebook.com/v25.0/<PHONE_NUMBER_ID>/messages" \
  -H "Authorization: Bearer <WHATSAPP_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "<YOUR_PERSONAL_E164_NUMBER>",
    "type": "template",
    "template": { "name": "hello_world", "language": { "code": "en_US" } }
  }'
```

You should receive a "Hello world!" message on WhatsApp within a few seconds. If you get an error:
- `(#100) The parameter messaging_product is required` → wrong endpoint URL.
- `(#10) Application does not have permission` → token is missing the messaging scope.
- `(#131030) Recipient phone number not in allowed list` → add the number in API Setup → To list (test number only).

---

## Step 7 — Subscribe the webhook (after n8n is up)

This step requires that you've already imported the workflows and have a public webhook URL. See [`05-webhook-setup.md`](./05-webhook-setup.md). You'll come back here.

In the WhatsApp product page → **Configuration** → Webhook:

1. **Callback URL:** `https://<your-n8n-host>/webhook/whatsapp`
   *(For first-time activation use `https://<your-n8n-host>/webhook-test/whatsapp` to point at the test webhook URL n8n exposes when the workflow is unsaved.)*
2. **Verify token:** the value from Step 5.
3. Click **Verify and Save**. Meta will hit your webhook with a GET; if your `Webhook (GET verify)` branch returns the challenge correctly, the dialog turns green.
4. Click **Manage** under "Webhook fields" and subscribe to:
   - `messages` ← required.
   - `message_template_status_update` ← optional, for template approval/rejection events.

You'll know it's working when Meta sends a small **test webhook**. Watch your n8n executions tab.

---

## Step 8 — Lock down to production

Before going live:

- ✅ Replace the temporary 24-h token with the permanent system-user token (Step 4).
- ✅ Set `WHATSAPP_APP_SECRET` so HMAC verification kicks in.
- ✅ Make sure your phone number's **display name** is approved.
- ✅ In **WhatsApp Manager** → Phone numbers → click your number → **Profile** → fill in business description, address, website.
- ✅ Set up a `lead_alert` message template if you plan to DM the admin outside the 24-h window. See [`08-security-and-scaling.md`](./08-security-and-scaling.md#message-templates).

---

## Troubleshooting cheat-sheet

| Symptom | Most likely cause |
|---|---|
| Webhook verify dialog stays red | Wrong verify token in `.env`, or n8n workflow is inactive |
| Workflow runs but no reply | Check the **Webhook (POST events)** node executions panel — most likely the bot tried to message a non-allowed test recipient |
| Repeated duplicate messages | Workflow is taking >5 s and Meta is retrying. Check the State Machine node for slow code, or the Drive upload for a slow network |
| `(#190) Invalid OAuth access token` | Temp token expired — generate the permanent one in Step 4 |
| `Recipient phone number not in allowed list` | Add the recipient under API Setup → To list (test number limitation only) |
| `(#132000) Number of parameters does not match` | You're trying to send a template but the variables don't match the approved template. Switch to plain `text` body for testing |
