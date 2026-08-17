---
name: Pull Request Template
about: Template for pull requests
title: '[PR] '
labels: ''
assignees: ''
---

## Description
A clear and concise description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test addition/update
- [ ] Chore (maintenance, dependencies, etc.)

## Related Issues
Closes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Manual testing completed

## Screenshots (if applicable)
| Before | After |
|--------|-------|
| ![before](url) | ![after](url) |

## Checklist
- [ ] Code follows TypeScript strict mode
- [ ] No `any` types (use `unknown` or proper types)
- [ ] No console.log/debugger in production code
- [ ] Proper error handling
- [ ] Accessibility considered (ARIA, semantic HTML)
- [ ] Documentation updated (README, docs, comments)
- [ ] Breaking changes documented
- [ ] Tests added/updated
- [ ] No console.log/debugger in production code

## Breaking Changes
If this is a breaking change, describe the impact and migration path:

## Additional Notes
Any additional information, configuration, or data that might be necessary to review this PR.

## Deployment Notes
Any special deployment considerations:
- [ ] Database migration needed
- [ ] Environment variables added/changed
- [ ] Feature flags
- [ ] Database migration script provided