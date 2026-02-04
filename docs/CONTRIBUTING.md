# DesignForge Contributing Guidelines

## Welcome to DesignForge

Thank you for your interest in contributing to DesignForge! This document provides comprehensive guidelines for contributing to the project. By participating, you agree to follow our code of conduct and contribution standards.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Contribution Workflow](#contribution-workflow)
4. [Code Standards](#code-standards)
5. [Testing Requirements](#testing-requirements)
6. [Documentation](#documentation)
7. [Pull Request Process](#pull-request-process)
8. [Community](#community)

---

## Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm/yarn/pnpm | Latest | Package manager |
| Git | 2.40+ | Version control |
| VS Code | Latest | Recommended IDE |

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "dsznajder.es-js-snippets",
    "7-reactstreetsidesoftware.code-spell-checker"
  ]
}
```

---

## Development Setup

### 1. Fork the Repository

1. Navigate to [DesignForge GitHub Repository](https://github.com/designforge/designsys)
2. Click the **Fork** button in the top-right corner
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/designsys.git
cd designsys
```

### 2. Set Up Upstream Remote

```bash
git remote add upstream https://github.com/designforge/designsys.git
```

### 3. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

### 4. Set Up Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Required environment variables:

```env
VITE_API_URL=http://localhost:4000
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Contribution Workflow

### 1. Create a Feature Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Conventions

| Type | Example | Purpose |
|------|---------|---------|
| feature | `feature/add-dark-mode` | New features |
| bugfix | `bugfix/fix-button-hover` | Bug fixes |
| hotfix | `hotfix/security-patch` | Urgent fixes |
| chore | `chore/update-dependencies` | Maintenance |
| docs | `docs/improve-readme` | Documentation |

### 2. Make Changes

Follow the [Code Standards](#code-standards) and make your changes.

### 3. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add dark mode toggle component"
```

### Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect meaning (white-space, formatting) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvements |
| `test` | Adding or modifying tests |
| `chore` | Maintenance tasks |

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Navigate to the [original repository](https://github.com/designforge/designsys)
2. Click **New Pull Request**
3. Select your fork and feature branch
4. Fill in the PR template
5. Submit for review

---

## Code Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Explicit types
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good: Use types over interfaces for unions
type Status = 'idle' | 'loading' | 'success' | 'error';

// ❌ Bad: Any type
function processData(data: any) { }

// ✅ Good: Unknown type with type narrowing
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
}
```

### React Component Structure

```tsx
// ✅ Good: Organized component
import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';

// Types
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// Component
export function MyComponent({ title, onAction }: MyComponentProps) {
  // Hooks
  const [count, setCount] = useState(0);
  
  // Memos
  const doubled = useMemo(() => count * 2, [count]);
  
  // Callbacks
  const handleClick = useCallback(() => {
    onAction();
    setCount(prev => prev + 1);
  }, [onAction]);
  
  // Render
  return (
    <div className="my-component">
      <h1>{title}</h1>
      <p>Count: {doubled}</p>
      <Button onClick={handleClick}>Increment</Button>
    </div>
  );
}
```

### CSS/Styling

```tsx
// ✅ Good: Tailwind CSS
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <span className="text-neutral-900 font-medium">Title</span>
</div>

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
```

### File Naming

| File Type | Convention | Example |
|-----------|------------|---------|
| Components | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| Hooks | camelCase + hook prefix | `useAuth.ts`, `useFetchData.ts` |
| Utilities | camelCase | `formatDate.ts`, `validateEmail.ts` |
| Types | PascalCase | `user.types.ts`, `design.types.ts` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS.ts` |

### Import Order

```tsx
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// 3. Absolute imports (project)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 4. Relative imports
import { Header } from './Header';
import { Footer } from './Footer';

// 5. Types (separate line)
import type { User } from '@/types/user';
```

---

## Testing Requirements

### Unit Tests

All new features must include unit tests:

```tsx
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
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

### Test Coverage Requirements

| Metric | Minimum |
|--------|---------|
| Statements | 80% |
| Branches | 80% |
| Functions | 80% |
| Lines | 80% |

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test Button.test.tsx
```

---

## Documentation

### Component Documentation

```tsx
/**
 * Button component for triggering actions
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 * 
 * @see {@link https://storybook.designforge.io/?path=/docs/components-button Storybook}
 */
export function Button({ 
  variant = 'default',
  size = 'md',
  children,
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### README Updates

When adding new features, update the README:

```markdown
## Features

- ✅ Dark Mode Support (NEW)
- ✅ Design Token Management
- ✅ Component Library Export
```

---

## Pull Request Process

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature
- [ ] 💄 UI/UX update
- [ ] 📝 Documentation
- [ ] 🔧 Refactoring
- [ ] ✅ Tests
- [ ] 🔒 Security fix

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed self-review
- [ ] I have commented complex code
- [ ] I have updated documentation
- [ ] My changes generate no warnings
- [ ] Tests pass locally
- [ ] Breaking changes documented

## Screenshots (if applicable)
Add screenshots to demonstrate changes

## Related Issues
Fixes #123
Related to #456
```

### PR Review Process

1. **Automated Checks**
   - ✅ Linting passes
   - ✅ Tests pass
   - ✅ Build succeeds
   - ✅ No merge conflicts

2. **Code Review**
   - At least 1 approval required
   - Address all review comments
   - Request re-review after changes

3. **Merge**
   - Squash and merge
   - Delete feature branch

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

- **Be Respectful**: Treat everyone with respect
- **Be Collaborative**: Work together constructively
- **Be Inclusive**: Welcome diverse perspectives
- **Be Professional**: Maintain professional conduct

### Enforcement

Violations should be reported to: conduct@designforge.io

---

## Git Flow

```
main
├── develop
│   ├── feature/user-authentication
│   ├── feature/dark-mode
│   ├── bugfix/login-error
│   └── hotfix/critical-security
└── release/v1.0.0
```

### Branch Protection

- `main`: Protected, requires PR approval
- `develop`: Protected, requires PR approval
- Feature branches: Delete after merge

---

## Release Process

1. Create release branch from `develop`
2. Update version numbers
3. Run full test suite
4. Update changelog
5. Merge to `main`
6. Tag release
7. Deploy to production

---

## Getting Help

| Resource | Link |
|----------|------|
| Documentation | https://docs.designforge.io |
| GitHub Issues | https://github.com/designforge/designsys/issues |
| Discord | https://discord.gg/designforge |
| Email | support@designforge.io |

---

## Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](../CONTRIBUTORS.md)
- Release notes
- Project documentation

---

Thank you for contributing to DesignForge! 🎨
