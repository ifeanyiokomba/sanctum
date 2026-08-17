<# 
.SYNOPSIS
    Sanctum - Interactive API Key Setup
.DESCRIPTION
    Helps you configure all required API keys for production
#>

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "    SANCTUM - API Key Configuration" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$envFile = "apps\web\.env"
$envProdFile = "apps\web\.env.production"

# Backup existing
if (Test-Path $envFile) {
    Copy-Item $envFile "$envFile.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Host "Backed up existing .env" -ForegroundColor Yellow
}

Write-Host "`nEnter your production API keys (press Enter to skip):`n" -ForegroundColor Yellow

# Clerk
Write-Host "`n--- CLERK (Required) ---" -ForegroundColor Green
Write-Host "Get from: https://dashboard.clerk.com → Your App → API Keys" -ForegroundColor Gray
$clerkPub = Read-Host "VITE_CLERK_PUBLISHABLE_KEY (pk_live_...)"
$clerkSecret = Read-Host "CLERK_SECRET_KEY (sk_live_...)"
$clerkWebhook = Read-Host "CLERK_WEBHOOK_SECRET (whsec_...)"

# Paystack
Write-Host "`n--- PAYSTACK (Required for Giving) ---" -ForegroundColor Green
Write-Host "Get from: https://dashboard.paystack.com → Settings → API Keys & Webhooks" -ForegroundColor Gray
$paystackPub = Read-Host "VITE_PAYSTACK_PUBLIC_KEY (pk_live_...)"
$paystackSecret = Read-Host "PAYSTACK_SECRET_KEY (sk_live_...)"
$paystackWebhook = Read-Host "PAYSTACK_WEBHOOK_SECRET (whsec_...)"

# CouchDB
Write-Host "`n--- COUCHDB (Required for Sync) ---" -ForegroundColor Green
Write-Host "Use Cloudant (cloudant.com) or self-hosted CouchDB" -ForegroundColor Gray
$couchUrl = Read-Host "COUCHDB_URL (https://admin:pass@host:5984)"
$couchPass = Read-Host "COUCHDB_ADMIN_PASSWORD"

# Email
Write-Host "`n--- EMAIL (Required for Notifications) ---" -ForegroundColor Green
Write-Host "Recommended: Resend (resend.com) or SendGrid" -ForegroundColor Gray
$resendKey = Read-Host "RESEND_API_KEY (re_...)"
$sendgridKey = Read-Host "SENDGRID_API_KEY (SG_...) [optional]"

# SMS
Write-Host "`n--- TWILIO SMS (Required for Check-in Alerts) ---" -ForegroundColor Green
Write-Host "Get from: https://console.twilio.com" -ForegroundColor Gray
$twilioSid = Read-Host "TWILIO_ACCOUNT_SID (AC...)"
$twilioToken = Read-Host "TWILIO_AUTH_TOKEN"
$twilioPhone = Read-Host "TWILIO_PHONE_NUMBER (+1...)"

# Push
Write-Host "`n--- FIREBASE PUSH (Optional) ---" -ForegroundColor Green
$firebaseKey = Read-Host "FIREBASE_SERVER_KEY [optional]"
$firebaseWebKey = Read-Host "VITE_FIREBASE_API_KEY [optional]"

# Payments (Paystack already done)
Write-Host "`n--- PAYSTACK (Already configured above) ---" -ForegroundColor Green

# Storage
Write-Host "`n--- FILE STORAGE (Optional) ---" -ForegroundColor Green
$s3Endpoint = Read-Host "S3_ENDPOINT (e.g., https://s3.amazonaws.com) [optional]"
$s3Access = Read-Host "S3_ACCESS_KEY [optional]"
$s3Secret = Read-Host "S3_SECRET_KEY [optional]"
$s3Bucket = Read-Host "S3_BUCKET [optional]"

