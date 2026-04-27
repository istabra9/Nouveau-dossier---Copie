@echo off
title Advancia Trainings - Local Server
cd /d "%~dp0"

REM ----------------------------------------------------------------
REM  Advancia Trainings - one-click launcher
REM  Double-click this file to start the website on http://localhost:3000
REM ----------------------------------------------------------------

REM 1. Verify Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js is not installed or not on PATH.
    echo         Install it from https://nodejs.org/ ^(LTS version^) and run this file again.
    echo.
    pause
    exit /b 1
)

REM 2. Verify .env.local exists - contains MONGODB_URI, AUTH_SECRET, SMTP creds, etc.
if not exist ".env.local" (
    echo.
    echo [ERROR] Missing .env.local
    echo         Copy .env.example to .env.local and fill in your secrets,
    echo         then double-click this file again.
    echo.
    pause
    exit /b 1
)

REM 3. Install dependencies on first run (or after deps changed)
if not exist "node_modules" (
    echo.
    echo First-time setup: installing dependencies. This takes ~1-2 minutes...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. See output above.
        echo.
        pause
        exit /b 1
    )
)

REM 4. Open the browser ~8 seconds after the dev server starts spinning up
start "" /min cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:3000"

echo.
echo ================================================================
echo  Advancia Trainings is starting on http://localhost:3000
echo  Your browser will open automatically once the server is ready.
echo  Press Ctrl+C in this window to stop the server.
echo ================================================================
echo.

REM 5. Run the dev server (Turbopack - fast HMR)
call npm run dev

REM 6. Keep the window open if the server exited unexpectedly so you can read the error
echo.
echo The server has stopped. Press any key to close this window.
pause >nul
