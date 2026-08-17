# Contributing to Sanctum

Thank you for your interest in contributing to Sanctum! This document provides guidelines and instructions for contributing.

## 🎯 Ways to Contribute

- **Code** - Features, bug fixes, refactoring
- **Documentation** - README, API docs, guides
- **Testing** - Unit tests, integration tests, E2E tests
- **Design** - UI/UX improvements, accessibility
- **Translations** - i18n support
- **Bug Reports** - Detailed, reproducible issues
- **Feature Requests** - Well-scoped proposals

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Git

### Setup
```bash
git clone https://github.com/ifeanyiokomba/sanctum.git
cd sanctum
pnpm install
```

## 🔧 Development Workflow

### 1. Create Feature Branch
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Follow TypeScript strict mode
- Run typecheck: `pnpm --filter=@platform/web typecheck`
- Run linting: `pnpm lint`
- Add tests for new features

### 3. Commit Changes
```bash
git add .
git commit -m "feat(scope): description"
```

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`

### 4. Push and PR
```bash
git push origin feature/your-feature-name
# Open PR on GitHub
```

## 📝 Code Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` or proper types)
- Explicit return types for public functions
- Zod schemas for validation

### React
- Functional components with hooks
- Server components where possible
- Proper error boundaries
- Accessibility (ARIA, semantic HTML)

### Styling
- Tailwind CSS
- shadcn/ui components
- CSS variables for theming
- Responsive design (mobile-first)

### Database (RxDB)
- Schema-first with Zod
- Migrations for schema changes
- Optimistic UI updates
- Conflict resolution strategies

## 🧪 Testing

### Unit Tests
```bash
pnpm --filter=@platform/web test
```

### E2E Tests (when added)
```bash
pnpm --filter=@platform/web test:e2e
```

### Coverage
```bash
pnpm --filter=@platform/web test:coverage
```

## 📝 Pull Request Checklist

- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No console.log/debugger in production code
- [ ] Proper TypeScript types (no `any`)
- [ ] Accessibility considered
- [ ] Documentation updated if needed
- [ ] Breaking changes documented

## 🏷 Versioning

We follow [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

## 🏷 Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Test additions
- `chore/description` - Maintenance

## 🐛 Bug Reports

Use the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, browser, version)
- Screenshots/logs
- Minimal reproduction

## 💡 Feature Requests

Use the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md) with:
- Clear problem statement
- Proposed solution
- Alternatives considered
- Use cases
- Priority/impact

## 📋 Code Review

### For Authors
- Keep PRs small and focused
- Write clear descriptions
- Respond to feedback promptly
- Update docs if needed

### For Reviewers
- Be constructive and specific
- Check for security issues
- Verify tests exist
- Check TypeScript/types
- Approve when ready

## 🔒 Security

- Report vulnerabilities privately to security@sanctum.app
- Don't commit secrets
- Dependencies scanned via Dependabot
- SAST in CI pipeline

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 📞 Questions?

- Discussions: [GitHub Discussions](https://github.com/ifeanyiokomba/sanctum/discussions)
- Issues: [GitHub Issues](https://github.com/ifeanyiokomba/sanctum/issues)
- Email: contribute@sanctum.app