# AI
Write-Host "`n--- AI SERVICES (Optional) ---" -ForegroundColor Green
$openaiKey = Read-Host "OPENAI_API_KEY (sk-...) [optional]"
$anthropicKey = Read-Host "ANTHROPIC_API_KEY (sk-ant-...) [optional]"

# Monitoring
Write-Host "`n--- MONITORING (Optional) ---" -ForegroundColor Green
$sentryDsn = Read-Host "SENTRY_DSN (https://...@sentry.io/...) [optional]"

# App Config
Write-Host "`n--- APP CONFIG ---" -ForegroundColor Green
$appUrl = Read-Host "VITE_APP_URL (https://yourdomain.com)"
$apiUrl = Read-Host "VITE_API_URL (https://api.yourdomain.com)"

# Build .env content
$envContent = @"
# Sanctum Production Environment
# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

# ============================================
# CLERK AUTHENTICATION (Required)
# ============================================
VITE_CLERK_PUBLISHABLE_KEY=$clerkPub
CLERK_SECRET_KEY=$clerkSecret
CLERK_WEBHOOK_SECRET=$clerkWebhook

# ============================================
# COUCHDB DATABASE (Required for Sync)
# ============================================
COUCHDB_URL=$couchUrl
COUCHDB_ADMIN_USER=admin
COUCHDB_ADMIN_PASSWORD=$couchPass

# Sync Gateway (for mobile/offline sync)
SYNC_GATEWAY_URL=https://sync.yourdomain.com:4984
SYNC_GATEWAY_ADMIN_URL=https://sync.yourdomain.com:4985

# ============================================
# EMAIL SERVICE (Required for notifications)
# ============================================
# Option A: Resend (recommended)
RESEND_API_KEY=$resendKey
# Option B: SendGrid
# SENDGRID_API_KEY=$sendgridKey

# ============================================
# SMS SERVICE (Required for check-in alerts)
# ============================================
TWILIO_ACCOUNT_SID=$twilioSid
TWILIO_AUTH_TOKEN=$twilioToken
TWILIO_PHONE_NUMBER=$twilioPhone

# ============================================
# PUSH NOTIFICATIONS
# ============================================
FIREBASE_SERVER_KEY=$firebaseKey
VITE_FIREBASE_API_KEY=$firebaseWebKey

# ============================================
# PAYMENTS (Paystack)
# ============================================
PAYSTACK_SECRET_KEY=$paystackSecret
PAYSTACK_PUBLIC_KEY=$paystackPub
PAYSTACK_WEBHOOK_SECRET=$paystackWebhook
VITE_PAYSTACK_PUBLIC_KEY=$paystackPub

# ============================================
# FILE STORAGE (S3/MinIO)
# ============================================
S3_ENDPOINT=https://s3.yourdomain.com
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_BUCKET=sanctum-prod
S3_REGION=us-east-1

# ============================================
# AI SERVICES (Optional)
# ============================================
OPENAI_API_KEY=$openaiKey
ANTHROPIC_API_KEY=$anthropicKey

# ============================================
# MONITORING
# ============================================
SENTRY_DSN=

# ============================================
# APP CONFIG
# ============================================
NODE_ENV=production
VITE_APP_URL=$appUrl
VITE_API_URL=$apiUrl
VITE_PAYSTACK_PUBLIC_KEY=$paystackPub
"@

# Write .env
$envContent | Out-File -Encoding utf8 $envFile
Write-Host "`n✓ Created $envFile" -ForegroundColor Green

# Also update .env.production
$envContent | Out-File -Encoding utf8 $envProdFile
Write-Host "✓ Updated $envProdFile" -ForegroundColor Green

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "    CONFIGURATION COMPLETE!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "Files created:"
Write-Host "  • $envFile"
Write-Host "  • $envProdFile" -ForegroundColor Green

Write-Host "`nNext steps:"
Write-Host "1. Verify the .env file: notepad apps\web\.env"
Write-Host "2. Restart dev server: pnpm --filter=@platform/web dev"
Write-Host "3. Deploy: cd apps/web && vercel --prod" -ForegroundColor Green

pause