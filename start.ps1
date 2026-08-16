<# 
.SYNOPSIS
    Sanctum - One-click startup script for PowerShell
.DESCRIPTION
    Starts CouchDB, installs deps, builds, and runs dev server
.EXAMPLE
    .\start.ps1
#>

param()

$ErrorActionPreference = "Stop"

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "    SANCTUM - Unified Operating Platform" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check project root
if (-not (Test-Path "pnpm-workspace.yaml")) {
    Write-Error "Run this from project root (C:\Users\HP\Desktop\platform)"
    exit 1
}

Write-Host "[1/5] Checking environment..." -ForegroundColor Yellow
if (-not (Test-Path "apps\web\.env")) {
    Write-Host "Creating .env with dummy Clerk key..." -ForegroundColor Yellow
    "VITE_CLERK_PUBLISHABLE_KEY=pk_test_dummy_key_for_dev" | Out-File -Encoding utf8 apps\web\.env
    Write-Host "Created apps\web\.env with dummy key" -ForegroundColor Green
} else {
    Write-Host ".env exists" -ForegroundColor Green
}

Write-Host "`n[2/5] Starting CouchDB..." -ForegroundColor Yellow
$dockerExists = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerExists) {
    Write-Warning "Docker not installed. Skipping CouchDB (offline sync unavailable)."
    Write-Host "Install Docker Desktop from https://docker.com for offline sync" -ForegroundColor Yellow
} else {
    $couchdb = docker ps --filter "name=couchdb" --format "{{.Names}}" 2>$null
    if (-not $couchdb) {
        Write-Host "Starting CouchDB container..." -ForegroundColor Yellow
        try {
            docker run -d --name couchdb -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3 | Out-Null
            Write-Host "CouchDB started on http://localhost:5984" -ForegroundColor Green
        } catch {
            Write-Warning "CouchDB failed to start. Offline sync unavailable."
        }
    } else {
        Write-Host "CouchDB already running" -ForegroundColor Green
    }
}

Write-Host "`n[3/5] Installing dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pnpm install --frozen-lockfile
} else {
    Write-Host "Dependencies installed" -ForegroundColor Green
}

Write-Host "`n[4/5] Building web app..." -ForegroundColor Yellow
try {
    pnpm --filter=@platform/web build 2>$null
    Write-Host "Build successful" -ForegroundColor Green
} catch {
    Write-Warning "Build failed, but dev server may still work"
}

Write-Host "`n[5/5] Starting dev server..." -ForegroundColor Yellow
Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "    SANCTUM RUNNING AT: http://localhost:5173" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

# Start dev server (blocks)
pnpm --filter=@platform/web dev