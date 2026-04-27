@echo off
setlocal enableextensions
title Advancia Trainings - Production Deploy
cd /d "%~dp0"

echo.
echo ====================================================
echo  Advancia Trainings - Production Deploy
echo  Folder: %CD%
echo ====================================================
echo.

REM --- 1. Sanity checks ---------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js not found on PATH.
    echo         Install Node.js LTS from https://nodejs.org/ and run this file again.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERROR] npm not found on PATH. Reinstall Node.js LTS.
    pause
    exit /b 1
)

if not exist ".env.local" (
    echo [ERROR] Missing .env.local at %CD%\.env.local
    echo         Copy .env.example to .env.local and fill in production values:
    echo           - MONGODB_URI
    echo           - AUTH_SECRET ^(long random string^)
    echo           - NEXT_PUBLIC_APP_URL=http://172.16.145.12:3000
    echo           - SMTP_*  ^(optional^)
    echo.
    pause
    exit /b 1
)

if not exist "logs" mkdir logs

REM --- 2. Pull latest from git (skip if not a git checkout) ---------------
if exist ".git" (
    echo [1/5] Pulling latest from git...
    git pull --ff-only
    if errorlevel 1 (
        echo [WARN] git pull failed. Continuing with the local working copy.
    )
) else (
    echo [1/5] Not a git checkout - skipping pull.
)

REM --- 3. Install dependencies --------------------------------------------
echo.
echo [2/5] Installing dependencies (npm ci preferred, falls back to npm install)...
call npm ci 2>nul
if errorlevel 1 (
    echo npm ci failed ^(lockfile may be out of sync^). Falling back to npm install...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Dependency install failed. See errors above.
        pause
        exit /b 1
    )
)

REM --- 4. Production build ------------------------------------------------
echo.
echo [3/5] Building Next.js production bundle...
call npm run build
if errorlevel 1 (
    echo [ERROR] Production build failed. See errors above.
    pause
    exit /b 1
)

REM --- 5. PM2 install + start --------------------------------------------
echo.
echo [4/5] Configuring PM2...
where pm2 >nul 2>nul
if errorlevel 1 (
    echo PM2 not found. Installing globally ^(may take a minute^)...
    call npm install -g pm2
    if errorlevel 1 (
        echo [ERROR] Could not install PM2 globally.
        echo         Try running this file as Administrator ^(right-click -^> Run as administrator^).
        pause
        exit /b 1
    )
)

REM Idempotent: remove old instance if present, then start fresh
call pm2 delete advancia-trainings >nul 2>nul
call pm2 start ecosystem.config.cjs
if errorlevel 1 (
    echo [ERROR] PM2 failed to start the app. Check pm2 logs.
    pause
    exit /b 1
)
call pm2 save

echo.
echo [5/5] PM2 status:
call pm2 status

echo.
echo ====================================================
echo  App should be live at:
echo    http://localhost:3000          ^(on this machine^)
echo    http://172.16.145.12:3000      ^(from your network^)
echo.
echo  Logs:    pm2 logs advancia-trainings
echo  Stop:    pm2 stop advancia-trainings
echo  Reload:  pm2 reload advancia-trainings
echo  Status:  pm2 status
echo ====================================================
echo.
pause
