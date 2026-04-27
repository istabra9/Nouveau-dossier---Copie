# Advancia Trainings - production deploy (PowerShell version).
# Run from the project root:
#   powershell -ExecutionPolicy Bypass -File deploy.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host ""
Write-Host "===================================================="
Write-Host " Advancia Trainings - Production Deploy"
Write-Host " Folder: $PSScriptRoot"
Write-Host "===================================================="
Write-Host ""

function Need-Cmd($name, $hint) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        Write-Host "[ERROR] '$name' not found. $hint" -ForegroundColor Red
        exit 1
    }
}

Need-Cmd node "Install Node.js LTS from https://nodejs.org/"
Need-Cmd npm  "Reinstall Node.js LTS to get npm on PATH."

if (-not (Test-Path ".env.local")) {
    Write-Host "[ERROR] .env.local missing at $PSScriptRoot\.env.local" -ForegroundColor Red
    Write-Host "        Copy .env.example to .env.local and fill in production values:"
    Write-Host "          - MONGODB_URI"
    Write-Host "          - AUTH_SECRET  (long random string)"
    Write-Host "          - NEXT_PUBLIC_APP_URL=http://172.16.145.12:3000"
    Write-Host "          - SMTP_*  (optional)"
    exit 1
}

New-Item -ItemType Directory -Force -Path logs | Out-Null

if (Test-Path ".git") {
    Write-Host "[1/5] Pulling latest from git..."
    try { git pull --ff-only } catch { Write-Host "[WARN] git pull failed; continuing." -ForegroundColor Yellow }
} else {
    Write-Host "[1/5] Not a git checkout - skipping pull."
}

Write-Host ""
Write-Host "[2/5] Installing dependencies..."
$ciOk = $false
try { npm ci; $ciOk = ($LASTEXITCODE -eq 0) } catch { $ciOk = $false }
if (-not $ciOk) {
    Write-Host "npm ci failed - falling back to npm install."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] dependency install failed." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "[3/5] Building Next.js production bundle..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] build failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[4/5] Configuring PM2..."
if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    Write-Host "PM2 not found - installing globally..."
    npm install -g pm2
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] PM2 install failed (try running PowerShell as Administrator)." -ForegroundColor Red
        exit 1
    }
}

pm2 delete advancia-trainings 2>$null | Out-Null
pm2 start ecosystem.config.cjs
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] PM2 start failed." -ForegroundColor Red
    exit 1
}
pm2 save

Write-Host ""
Write-Host "[5/5] PM2 status:"
pm2 status

Write-Host ""
Write-Host "===================================================="
Write-Host " App should be live at:"
Write-Host "   http://localhost:3000          (on this machine)"
Write-Host "   http://172.16.145.12:3000      (from your network)"
Write-Host ""
Write-Host " Logs:    pm2 logs advancia-trainings"
Write-Host " Stop:    pm2 stop advancia-trainings"
Write-Host " Reload:  pm2 reload advancia-trainings"
Write-Host " Status:  pm2 status"
Write-Host "===================================================="
