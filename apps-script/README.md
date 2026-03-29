# Apps Script Setup

## 1) Create script project
1. Open the target Google Sheet.
2. Extensions -> Apps Script.
3. Replace default file with `Code.gs` from this folder.

## 2) Script properties
In Apps Script: Project Settings -> Script Properties, add:
- `SPREADSHEET_ID` = your sheet id
- `AUTH_SECRET` = long random secret (used for hash helper)

## 3) Deploy Web App
1. Deploy -> New deployment.
2. Type: Web app.
3. Execute as: Me.
4. Who has access: Anyone with the link (or your domain).
5. Copy Web App URL.

## 4) Frontend config
Edit `js/api-config.js` and set:
- `window.SEB_API_BASE = "<WEB_APP_URL>"`

Make sure each integrated page includes scripts in this order:

```html
<script src="../js/auth.js" defer></script>
<script src="../js/api-config.js" defer></script>
<script src="../js/seb-api.js" defer></script>
<script src="../js/main.js" defer></script>
```

## 5) Seed sample data (test immediately)
1. In Apps Script editor, add file `Seed.gs` from this repo.
2. Save all files.
3. Run function `seedSampleData` once.
4. Accept authorization when prompted.
5. Verify sheets `users`, `devices`, `borrow_transactions`, `maintenance_logs` are created.

Demo login seeded by script:
- Email: `user@school.edu`
- Password: `123456`

## 6) Notes
- This sample uses SHA-256 helper in script for password verification.
- For production, prefer server-side auth with JWT and stricter access control.
- Store your Google Sheet link in `docs/google-sheet-link.md`.
