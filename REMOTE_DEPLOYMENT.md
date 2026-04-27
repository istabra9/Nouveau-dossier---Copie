# Remote Deployment Runbook — Advancia Trainings

End-to-end runbook for deploying this Next.js + MongoDB app on a Windows server reached via Remote Desktop (`mstsc`).

**Target host:** `172.16.145.12`
**Project folder on the remote:** `Nouveau dossier - Copie`
**Listening port:** `3000`

---

## 0. One-time prerequisites on the remote

Open **PowerShell as Administrator** on the remote (Start → type "PowerShell" → right-click → *Run as administrator*).

### 0.1 Install Node.js LTS

Download and run the LTS MSI from https://nodejs.org/ (or via winget):

```powershell
winget install OpenJS.NodeJS.LTS
```

Verify:

```powershell
node -v   # should print v20.x or newer
npm -v
```

### 0.2 Install Git

```powershell
winget install Git.Git
```

Verify: `git --version`

### 0.3 Install MongoDB (if you'll use a local DB)

Two options — pick **one**:

**Option A — Local MongoDB (simpler, runs on the same machine):**

```powershell
winget install MongoDB.Server
```

This installs MongoDB as a Windows Service that auto-starts on boot. Default URI: `mongodb://127.0.0.1:27017`.

Verify it's running:

```powershell
Get-Service MongoDB
# Status should be 'Running'
```

**Option B — MongoDB Atlas (cloud-hosted, recommended for anything real):**

Skip the install. Get a connection string from https://cloud.mongodb.com/ that looks like:
```
mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/advancia?retryWrites=true&w=majority
```

In Atlas → *Network Access* → add the remote's public IP (or `0.0.0.0/0` for an internal-only LAN demo).

### 0.4 Install PM2 globally

```powershell
npm install -g pm2
pm2 --version
```

---

## 1. Get the project on the remote

You have two choices.

**A. Already copied the folder via RDP drag-drop:** skip to step 2.

**B. Use git (preferred — easy updates later):**

```powershell
cd C:\
git clone https://github.com/istabra9/Nouveau-dossier---Copie.git "Nouveau dossier - Copie"
cd "Nouveau dossier - Copie"
```

---

## 2. Create `.env.local` on the remote

In the project folder, create `.env.local` (copy from `.env.example` and edit):

```ini
# Database — pick one block
# Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/advancia
# Atlas (replace USER/PASS/cluster):
# MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/advancia

# Auth — generate a fresh long random string (run the PowerShell line below)
AUTH_SECRET=PASTE_NEW_RANDOM_HEX_HERE

# Public URL the app advertises (used in verification links + OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://172.16.145.12:3000

PAYMENT_PROVIDER=mock
DEFAULT_CURRENCY=TND

# SMTP — leave SMTP_* blank to keep emails as a dev stub (logged to backend/data/sent-emails.json)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=Advancia Trainings <noreply@example.com>

# OAuth — leave blank to keep buttons as friendly "not configured" placeholders
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
FACEBOOK_OAUTH_CLIENT_ID=
FACEBOOK_OAUTH_CLIENT_SECRET=
YAHOO_OAUTH_CLIENT_ID=
YAHOO_OAUTH_CLIENT_SECRET=
```

Generate a strong `AUTH_SECRET` on the remote:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Paste the output as the `AUTH_SECRET` value.

---

## 3. Seed the database (first deploy only)

Populates demo accounts, trainings, categories, etc.

```powershell
npm install         # only if the runbook hasn't done this yet
npm run seed
```

Demo logins after seeding:
- `superadmin@advancia.local` / `SuperAdmin123!`
- `admin@advancia.local` / `Admin123!`
- `user@advancia.local` / `User123!`

---

## 4. Build + start with PM2 — one command

From the project root:

**Option 1 — Double-click `deploy.bat`** (cmd.exe / batch).
**Option 2 — Run `deploy.ps1`** (PowerShell):

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy.ps1
```

What the script does:
1. Pulls latest from git (skipped if not a checkout).
2. `npm ci` (or falls back to `npm install`).
3. `npm run build` — production Turbopack build.
4. Installs PM2 globally if missing.
5. Starts the app under PM2 using `ecosystem.config.cjs` on `0.0.0.0:3000`.
6. Saves the PM2 process list so it can be resurrected on reboot.

Expected final output:

```
 App should be live at:
   http://localhost:3000          (on this machine)
   http://172.16.145.12:3000      (from your network)
