# Sanctum Production Deployment Guide

## Prerequisites

1. **Clerk Account** - https://dashboard.clerk.com
2. **Docker Hub / Container Registry** - For CouchDB
3. **Cloud Provider** - Vercel, Netlify, AWS, Railway, Render, etc.
4. **Domain Name** (optional but recommended)

---

## 1. Clerk Production Setup

### Create Production App
1. Go to https://dashboard.clerk.com
2. Create new application → "Production"
3. Configure:
   - **Sign-in methods**: Email, Google, Microsoft, Apple
   - **User profile**: First name, Last name, Phone
   - **Organizations**: Enable (for multi-org support)
   - **Custom domain**: `auth.yourdomain.com` (optional)

### Get Production Keys
- **Publishable Key**: `pk_live_...`
- **Secret Key**: `sk_live_...`
- **Webhook Secret**: `whsec_...`

### Configure Webhooks
Add endpoint: `https://yourdomain.com/api/clerk-webhook`
Events: `user.created`, `user.updated`, `organization.created`, `organizationMembership.created`

---

## 2. Environment Variables (Production)

### Web App (`apps/web/.env.production`)
```bash
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
CLERK_WEBHOOK_SECRET=whsec_xxx

# Database (CouchDB)
COUCHDB_URL=https://admin:password@couchdb.yourdomain.com
COUCHDB_ADMIN_USER=admin
COUCHDB_ADMIN_PASSWORD=secure_password

# CouchDB Sync Gateway
SYNC_GATEWAY_URL=https://sync.yourdomain.com
SYNC_GATEWAY_ADMIN_URL=https://sync-admin.yourdomain.com

# Email (SendGrid/Resend)
RESEND_API_KEY=re_xxx
# OR
SENDGRID_API_KEY=SG.xxx

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx

# Push (Firebase)
FIREBASE_SERVER_KEY=xxx

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# File Storage (S3/MinIO)
S3_ENDPOINT=https://s3.yourdomain.com
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_BUCKET=sanctum-prod
S3_REGION=us-east-1

# AI
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Desktop/Mobile (same keys, different prefix)
- Desktop: `apps/desktop/.env.production`
- Mobile: `apps/mobile/.env.production`

---

## 3. CouchDB Production Setup

### Option A: Managed (Recommended)
- **Cloudant** (IBM) - https://cloudant.com
- **CouchDB Cloud** - https://couchdb.cloud
- **IBM Cloud Databases** - CouchDB

### Option B: Self-Hosted (Docker)
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  couchdb:
    image: couchdb:3
    container_name: sanctum-couchdb
    environment:
      COUCHDB_USER: admin
      COUCHDB_PASSWORD: ${COUCHDB_PASSWORD}
    volumes:
      - couchdb_data:/opt/couchdb/data
    ports:
      - "5984:5984"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5984/_up"]
      interval: 30s
      timeout: 10s
      retries: 3

  sync-gateway:
    image: couchbase/sync-gateway:3
    container_name: sanctum-sync-gateway
    ports:
      - "4984:4984"
      - "4985:4985"
    volumes:
      - ./sync-gateway-config.json:/etc/sync-gateway/config.json
    depends_on:
      - couchdb
    restart: unless-stopped

volumes:
  couchdb_data:
```

### Sync Gateway Config (`sync-gateway-config.json`)
```json
{
  "logging": { "log_level": "info" },
  "databases": {
    "sanctum": {
      "server": "http://couchdb:5984",
      "bucket": "sanctum",
      "username": "admin",
      "password": "secure_password",
      "enable_shared_bucket_access": true,
      "import_docs": "continuous",
      "enable_all_conflicts": true,
      "revs_limit": 20,
      "allow_conflicts": true,
      "unsupported": {
        "replication_2": true
      }
    }
  }
}
```

---

## 4. Deployment Options

### Option A: Vercel (Easiest for Web)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod
```

**Configure in Vercel Dashboard:**
- Environment Variables → Add all from `.env.production`
- Build Command: `pnpm --filter=@platform/web build`
- Output Directory: `dist`
- Framework Preset: Vite

### Option B: Netlify
```bash
# netlify.toml in apps/web/
[build]
  command = "pnpm --filter=@platform/web build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option C: Docker + Kubernetes (Full Stack)
```dockerfile
# Dockerfile.web
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter=@platform/web build

FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://api:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option D: Railway / Render / Fly.io (Full Stack)
```yaml
# railway.toml
[build]
builder = "nixpacks"
buildCommand = "pnpm --filter=@platform/web build"

[deploy]
startCommand = "cd apps/web && npx serve -s dist -l 3000"
healthcheckPath = "/"
healthcheckTimeout = 30

