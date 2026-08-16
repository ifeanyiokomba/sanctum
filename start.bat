@echo off
REM Sanctum - One-click startup script
REM Run this from the project root: C:\Users\HP\Desktop\platform\start.bat

title Sanctum Startup
color 0A

echo ============================================
echo    SANCTUM - Unified Operating Platform
echo ============================================
echo.

REM Check if we're in the right directory
if not exist "pnpm-workspace.yaml" (
    echo ERROR: Run this from the project root (C:\Users\HP\Desktop\platform)
    pause
    exit /b 1
)

echo [1/5] Checking environment...
if not exist "apps\web\.env" (
    echo Creating .env with dummy Clerk key...
    echo VITE_CLERK_PUBLISHABLE_KEY=pk_test_dummy_key_for_dev > apps\web\.env
    echo Created apps\web\.env with dummy key
) else (
    echo .env exists
)

echo.
echo [2/5] Starting CouchDB (for offline sync)...
docker ps --filter "name=couchdb" --format "{{.Names}}" | findstr /r "couchdb" >nul
if errorlevel 1 (
    echo Starting CouchDB container...
    docker run -d --name couchdb -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3 >nul 2>&1
    if errorlevel 1 (
        echo WARNING: Docker not running or CouchDB failed to start
        echo Offline sync will not work without CouchDB
    ) else (
        echo CouchDB started on http://localhost:5984
    )
) else (
    echo CouchDB already running
)

echo.
echo [3/5] Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing dependencies...
    pnpm install --frozen-lockfile
) else (
    echo Dependencies installed
)

echo.
echo [4/5] Building web app (production check)...
pnpm --filter=@platform/web build >nul 2>&1
if errorlevel 1 (
    echo WARNING: Build failed, but dev server may still work
) else (
    echo Build successful
)

echo.
echo [5/5] Starting dev server...
echo.
echo ============================================
echo    SANCTUM RUNNING AT: http://localhost:5173
echo ============================================
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start dev server (this blocks - keep window open)
pnpm --filter=@platform/web dev

pause