# 02 — Google Sheets Setup

This bot uses **one** spreadsheet with **three** tabs. Setting it up takes ~10 minutes.

---

## Step 1 — Create the sheet

1. Go to [sheets.new](https://sheets.new) (creates a fresh sheet).
2. Rename the file to `JAS Studios — Leads`.
3. Copy the **spreadsheet ID** from the URL — it's the long string between `/d/` and `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789ABCDEFG/edit
                                          └─────────────── this is LEADS_SHEET_ID ──────────────┘
   ```
   Paste it into `.env` as `LEADS_SHEET_ID`.

---

## Step 2 — Create the three tabs

Rename the default `Sheet1` tab to **`Leads`**, then add two more tabs called **`Sessions`** and **`Errors`** (right-click the tab area → Insert sheet).

> Tab names matter — they're referenced by `LEADS_SHEET_TAB`, `SESSIONS_SHEET_TAB`, and the hardcoded `"Errors"` value in the error workflow.

### `Leads` tab (row 1 = headers, exactly these names, exactly this order)

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | Business Name | Service | Budget | Timeline | Notes | Google Drive File Link | Lead Status |

### `Sessions` tab

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| phone | displayName | step | name | altPhone | businessName | service | budget | timeline | notes | fileLinks | updatedAt |

### `Errors` tab

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| occurredAt | workflowName | executionId | executionUrl | lastNode | errorName | errorMessage | errorStack |

> **Why two separate "lead" tabs?** `Sessions` is the live chat state (one row per phone number, mutated as the user progresses). `Leads` is the immutable record of completed enquiries (one row per finished conversation). Keeping them separate makes the sales view clean and the bot logic simple.

The full schema with descriptions is in [`../samples/google-sheet-schema.md`](../samples/google-sheet-schema.md).

---

## Step 3 — Add the OAuth credential in n8n

1. In n8n: **Settings → Credentials → New** → search **Google Sheets OAuth2 API**.
2. n8n shows you a **Redirect URI** — copy it.
3. Open the [Google Cloud Console](https://console.cloud.google.com), create (or pick) a project. Then:
   - **APIs & Services → Library** → enable **Google Sheets API** and **Google Drive API** (Sheets needs Drive scopes too).
   - **APIs & Services → OAuth consent screen** → User type **External** → fill the basics, add your email as a test user.
   - **APIs & Services → Credentials → Create credentials → OAuth client ID** → Application type **Web**, paste the redirect URI from n8n.
   - Copy the **Client ID** and **Client Secret**.
4. Back in n8n, paste them into the credential and click **Connect my account**. Authorize.
5. Save the credential. Note the credential **ID** (visible in the URL once saved).

---

## Step 4 — Wire the credential into the workflow

After importing `jas-studios-lead-automation.json`:

1. Open each Google Sheets node (`Load Session`, `Upsert Session`, `Append Lead`).
2. In the **Credentials** dropdown, select the credential you created in Step 3.
   *(The imported JSON has a placeholder `REPLACE_GS_CRED_ID` — n8n will warn that the credential is missing. Just pick yours from the dropdown.)*
3. Repeat for the error handler workflow's `Log to Sheet (Errors tab)` node.

---

## Step 5 — Verify

1. In `Load Session`, click **Execute step**. It should run cleanly and return `[]` (or the test row you put in `Sessions` if any).
2. In `Append Lead`, click **Execute step** with a fake input. A new row should appear in your `Leads` tab.

If you get **`The caller does not have permission`**:
- The Google account that authorized the credential isn't a viewer/editor on the sheet.
- Easiest fix: share the sheet with that account as **Editor**.

If you get **`Unable to parse range: Leads`**:
- The tab name is wrong. Tab names are case-sensitive and must exactly match `LEADS_SHEET_TAB`.

---

## Optional: protected ranges

To prevent accidental edits to the `Sessions` and `Errors` tabs (which n8n owns):

1. Right-click each tab → **Protect sheet**.
2. Restrict edits to a single Google account (the one n8n uses to authenticate).

This way teammates can read but not corrupt the bot's state.