[environments.production]
variables = { ... }
```

---

## 5. Desktop App Distribution

### Windows (MSI/EXE)
```bash
cd apps/desktop
pnpm tauri build --target x86_64-pc-windows-msvc
# Output: src-tauri/target/release/bundle/msi/
```

### macOS (DMG)
```bash
cd apps/desktop
pnpm tauri build --target universal-apple-darwin
# Output: src-tauri/target/release/bundle/dmg/
```

### Linux (AppImage)
```bash
cd apps/desktop
pnpm tauri build --target x86_64-unknown-linux-gnu
# Output: src-tauri/target/release/bundle/appimage/
```

### Auto-Updates
```json
// tauri.conf.json
"plugins": {
  "updater": {
    "active": true,
    "endpoints": ["https://updates.yourdomain.com/latest.json"],
    "dialog": true,
    "pubkey": "your_pubkey_here"
  }
}
```

---

## 6. Mobile App Store Deployment

### iOS (App Store)
```bash
cd apps/mobile
pnpm cap sync ios
pnpm cap open ios
# In Xcode: Product → Archive → Distribute App
```

**App Store Connect:**
- Bundle ID: `com.sanctum.app`
- Team: Your Apple Developer Team
- Provisioning Profile: Distribution
- TestFlight → App Store Review

### Android (Play Store)
```bash
cd apps/mobile
pnpm cap sync android
pnpm cap open android
# In Android Studio: Build → Generate Signed Bundle/APK
```

**Play Console:**
- Package name: `com.sanctum.app`
- Signing key: Upload or let Google manage
- Track: Internal → Closed → Open → Production

---

## 6. CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '9'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter=@platform/web typecheck
      - run: pnpm --filter=@platform/web test

  build-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter=@platform/web build
      - uses: actions/upload-artifact@v4
        with: { name: web-dist, path: apps/web/dist }

  deploy-web:
    needs: build-web
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with: { name: web-dist, path: ./dist }
      - uses: amondnet/vercel-action@v25
        if: github.ref == 'refs/heads/main'
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  build-desktop:
    needs: test
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with: { toolchain: stable, target: x86_64-pc-windows-msvc }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter=@platform/desktop tauri build
      - uses: actions/upload-artifact@v4
        with: { name: desktop-installer, path: apps/desktop/src-tauri/target/release/bundle/msi/ }

  build-mobile:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - uses: actions/setup-android@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter=@platform/mobile cap sync
      - run: pnpm --filter=@platform/mobile cap build android
      - uses: actions/upload-artifact@v4
        with: { name: android-bundle, path: apps/mobile/android/app/build/outputs/bundle/release/ }
```

---

## 7. Monitoring & Observability

### Sentry (Error Tracking)
```bash
# apps/web/src/main.tsx
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

### Health Checks
```typescript
// apps/web/src/app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkCouchDB(),
    clerk: await checkClerk(),
    stripe: await checkStripe(),
  };
  const healthy = Object.values(checks).every(c => c.healthy);
  return Response.json({ status: healthy ? 'healthy' : 'degraded', checks }, {
    status: healthy ? 200 : 503
  });
}
```

### Uptime Monitoring
- **UptimeRobot** - Free 50 monitors
- **Better Uptime** - Modern UI
- **Pingdom** - Enterprise

---

## 8. Security Checklist

- [ ] HTTPS everywhere (automatic with Vercel/Netlify)
- [ ] CSP headers configured
- [ ] CORS origins restricted
- [ ] Rate limiting on API endpoints
- [ ] Clerk webhook signature verification
- [ ] Stripe webhook signature verification
- [ ] CouchDB admin password rotated
- [ ] S3 bucket policies restricted
- [ ] Clerk session settings (short expiry, MFA)
- [ ] Content Security Policy headers
- [ ] Subresource Integrity for CDN assets
- [ ] Dependabot alerts enabled
- [ ] Secret scanning enabled (GitHub)

---

## 8. Launch Checklist

### Pre-Launch
- [ ] All environment variables set in production
- [ ] Clerk production app configured
- [ ] CouchDB production cluster running
- [ ] Stripe webhook endpoints configured
- [ ] Email/SMS providers verified
- [ ] Custom domain configured (DNS)
- [ ] SSL certificates valid
- [ ] Health checks passing
- [ ] Error tracking (Sentry) receiving events
- [ ] Analytics (Plausible/GA) installed
- [ ] Legal pages (Privacy, Terms) published
- [ ] Support email configured

### Launch Day
- [ ] Deploy web to production
- [ ] Submit mobile apps to stores
- [ ] Distribute desktop installers
- [ ] Monitor error rates (Sentry)
- [ ] Monitor uptime (UptimeRobot)
- [ ] Monitor performance (Vercel Analytics)
- [ ] Support channels staffed

### Post-Launch (Week 1)
- [ ] Daily error review
- [ ] Performance metrics review
- [ ] User feedback collection
- [ ] Hotfix deployment process tested
- [ ] Backup/restore tested

---

## 9. Rollback Plan

```bash
# Vercel instant rollback
vercel rollback <deployment-url>

# Docker rollback
docker tag sanctum-web:previous sanctum-web:latest
docker compose up -d --force-recreate

# Database rollback (CouchDB)
# Restore from continuous backup
```

---

## 10. Cost Estimation (Monthly)

| Service | Est. Cost |
|---------|-----------|
| Vercel Pro | $20 |
| Clerk Pro | $25 |
| CouchDB (Cloudant) | $50-200 |
| SendGrid/Resend | $15-50 |
| Twilio SMS | $10-100 |
| Sentry Team | $26 |
| S3/Cloudflare R2 | $5-20 |
| **Total** | **~$150-500/mo** |

---

## Quick Start Commands

```bash
# 1. Set all production env vars
cp apps/web/.env.production apps/web/.env

# 2. Build all
pnpm build

# 2. Deploy web
cd apps/web && vercel --prod

# 3. Build desktop
cd apps/desktop && pnpm tauri build

# 4. Build mobile
cd apps/mobile && pnpm cap sync && pnpm cap build ios && pnpm cap build android

# 4. Deploy CouchDB (Docker)
docker compose -f docker-compose.prod.yml up -d

# 5. Verify health
curl https://yourdomain.com/api/health
```