```

---

## 5. Make PM2 survive a reboot (Windows)

PM2's `pm2 startup` doesn't natively work on Windows. Use `pm2-windows-startup`:

```powershell
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

After this, on every reboot Windows will start PM2 in the background and resurrect the app.

To re-save after deploying changes:
```powershell
pm2 save
```

---

## 6. Open Windows Firewall on port 3000

Run **once**, in **Administrator PowerShell**:

```powershell
New-NetFirewallRule `
    -DisplayName "Advancia Trainings (3000)" `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 3000
```

To later remove it:

```powershell
Remove-NetFirewallRule -DisplayName "Advancia Trainings (3000)"
```

---

## 7. Verify

On the remote (from a browser):
- `http://localhost:3000` — the home page should load.
- `http://172.16.145.12:3000` — same response.

From your local PC (you on `mstsc`):
- Open `http://172.16.145.12:3000` in a browser. If it loads → done.
- If timeout → step 6 firewall rule wasn't applied, or the remote is on a different VLAN. Run `Test-NetConnection 172.16.145.12 -Port 3000` from your local PC; if it returns `TcpTestSucceeded: False`, the firewall is blocking.

---

## 8. Update workflow (after the first deploy)

Whenever you push new code to GitHub, on the remote:

```powershell
cd "C:\path\to\Nouveau dossier - Copie"
.\deploy.bat        # or .\deploy.ps1
```

That single command pulls, installs, builds, and reloads PM2.

---

## 9. Common operations

```powershell
pm2 status                                # see all processes
pm2 logs advancia-trainings               # tail combined logs
pm2 logs advancia-trainings --lines 200   # last 200 lines
pm2 reload advancia-trainings             # zero-downtime reload
pm2 restart advancia-trainings            # full restart
pm2 stop advancia-trainings               # stop the app
pm2 delete advancia-trainings             # remove from PM2 entirely
pm2 monit                                 # live CPU/RAM dashboard
```

Logs on disk: `logs\out.log` and `logs\error.log` next to `package.json`.

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `pm2 status` shows the app `errored` | Port 3000 already in use | `Get-NetTCPConnection -LocalPort 3000` → kill the other process, or change `PORT`/`--port` in `ecosystem.config.cjs`. |
| Pages return 500, `pm2 logs` shows `MongooseServerSelectionError` | MongoDB isn't reachable | Local: `Get-Service MongoDB` (start it if stopped). Atlas: re-check `MONGODB_URI` and IP allowlist. |
| `npm install -g pm2` fails with `EACCES` / `EPERM` | Not running as Administrator | Reopen PowerShell *as administrator* and rerun `deploy.ps1`. |
| Site loads on the remote (`localhost:3000`) but not from your local PC | Firewall blocking | Step 6 — re-run the `New-NetFirewallRule` command. |
| Verification emails not arriving | SMTP creds blank → emails go to dev stub | Check `backend\data\sent-emails.json` for the captured payload, or fill in real `SMTP_USER` / `SMTP_PASSWORD` (Gmail App Password) in `.env.local` and redeploy. |
| `pm2: command not found` after install | Global npm bin not on PATH | Open a fresh PowerShell window, or run `where pm2` to locate it; add `%APPDATA%\npm` to PATH. |

---

## 11. Security checklist (before exposing publicly)

- [ ] `AUTH_SECRET` is freshly generated, **not** the dev value committed to git history.
- [ ] `.env.local` is **not** in git (it's gitignored).
- [ ] Firewall: only port 3000 is open inbound. Block 27017 (MongoDB) from external traffic.
- [ ] If using Atlas, the IP allowlist contains only the remote's public IP (not `0.0.0.0/0`).
- [ ] `NEXT_PUBLIC_APP_URL` matches the URL users will actually visit (verification links break otherwise).
- [ ] Consider putting IIS or `nginx` in front for HTTPS via a TLS cert.
