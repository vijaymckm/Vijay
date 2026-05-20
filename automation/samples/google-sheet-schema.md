# Google Sheet Schema Reference

The bot uses **one** spreadsheet (`LEADS_SHEET_ID`) with **three** tabs. Headers must match exactly — column names are case-sensitive and are referenced by name in the workflow's column-mapping config.

> Quick way to bootstrap: copy this template — [link](#bootstrap-sheet-via-google-apps-script) at the bottom — runs a single Apps Script that creates all three tabs with headers in 5 seconds.

---

## Tab 1 — `Leads` (the CRM record)

One row per **completed** enquiry. Append-only from the bot; sales team manually updates `Lead Status`.

| Col | Header | Type | Filled by | Example | Notes |
|---|---|---|---|---|---|
| A | `Timestamp` | ISO 8601 datetime | Bot | `2026-05-20T14:31:08.123Z` | When the lead was finalized |
| B | `Name` | string | Bot | `Vijay McKenna` | From `AWAIT_NAME` step |
| C | `Phone` | string (E.164, no `+`) | Bot | `919876543210` | Uses `altPhone` if user gave one, else WhatsApp `from` |
| D | `Business Name` | string | Bot | `JAS Studios` | Empty string if user replied `NA` |
| E | `Service` | enum | Bot | `Web Design` | One of: `Branding`, `Web Design`, `Digital Marketing`, `Studio Rental` |
| F | `Budget` | string | Bot | `$1500` or `₹50,000` | Free-text — kept as-is |
| G | `Timeline` | string | Bot | `2 weeks` | Free-text |
| H | `Notes` | string | Bot | `Need a landing page` | Empty if user replied `NA` |
| I | `Google Drive File Link` | string (newline-separated URLs) | Bot | `https://drive.google.com/file/d/...\nhttps://drive.google.com/file/d/...` | Each line is one `webViewLink`. Empty if no files |
| J | `Lead Status` | enum | Sales team | `NEW` | Bot writes `NEW`. Suggested values: `NEW`, `CONTACTED`, `QUALIFIED`, `PROPOSAL_SENT`, `WON`, `LOST` |

### Header row (paste into A1)

```
Timestamp	Name	Phone	Business Name	Service	Budget	Timeline	Notes	Google Drive File Link	Lead Status
```

### Optional extras
You can add columns to the right without breaking anything. The workflow only writes to the columns above; any additional columns (e.g. `Owner`, `Next Step`, `Deal Value`) are managed by your team.

---

## Tab 2 — `Sessions` (live conversation state)

One row **per phone number**, mutated as the user progresses. Upserted on every inbound message.

| Col | Header | Type | Example | Notes |
|---|---|---|---|---|
| A | `phone` | string | `919876543210` | **Primary key** — `appendOrUpdate` matches on this |
| B | `displayName` | string | `Vijay` | Whatever WhatsApp profile name we received |
| C | `step` | enum | `AWAIT_BUDGET` | One of `NEW`, `AWAIT_SERVICE`, `AWAIT_NAME`, `AWAIT_PHONE`, `AWAIT_BUSINESS`, `AWAIT_BUDGET`, `AWAIT_TIMELINE`, `AWAIT_DOCS`, `AWAIT_NOTES`, `DONE`, `HUMAN` |
| D | `name` | string | `Vijay McKenna` | Partial — populated from `AWAIT_NAME` onward |
| E | `altPhone` | string | `919876543210` | Optional alt number user provided |
| F | `businessName` | string | `JAS Studios` | |
| G | `service` | string | `Web Design` | |
| H | `budget` | string | `$1500` | |
| I | `timeline` | string | `2 weeks` | |
| J | `notes` | string | `Need a landing page` | |
| K | `fileLinks` | string | `https://...\nhttps://...` | Newline-separated `webViewLink`s as files come in |
| L | `updatedAt` | ISO 8601 datetime | `2026-05-20T14:25:00.000Z` | Last write time — useful for pruning |

### Header row (paste into A1)

```
phone	displayName	step	name	altPhone	businessName	service	budget	timeline	notes	fileLinks	updatedAt
```

### Pruning old sessions
Add a daily Cron-triggered workflow that deletes rows where `step = 'DONE'` AND `updatedAt < now - 30 days`. See [`../docs/08-security-and-scaling.md`](../docs/08-security-and-scaling.md#4-data-minimization--pii).

---

## Tab 3 — `Errors` (error workflow audit log)

Append-only log written by `jas-studios-error-handler.json`. One row per uncaught failure.

| Col | Header | Type | Example | Notes |
|---|---|---|---|---|
| A | `occurredAt` | ISO 8601 datetime | `2026-05-20T14:31:08.123Z` | When the failure was caught |
| B | `workflowName` | string | `JAS Studios — Lead Automation` | Always the same in normal use |
| C | `executionId` | string | `9f823a…` | n8n's internal execution ID |
| D | `executionUrl` | URL | `https://n8n.example.com/workflow/abc/executions/9f823a…` | Click to debug |
| E | `lastNode` | string | `Drive: Upload File` | Last node before the failure |
| F | `errorName` | string | `NodeApiError` | n8n's error class |
| G | `errorMessage` | string | `Forbidden - perhaps check your credentials?` | Human-readable |
| H | `errorStack` | string | `Error: …\n  at …` | Stack trace (truncated to 4000 chars) |

### Header row (paste into A1)

```
occurredAt	workflowName	executionId	executionUrl	lastNode	errorName	errorMessage	errorStack
```

---

## Bootstrap sheet via Google Apps Script

Fastest way to set up all three tabs correctly. In your spreadsheet:

1. **Extensions → Apps Script**.
2. Paste the script below.
3. **Save → Run → setupSheet** (grant the auth prompt).

```js
function setupSheet() {
  const ss = SpreadsheetApp.getActive();
  const tabs = {
    Leads: ['Timestamp','Name','Phone','Business Name','Service','Budget','Timeline','Notes','Google Drive File Link','Lead Status'],
    Sessions: ['phone','displayName','step','name','altPhone','businessName','service','budget','timeline','notes','fileLinks','updatedAt'],
    Errors: ['occurredAt','workflowName','executionId','executionUrl','lastNode','errorName','errorMessage','errorStack'],
  };
  for (const [name, headers] of Object.entries(tabs)) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    sh.clear();
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, headers.length);
  }
  // Drop the default Sheet1 if it's empty
  const def = ss.getSheetByName('Sheet1');
  if (def && def.getLastRow() === 0 && Object.keys(tabs).indexOf('Sheet1') < 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(def);
  }
  Logger.log('Sheet bootstrap complete');
}
```

---

## Data validation (recommended)

In Google Sheets, apply data validation to the enum columns to prevent typos by humans:

| Tab | Column | Rule |
|---|---|---|
| `Leads` | `Service` | List from range, fixed: `Branding`, `Web Design`, `Digital Marketing`, `Studio Rental` |
| `Leads` | `Lead Status` | List, fixed: `NEW`, `CONTACTED`, `QUALIFIED`, `PROPOSAL_SENT`, `WON`, `LOST` |
| `Sessions` | `step` | List, fixed: the 11 step names listed above |

Right-click the column → **Data validation → Dropdown (from a list)** → enter the values comma-separated.
