# Node-by-Node Explanation

This document walks through every node in **`jas-studios-lead-automation.json`** and **`jas-studios-error-handler.json`** — what each node does, why it's there, and the key expressions / parameters that make it work.

> If you're importing the JSON into n8n for the first time, also read [`../docs/05-webhook-setup.md`](../docs/05-webhook-setup.md) and [`../docs/07-deployment-and-checklist.md`](../docs/07-deployment-and-checklist.md).

---

## Conventions

- **`$env.X`** → environment variable defined in `.env` (or in n8n's Variables UI for n8n Cloud). All secrets live there, never in the workflow JSON.
- **`$json.x`** → field on the current item flowing through the node.
- **`$('Node Name').first().json.x`** → reference to a field on the output of an earlier-named node. We use this in the State Machine to pull session and parsed-payload data without depending on order.
- **`={{ ... }}`** → an n8n expression. The leading `=` tells n8n "this string is an expression, not a literal."
- All HTTP nodes have **`retryOnFail: true, maxTries: 3, waitBetweenTries: 2000`** unless stated otherwise. Same for Sheets / Drive / Gmail nodes.

---

## Main workflow — `jas-studios-lead-automation.json`

The workflow has **two entry points** (a GET webhook and a POST webhook on the same path) and **one exit point** (a single shared `Respond 200` node).

### A) Verification branch (Meta GET handshake)

#### 1. `Webhook (GET verify)` — `n8n-nodes-base.webhook`
- **Method:** `GET`
- **Path:** `whatsapp` (full URL: `https://<n8n>/webhook/whatsapp`)
- **Response mode:** `responseNode` (we use a separate `Respond to Webhook` later so we can craft an exact response)
- **Why:** Meta requires you to prove the URL is yours by responding to a one-time GET handshake. See [`../docs/05-webhook-setup.md`](../docs/05-webhook-setup.md).

#### 2. `Verify GET token` — `n8n-nodes-base.code`
Reads three query params Meta sends: `hub.mode`, `hub.verify_token`, `hub.challenge`. If `hub.mode === 'subscribe'` **and** the token equals `$env.WHATSAPP_VERIFY_TOKEN`, it sets `ok=true` and forwards the challenge string. Otherwise `ok=false`.

#### 3. `Respond hub.challenge` — `n8n-nodes-base.respondToWebhook`
- **Body:** `={{$json.challenge}}` (Meta expects the challenge echoed verbatim — no JSON, no quotes).
- **Status code:** `={{$json.ok ? 200 : 403}}`.
- **Content-Type:** `text/plain`.

---

### B) Event branch (Meta POST events)

#### 4. `Webhook (POST events)` — `n8n-nodes-base.webhook`
- **Method:** `POST`, **Path:** `whatsapp`, **Response mode:** `responseNode`.
- **Important option:** `rawBody: true`. This makes n8n preserve the raw request body so the next node can compute the HMAC against the exact bytes Meta signed. Without this, JSON re-serialization would invalidate every signature.

#### 5. `Safe Parse + HMAC` — `n8n-nodes-base.code`
Three jobs in one place so the rest of the workflow only deals with clean fields:

1. **HMAC verification.** If `$env.WHATSAPP_APP_SECRET` is set, computes `sha256=` HMAC over the raw body and compares it to the `X-Hub-Signature-256` header using `crypto.timingSafeEqual`. If the secret is unset, verification is **skipped** (with `hmacReason='skipped'`) — useful for first-day debugging, but you should set it before going live (see [`../docs/08-security-and-scaling.md`](../docs/08-security-and-scaling.md)).
2. **Null-safe payload extraction.** Walks the deeply-nested Meta payload defensively:
   ```js
   body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
   ```
   Status events (delivery / read / sent), template events, and empty bodies all leave `messages` undefined → we fall through with `isMessage=false` and short-circuit downstream.
3. **Type-aware extraction.** Pulls `text` for text/button/interactive messages, and `mediaId` + `mediaMime` + `mediaFilename` for image/document/video/audio. Sets `isMedia` for the routing branch downstream.

Output keys: `hmacOk, isMessage, isStatus, isMedia, from, wamid, displayName, messageType, text, mediaId, mediaMime, mediaFilename`.

#### 6. `IF HMAC ok` — `n8n-nodes-base.if`
- **True →** `IF isMessage`.
- **False →** `Respond 403` (Meta will retry, but signed payloads should never fail unless your `WHATSAPP_APP_SECRET` is wrong or someone is spoofing your endpoint).

#### 7. `Respond 403` — `n8n-nodes-base.respondToWebhook`
Returns `403 forbidden` for unsigned / wrongly-signed events.

#### 8. `IF isMessage`
- **True →** `Load Session`.
- **False →** `Respond 200 (status/empty)`. Status updates, delivery receipts, read receipts, and any other non-message webhook (e.g. account quality alerts) **must** still get a `200`. If we don't, Meta retries with exponential back-off and may flag the endpoint as unhealthy.

#### 9. `Respond 200 (status/empty)`
Plain-text `ok`, status `200`. End of branch.

#### 10. `Load Session` — `n8n-nodes-base.googleSheets`
- **Operation:** `read` with a filter on `phone === $json.from`.
- **`returnFirstMatch: true`** so we never get more than one row.
- **`alwaysOutputData: true`** so a "no row found" still produces an item (an empty row), which the State Machine treats as `step = 'NEW'`.
- **Tab:** `$env.SESSIONS_SHEET_TAB` (default `Sessions`).
- **Retry:** 3 tries with 2 s back-off — Sheets is usually fine but occasionally rate-limits.

#### 11. `State Machine` — `n8n-nodes-base.code`
The brain of the bot. See [`../README.md`](../README.md) for the full step list. Key behaviors:

- **Universal commands** matched first via regex:
  - `hi / hello / hlo / hai / hey / helo / namaste / hola` → reset to `NEW` (wipes partial answers).
  - `menu / restart / reset / start over` → reset to `NEW`.
  - `human / agent / talk to human / representative / support` → `HUMAN` handoff.
- **FSM transitions** (one branch per current step) produce: `reply`, `nextStep`, `leadComplete`, and an updated `lead` object.
- **`useAiFallback`** is set to `true` when the user is in `DONE` or `HUMAN` and sends free-form text — only if `$env.OPENAI_API_KEY` is set.
- **`folderName`** is computed as `YYYY-MM-DD_Name_Service`, sanitized to safe characters.

Outputs flow to `IF isMedia`.

#### 12. `IF isMedia`
- **True →** media-upload sub-branch (nodes 13–20).
- **False →** straight into the merge.

---

### C) Media-upload sub-branch (only runs when the user uploaded a file)

#### 13. `Get Media URL` — `n8n-nodes-base.httpRequest`
- `GET https://graph.facebook.com/{{$env.WHATSAPP_GRAPH_VERSION}}/{{$json.mediaId}}` with `Authorization: Bearer {{$env.WHATSAPP_TOKEN}}`.
- Returns a JSON body with a short-lived (5-min) `url` field that points to the actual file bytes.

#### 14. `Download Media (binary)` — `n8n-nodes-base.httpRequest`
- `GET {{$json.url}}` with the same Bearer token.
- **Critical option:** `responseFormat: 'file'`. This makes n8n download the response into a binary property (default name `data`) instead of trying to JSON-parse it.

#### 15. `Drive: Find Folder` — `n8n-nodes-base.googleDrive`
- Resource: `fileFolder`, search by `name === folderName` AND `parent === $env.GDRIVE_ROOT_FOLDER_ID`.
- We pull the folder name from the State Machine via `$('State Machine').first().json.folderName` (so we don't depend on it being on `$json`).

#### 16. `IF folder exists`
- **True →** straight to `Set leadFolderId` (the search result already has `id`).
- **False →** `Drive: Create Folder`.

#### 17. `Drive: Create Folder` — `n8n-nodes-base.googleDrive`
Creates `folderName` under `$env.GDRIVE_ROOT_FOLDER_ID`. Output `id` becomes the new lead folder.

#### 18. `Set leadFolderId` — `n8n-nodes-base.set`
Both branches converge here. We set `leadFolderId = $json.id` so the next node has a single, predictable field name.

#### 19. `Drive: Upload File` — `n8n-nodes-base.googleDrive`
- `inputDataFieldName: 'data'` — pulls the binary stored by node 14.
- `name`: a sanitized filename derived from `mediaFilename`, with a fallback of `upload_<wamid>` and an extension inferred from `mime_type`.
- `folderId`: `={{$json.leadFolderId}}`.

#### 20. `Drive: Share (anyone)` — `n8n-nodes-base.googleDrive`
- Operation: `share`, role: `reader`, type: `anyone`, `allowFileDiscovery: false`.
- Result: an "anyone with the link can view" file. The share node returns `webViewLink`.

> Want stricter access (e.g. domain-restricted)? Change `type` to `domain` and add `domain: jasstudios.com`. See [`../docs/03-setup-google-drive.md`](../docs/03-setup-google-drive.md).

#### 21. `Append link to lead` — `n8n-nodes-base.code`
Reads the `webViewLink` from the share node, then re-builds the State Machine output with `lead.fileLinks` appended (newline-separated). This way downstream nodes see one unified "lead" object, regardless of whether a file was uploaded or not.

---

### D) Persist + notify

#### 22. `Merge (media branches)` — `n8n-nodes-base.merge`
Two-input merge. Inputs:
- `0` ← from `Append link to lead` (media path)
- `1` ← from `IF isMedia` false branch (no media)

The merge passes through whichever item arrived. Either way, downstream gets a complete `lead` object.

#### 23. `Upsert Session` — `n8n-nodes-base.googleSheets`
- **Operation:** `appendOrUpdate`, **Match column:** `phone`.
- Writes/updates the `Sessions` row so the next message from this phone number sees the current step + accumulated answers.
- Includes `updatedAt = $now.toISO()` for diagnostics.

#### 24. `IF leadComplete`
- **True →** fan out to `Append Lead`, `Email Admin`, and `WhatsApp → Admin` simultaneously. The lead path then re-converges at `Merge (lead-complete)`.
- **False →** straight to `Merge (lead-complete)` (input index 1).

#### 25. `Append Lead` — `n8n-nodes-base.googleSheets`
- **Operation:** `append` to the `Leads` tab.
- Maps the lead fields to the exact column headers from [`../samples/google-sheet-schema.md`](../samples/google-sheet-schema.md):
  ```
  Timestamp, Name, Phone, Business Name, Service, Budget,
  Timeline, Notes, Google Drive File Link, Lead Status
  ```
- `Lead Status` defaults to `NEW`. Update it manually in the sheet (`CONTACTED`, `QUALIFIED`, `WON`, `LOST`) — it's CRM-ready.

#### 26. `Email Admin` — `n8n-nodes-base.gmail`
HTML email to `$env.ADMIN_EMAIL` with a clean two-column table summary and the Drive file links. Subject is auto-templated with the lead name and service.

#### 27. `WhatsApp → Admin` — `n8n-nodes-base.httpRequest`
Sends a plain text WhatsApp DM to `$env.ADMIN_PHONE` with the same lead summary. Uses Meta's standard `text` message body.

> **Note on 24-hour window.** Meta only allows free-form messages within 24 hours of the customer's last reply, OR template messages always. Since this is a DM to *yourself* (the admin), you can opt the admin number into your own WhatsApp business account and treat it as an internal channel — it'll always be inside the 24-hour window after any test message. For production, consider creating an approved `lead_alert` template instead.

#### 28. `Merge (lead-complete)`
Two-input merge that re-converges the lead-complete path with the in-progress path. Continues to `IF useAiFallback`.

---

### E) Reply path (scripted reply OR OpenAI fallback)

#### 29. `IF useAiFallback`
- **True →** call OpenAI (only fires if the State Machine left `reply` empty AND the user is in `DONE` or `HUMAN` AND `$env.OPENAI_API_KEY` is set).
- **False →** straight to `Merge (reply branches)` so the scripted `reply` flows through.

#### 30. `OpenAI fallback` — `n8n-nodes-base.httpRequest`
- `POST https://api.openai.com/v1/chat/completions`.
- Body: a small system prompt locking the bot to JAS Studios' scope + the user's text as the user message.
- `onError: 'continueRegularOutput'` so an OpenAI hiccup doesn't crash the workflow.

#### 31. `Set AI reply` — `n8n-nodes-base.code`
Pulls `choices[0].message.content` from the OpenAI response, falls back to a generic "we'll get back to you" line if the response was malformed, and re-emits the State Machine output with `reply` populated.

#### 32. `Merge (reply branches)`
Two-input merge.

#### 33. `IF has reply`
Final guard: only sends a WhatsApp message if there's actually text to send. (The user might have just uploaded a file with no caption while in `AWAIT_DOCS` — covered, because the FSM produces an acknowledgement reply for that case. But this guard makes the workflow tolerant of any future flow where reply is intentionally blank.)

#### 34. `WhatsApp → User` — `n8n-nodes-base.httpRequest`
- `POST https://graph.facebook.com/<v25.0>/<phone-number-id>/messages`.
- Body uses `JSON.stringify($json.reply)` so newlines, quotes, and emoji in the reply are correctly JSON-escaped.

#### 35. `Respond 200`
Always send `200 OK` to Meta within 5 s. If we don't, Meta will retry the same event up to 2× more, which would create duplicate leads.

---

## Error handler — `jas-studios-error-handler.json`

This workflow is referenced by the main workflow's `settings.errorWorkflow` field. n8n triggers it automatically whenever any node in the main workflow throws an unhandled error.

### 1. `Error Trigger`
Built-in n8n trigger that fires with the failure context: `workflow`, `execution`, `execution.error`, `execution.lastNodeExecuted`, `execution.mode`.

### 2. `Normalize Error`
Flattens the trigger payload into a single row with `occurredAt, workflowName, executionId, executionUrl, lastNode, errorName, errorMessage, errorStack`. Stack is truncated at 4000 chars to keep the Sheet cell happy.

### 3. `Log to Sheet (Errors tab)`
Appends a row to a third tab in the same sheet called `Errors`. Schema in [`../samples/google-sheet-schema.md`](../samples/google-sheet-schema.md).

### 4. `Email Admin (alert)`
Same `$env.ADMIN_EMAIL` recipient, but red-themed and with a clickable execution URL so you can jump straight to the n8n debugger.

Both nodes have `continueOnFail: true` — if the Sheet log fails, the email still fires (and vice versa). This is critical because the error handler is your last line of defense; one of its two outputs failing must never silence the other.

---

## Why a Code-node state machine instead of n8n Switch nodes?

A `Switch` per step would mean **8 branches × 2-3 follow-up nodes each = ~24 extra nodes** plus an explosion of merges. The `State Machine` Code node:

- keeps the entire conversational logic in **one auditable place** (~150 lines),
- allows fine-grained regex / validation per step,
- unit-tests trivially (copy-paste into a Node REPL with mock inputs),
- extends to new steps without re-wiring the canvas.

Trade-off: the logic is in JS, not visually wired. We compensate with the detailed comments inside the node and this doc.

---

## Tweaking common things

| You want to… | Edit this |
|---|---|
| Change menu options | `SERVICES` map in `State Machine` |
| Add a new question | Add a new step name to `STEPS` and a new `case` block |
| Change confirmation copy | `case 'AWAIT_NOTES'` `reply` |
| Switch to template-only sending (after 24 h) | `WhatsApp → User` body: change `type` from `text` to `template` and supply `template.name` + `template.language` |
| Stricter HMAC enforcement | Already strict if `WHATSAPP_APP_SECRET` is set. To require it, replace the `if (secret)` skip with a hard fail |
| Skip OpenAI entirely | Leave `OPENAI_API_KEY` unset — the State Machine never sets `useAiFallback=true`, so the branch is a no-op |
| Change folder layout | `folderName` template at the bottom of the State Machine |
| Tag leads automatically | After `Append Lead`, add a `Set` + `Append` to a `Tags` sheet keyed on phone, or compute a `Lead Status` based on budget |
