# Sanctum - Unified Operating Platform for Mission-Driven Organizations

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)]()
[![React](https://img.shields.io/badge/React-18.3-61dafb)]()

**Sanctum** is a unified operating platform designed for churches, schools, nonprofits, and SMEs. It replaces 5+ disconnected tools with a single, offline-first platform that speaks each organization's language.

## 🎯 Vision

Replace fragmented tools (Planning Center, PowerSchool, Bloomerang, QuickBooks, etc.) with one platform that adapts its vocabulary, workflows, and compliance to each organization type:

| Organization Type | Vocabulary | Core Modules |
|-------------------|------------|--------------|
| **Church** | Members, Households, Ministries, Giving | Check-in, Volunteers, Groups, Events |
| **School** | Students, Guardians, Classes, Fees | SIS, Gradebook, Attendance, Parent Portal |
| **Nonprofit** | Donors, Constituents, Grants, Programs | CRM, Fundraising, Grants, Outcomes |
| **SME** | Customers, Vendors, Products, Projects | Finance, Inventory, Sales, Projects |

## ✨ Key Features

- **Persona-Adaptive UI** - Vocabulary, workflows, and compliance adapt per organization type
- **Offline-First** - RxDB + CouchDB sync works offline, syncs when online
- **Paystack Integration** - Online giving with cards, bank, USSD, mobile money
- **Clerk Authentication** - SSO, MFA, org switching, role-based access
- **PWA + Desktop + Mobile** - One codebase: web, Tauri desktop, Capacitor mobile
- **Multi-Tenant** - Row-level security, org isolation, multi-org support

## 🏗 Architecture

```
sanctum/
├── apps/
│   ├── web/          # React + Vite + PWA (main app)
│   ├── desktop/      # Tauri v2 (Windows/macOS/Linux)
│   └── mobile/       # Capacitor (iOS/Android)
├── packages/
│   ├── core/
│   │   ├── auth/       # Clerk + RBAC
│   │   ├── db/         # RxDB schema + replication
│   │   ├── ui/         # shadcn/ui + Tailwind
│   │   └── hooks/      # React hooks
│   └── verticals/
│       ├── church/     # Giving, Check-in, Volunteers
│       ├── school/     # SIS, Gradebook, Parent Portal
│       ├── ngo/        # CRM, Grants, Outcomes
│       └── sme/        # Finance, Inventory, Sales
└── infrastructure/
    ├── docker-compose.prod.yml
    ├── deploy.sh
    └── start.ps1
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (for CouchDB)

### Local Development

```bash
# Clone
git clone https://github.com/ifeanyiokomba/sanctum.git
cd sanctum

# Install dependencies
pnpm install

# Configure environment (interactive)
powershell -ExecutionPolicy Bypass -File .\setup-keys.ps1

# Start CouchDB (optional, for sync)
docker run -d -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password couchdb:3

# Start dev server
pnpm --filter=@platform/web dev
# Opens http://localhost:5173
```

### One-Click Start (Windows)
```powershell
# Double-click or run:
.\start.ps1
```

### Production Build
```bash
pnpm --filter=@platform/web build
# Output in apps/web/dist/
```

## ⚙️ Configuration

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | ✅ |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack public key | ✅ |
| `PAYSTACK_SECRET_KEY` | Paystack secret key | ✅ |
| `PAYSTACK_WEBHOOK_SECRET` | Paystack webhook secret | ✅ |
| `COUCHDB_URL` | CouchDB connection URL | ✅ |
| `COUCHDB_ADMIN_PASSWORD` | CouchDB admin password | ✅ |
| `RESEND_API_KEY` | Resend API key (email) | ✅ |
| `VITE_APP_URL` | Production app URL | ✅ |
| `VITE_API_URL` | Production API URL | ✅ |

### Optional
- `SENDGRID_API_KEY` - Alternative email provider
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` - SMS
- `FIREBASE_SERVER_KEY` - Push notifications
- `SENTRY_DSN` - Error tracking
- `OPENAI_API_KEY` - AI features

## 🚢 Deployment

### Option 1: Vercel (Recommended for Web)
```bash
cd apps/web
vercel --prod
```
Add environment variables in Vercel Dashboard → Settings → Environment Variables.

### Option 2: Docker (Full Stack)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: Railway / Render
Connect GitHub repo, add environment variables, deploy.

## 📱 Mobile & Desktop

### Desktop (Tauri)
```bash
cd apps/desktop
pnpm tauri dev      # Development
pnpm tauri build    # Production (MSI/DMG/AppImage)
```

### Mobile (Capacitor)
```bash
cd apps/mobile
pnpm cap sync
pnpm cap open ios     # Xcode
pnpm cap open android # Android Studio
```

## 🧪 Testing

```bash
# Type checking
pnpm --filter=@platform/web typecheck

# Linting
pnpm lint

# Tests (when added)
pnpm --filter=@platform/web test
```

## 📁 Project Structure Details

### Core Packages
- `@platform/core-auth` - Clerk integration, RBAC, permissions
- `@platform/core-db` - RxDB schema, migrations, CouchDB replication
- `@platform/core-ui` - shadcn/ui components, Tailwind, utilities
- `@platform/core-hooks` - React hooks for auth, permissions, data

### Vertical Packages
- `@platform/verticals/church` - Giving, Check-in, Volunteers, Groups
- `@platform/verticals/school` - SIS, Gradebook, Attendance, Fees
- `@platform/verticals/ngo` - CRM, Fundraising, Grants, Outcomes
- `@platform/verticals/sme` - Finance, Inventory, Sales, Projects

### Vertical Structure
```
verticals/church/
├── vocabulary.ts      # Member, Household, Ministry, Giving
├── modules/
│   ├── giving/       # Paystack integration
│   ├── checkin/      # Child check-in, labels
│   ├── groups/       # Small groups, attendance
│   ├── volunteers/   # Scheduling, check-in
│   └── events/       # Calendar, registrations
├── compliance.ts     # Child safety, PCI-DSS
├── workflows.ts      # Visitor follow-up, receipts
└── onboarding.ts     # Church-specific setup
```

## 🔐 Security

- Row-level security (PostgreSQL/CouchDB)
- Clerk authentication (SSO, MFA, org switching)
- Paystack PCI-DSS compliant payments
- Paystack webhook signature verification
- CSP headers, secure cookies
- Row-level security policies

## 📊 Monitoring

- Sentry for error tracking
- Vercel Analytics for performance
- UptimeRobot for uptime
- Health check endpoint: `/api/health`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
3. Open Pull Request

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Component-driven development

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) - Authentication
- [Paystack](https://paystack.com) - Payments
- [RxDB](https://rxdb.info) - Offline-first database
- [CouchDB](https://couchdb.apache.org) - Sync backend
- [shadcn/ui](https://ui.shadcn.com) - Components
- [Tauri](https://tauri.app) - Desktop
- [Capacitor](https://capacitorjs.com) - Mobile

## 📞 Support

- Issues: [GitHub Issues](https://github.com/ifeanyiokomba/sanctum/issues)
- Discussions: [GitHub Discussions](https://github.com/ifeanyiokomba/sanctum/discussions)
- Email: support@sanctum.app

---

**Built with ❤️ for mission-driven organizations worldwide**