# 03 — Google Drive Setup

Google Drive holds every file customers upload via WhatsApp. The bot creates one folder per lead, named `YYYY-MM-DD_Name_Service`.

---

## Step 1 — Create the root folder

1. Go to [drive.google.com](https://drive.google.com).
2. Click **+ New → Folder**, name it `JAS Leads` (any name works — the bot doesn't care).
3. Open the folder. The URL now looks like:
   ```
   https://drive.google.com/drive/folders/0ABcD-1EfGhIjKlMnOpQrSt
                                          └─── this is GDRIVE_ROOT_FOLDER_ID ───┘
   ```
4. Paste that ID into `.env` as `GDRIVE_ROOT_FOLDER_ID`.

---

## Step 2 — Decide the storage location

You have two options:

### Option A — Personal "My Drive" (default in the workflow JSON)
The folder lives under the n8n user's personal Drive. Easy to set up, but tied to one Google account. If that person leaves the team, transferring ownership is messy.

### Option B — Shared Drive (recommended for teams)
Owned by the team, not by an individual. Best for production.

1. In Google Drive sidebar → **Shared drives → + New** → create `JAS Studios`.
2. Move (or create) the `JAS Leads` folder inside the shared drive.
3. **Important:** in the workflow, change the `driveId` parameter on `Drive: Find Folder`, `Drive: Create Folder`, and `Drive: Upload File` from `My Drive` to the shared drive ID. You can find the shared drive ID by opening the shared drive — the URL ends in `/folders/<sharedDriveId>`.

---

## Step 3 — Add the OAuth credential in n8n

If you already created a **Google Sheets OAuth2** credential in [`02-setup-google-sheets.md`](./02-setup-google-sheets.md), Drive scopes are usually included alongside Sheets. Otherwise:

1. n8n **Settings → Credentials → New** → **Google Drive OAuth2 API**.
2. Reuse the same Client ID + Client Secret from the Google Cloud project you set up for Sheets — just enable **Google Drive API** in that project (Library → search → Enable).
3. Connect, authorize, save. Copy the credential ID.

---

## Step 4 — Wire the credential

After importing the workflow, set the credential on these four nodes:

- `Drive: Find Folder`
- `Drive: Create Folder`
- `Drive: Upload File`
- `Drive: Share (anyone)`

The imported JSON has the placeholder `REPLACE_GD_CRED_ID` — pick yours from the dropdown.

---

## Step 5 — Smoke test

In the `Drive: Find Folder` node, click **Execute step** with a manual test value:

```json
{ "folderName": "test-folder" }
```

If it executes without error and returns `[]`, the credential is working. If you get `File not found` for the parent → your `GDRIVE_ROOT_FOLDER_ID` is wrong, or the OAuth account doesn't have access to that folder.

---

## How file sharing actually works

The `Drive: Share (anyone)` node sets the new file's permission to:

```js
{ role: 'reader', type: 'anyone', allowFileDiscovery: false }
```

That's "anyone with the link can view, but the file is unlisted." This is exactly what `webViewLink` expects to be useful.

### Stricter alternatives

| You want… | Change `type` / `role` to… |
|---|---|
| Anyone in your Workspace domain can view | `type: 'domain'`, `domain: 'jasstudios.com'` |
| Specific email only | `type: 'user'`, `emailAddress: 'alice@jasstudios.com'` |
| View **and download** but no edit | Already so — `reader` blocks edit |
| Disable downloads (view-only) | Add `viewersCanCopyContent: false` on the file metadata via a follow-up `Update File` node |

---

## Folder naming sanitization

The State Machine produces folder names like:

```
2026-05-20_Vijay-McKM_Branding
```

Only `[a-zA-Z0-9_-]` is allowed; everything else (spaces, punctuation, emoji) becomes `-`. This guarantees folder names are valid on every filesystem if you ever sync the Drive folder elsewhere.

---

## Quotas & limits

- **Default Drive limit:** 15 GB (free) / 30+ GB (Workspace). One JPG from WhatsApp is typically ~150 KB; a PDF, ~500 KB. So even at 100 leads/day with 3 files each, you're using ~150 MB/month.
- **Sharing rate limit:** 1000 files/day per user can be shared. Way above any realistic lead volume.
- **API quota:** 12,000 requests / 60 seconds / user. The workflow does ~5 Drive calls per file upload. So you'd need >2000 files/min to hit it.

If you ever scale past those, see [`08-security-and-scaling.md`](./08-security-and-scaling.md#scaling-to-thousands-of-leads-per-day).
