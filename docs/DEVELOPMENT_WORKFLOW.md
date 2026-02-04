# DesignForge Development Workflow

## Overview

This document outlines the development workflow for DesignForge, including coding standards, branch management, code review processes, and deployment procedures.

---

## Table of Contents

1. [Development Environment](#development-environment)
2. [Branch Strategy](#branch-strategy)
3. [Coding Standards](#coding-standards)
4. [Code Review Process](#code-review-process)
5. [Testing Strategy](#testing-strategy)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Deployment Process](#deployment-process)
8. [Release Management](#release-management)

---

## Development Environment

### Required Tools

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 18.0+ | [nodejs.org](https://nodejs.org) |
| Git | 2.40+ | [git-scm.com](https://git-scm.com) |
| VS Code | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

### Recommended Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "streetsidesoftware.code-spell-checker",
    "formulahendry.auto-rename-tag",
    "nrwl.angular-console",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Environment Setup

```bash
# Clone repository
git clone https://github.com/designforge/designsys.git
cd designsys

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### IDE Configuration

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Branch Strategy

### Git Flow Overview

```
main (production)
├── develop (integration)
│   ├── feature/* (new features)
│   ├── bugfix/* (bug fixes)
│   └── chore/* (maintenance)
└── release/* (release preparation)
    └── hotfix/* (urgent production fixes)
```

### Branch Naming Conventions

| Branch Type | Pattern | Example |
|-------------|---------|---------|
| Feature | `feature/` + description | `feature/add-dark-mode` |
| Bugfix | `bugfix/` + issue-id | `bugfix/fix-button-hover` |
| Hotfix | `hotfix/` + description | `hotfix/security-patch` |
| Release | `release/` + version | `release/v1.2.0` |
| Chore | `chore/` + description | `chore/update-dependencies` |

### Branch Lifecycle

```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# After review and merge
git checkout develop
git pull origin develop
git branch -d feature/new-feature
```

---

## Coding Standards

### TypeScript Guidelines

#### Types Over Interfaces

```typescript
// ✅ Preferred: Type aliases for unions and intersections
type Status = 'idle' | 'loading' | 'success' | 'error';
type UserWithRole = User & { role: string };

// ✅ Interfaces for object shapes (extensible)
interface User {
  id: string;
  name: string;
}

// ❌ Avoid: Complex type unions with interfaces
```

#### Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### React Best Practices

#### Component Patterns

```tsx
// ✅ Functional components with hooks
export function Button({ children, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

// ✅ Memoize expensive components
export const MemoizedComponent = memo(function MemoizedComponent({
  data
}: Props) {
  return <div>{/* render */}</div>;
});

// ✅ Custom hooks for logic extraction
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // ...
  return debouncedValue;
}
```

### CSS/Styling Standards

#### Tailwind CSS

```tsx
// ✅ Use utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <span className="text-neutral-900 font-medium">Title</span>
</div>

// ✅ Use CSS variables for design tokens
<div className="bg-primary-500 text-primary-foreground">
  Content
</div>

// ❌ Avoid arbitrary values (except rare cases)
<div className="p-[16px]"> {/* Use p-4 instead */} </div>
```

### File Organization

```
src/
├── components/
│   ├── ui/                  # Base components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── features/            # Feature-specific components
│   └── layouts/            # Layout components
├── hooks/                   # Custom hooks
├── utils/                   # Utility functions
├── lib/                     # Library configurations
├── types/                   # TypeScript types
└── styles/                  # Global styles
```

---

## Code Review Process

### Pull Request Requirements

1. **Title**: Clear, descriptive title
2. **Description**: Detailed explanation of changes
3. **Checklist**: All items completed
4. **Tests**: Passing test suite
5. **Linting**: No linting errors
6. **Reviews**: At least 1 approval

### Review Checklist

```markdown
## Code Review Checklist

### Functionality
- [ ] Does this change do what it's supposed to do?
- [ ] Are there any edge cases not handled?
- [ ] Does it break any existing functionality?

### Code Quality
- [ ] Is the code clean and readable?
- [ ] Are there any code smells?
- [ ] Is there any redundant code?

### TypeScript
- [ ] Are all types properly defined?
- [ ] Are there any `any` types that should be explicit?
- [ ] Are null/undefined cases handled?

### Testing
- [ ] Are there tests for new functionality?
- [ ] Do tests cover edge cases?
- [ ] Are tests maintainable?

### Performance
- [ ] Will this cause performance issues?
- [ ] Are there any unnecessary re-renders?
- [ ] Is memory usage reasonable?

### Security
- [ ] Any potential XSS vulnerabilities?
- [ ] Any exposed sensitive data?
- [ ] Proper input validation?

### Documentation
- [ ] Is complex logic commented?
- [ ] Is the API documented?
- [ ] Are README updates included?
```

### Review Labels

| Label | Description |
|-------|-------------|
| `needs-review` | Awaiting review |
| `changes-requested` | Changes requested |
| `approved` | Approved for merge |
| `merge-conflict` | Has merge conflicts |
| `blocked` | Blocked by another PR |

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /  \     E2E Tests (Cypress)
      /    \
     /      \  Integration Tests (React Testing Library)
    /________\
   /          \ Unit Tests (Vitest)
  /____________\
```

### Unit Testing

```tsx
// src/utils/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-02-03');
    expect(formatDate(date)).toBe('Feb 3, 2024');
  });
});
```

### Component Testing

```tsx
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

```tsx
// src/pages/Auth/AuthPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AuthPage } from './AuthPage';

describe('AuthPage', () => {
  it('logs in successfully', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
  });
});
```

### E2E Testing

```tsx
// cypress/e2e/auth.cy.ts
describe('Authentication', () => {
  it('allows users to log in', () => {
    cy.visit('/login');
    
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });
});
```

### Test Coverage Requirements

```json
{
  "coverage": {
    "statements": "80",
    "branches": "80",
    "functions": "80",
    "lines": "80"
  }
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run Prettier
        run: npm run format:check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-pages-artifact@v3

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
    steps:
      - name: Deploy to Vercel
        run: npm run deploy
```

### Pipeline Stages

| Stage | Tools | Purpose |
|-------|-------|---------|
| Lint | ESLint, Prettier | Code quality |
| Test | Vitest, Cypress | Test coverage |
| Build | Vite | Production build |
| Security | Snyk, CodeQL | Vulnerability scan |
| Deploy | Vercel | Production deployment |

---

## Deployment Process

### Environments

| Environment | URL | Trigger |
|-------------|-----|---------|
| Development | dev.designforge.io | Push to `develop` |
| Staging | staging.designforge.io | Push to `release/*` |
| Production | designforge.io | Push to `main` |

### Deployment Workflow

```bash
# Development
git checkout develop
git merge feature/new-feature
git push origin develop
# Automatically deploys to dev environment

# Staging (Release candidate)
git checkout -b release/v1.2.0
# Final testing and bug fixes
git push origin release/v1.2.0
# Automatically deploys to staging

# Production
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags
# Triggers production deployment
```

### Rollback Procedure

```bash
# List recent deployments
vercel list --prod

# Rollback to previous deployment
vercel rollback <deployment-url>

# Or git-based rollback
git checkout main
git revert <commit-hash>
git push origin main
```

---

## Release Management

### Release Types

| Type | Version | Description |
|------|---------|-------------|
| Major | v2.0.0 | Breaking changes |
| Minor | v1.2.0 | New features |
| Patch | v1.2.1 | Bug fixes |

### Release Checklist

```markdown
## Release Checklist v1.2.0

### Pre-Release
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Documentation updated
- [ ] Changelog generated
- [ ] Version bumped
- [ ] Security audit passed

### Release
- [ ] Branch created from develop
- [ ] Final QA sign-off
- [ ] Release notes drafted
- [ ] Deployed to staging
- [ ] Stakeholder review

### Post-Release
- [ ] Merged to main
- [ ] Tag created
- [ ] Deployed to production
- [ ] Announcements sent
- [ ] Monitoring active
```

### Changelog Format

```markdown
# Changelog v1.2.0

## Added
- Dark mode support (#123)
- New button variants (#124)
- Design token export (#125)

## Changed
- Improved accessibility (#126)
- Performance optimizations (#127)

## Fixed
- Button hover state bug (#128)
- Modal focus trap (#129)

## Security
- Updated dependencies (#130)
```

---

## Related Documentation

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Roadmap](./ROADMAP.md)
- [Release Process](./RELEASE_PROCESS.md)
- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md)
