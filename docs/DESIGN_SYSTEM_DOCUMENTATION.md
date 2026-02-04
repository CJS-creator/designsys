# DesignForge Design System Documentation

## Overview

DesignForge is a comprehensive design system application that provides tools for creating, managing, and maintaining design tokens, components, and brand guidelines. This document outlines the core design principles, visual standards, and usage guidelines for the DesignForge platform.

---

## Design Tokens

Design tokens are the atomic values of the design system. They store visual design attributes like colors, typography, spacing, and shadows as design decisions in a platform-agnostic format.

### Color Tokens

```typescript
// Primary Colors
--color-primary-50: #eff6ff
--color-primary-100: #dbeafe
--color-primary-200: #bfdbfe
--color-primary-300: #93c5fd
--color-primary-400: #60a5fa
--color-primary-500: #3b82f6
--color-primary-600: #2563eb
--color-primary-700: #1d4ed8
--color-primary-800: #1e40af
--color-primary-900: #1e3a8a

// Neutral Colors
--color-neutral-50: #f9fafb
--color-neutral-100: #f3f4f6
--color-neutral-200: #e5e7eb
--color-neutral-300: #d1d5db
--color-neutral-400: #9ca3af
--color-neutral-500: #6b7280
--color-neutral-600: #4b5563
--color-neutral-700: #374151
--color-neutral-800: #1f2937
--color-neutral-900: #111827

// Semantic Colors
--color-success-500: #22c55e
--color-warning-500: #f59e0b
--color-error-500: #ef4444
--color-info-500: #3b82f6
```

### Typography Tokens

```typescript
// Font Family
--font-sans: 'Inter', system-ui, -apple-system, sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace

// Font Size (using rem units)
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 1.875rem
--text-4xl: 2.25rem

// Font Weight
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700

// Line Height
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.625

// Letter Spacing
--tracking-tight: -0.025em
--tracking-normal: 0
--tracking-wide: 0.025em
```

### Spacing Tokens

```typescript
--space-0: 0
--space-px: 1px
--space-0-5: 0.125rem
--space-1: 0.25rem
--space-1-5: 0.375rem
--space-2: 0.5rem
--space-2-5: 0.625rem
--space-3: 0.75rem
--space-3-5: 0.875rem
--space-4: 1rem
--space-5: 1.25rem
--space-6: 1.5rem
--space-7: 1.75rem
--space-8: 2rem
--space-9: 2.25rem
--space-10: 2.5rem
--space-11: 2.75rem
--space-12: 3rem
--space-14: 3.5rem
--space-16: 4rem
--space-20: 5rem
--space-24: 6rem
--space-28: 7rem
--space-32: 8rem
```

### Border Radius Tokens

```typescript
--radius-none: 0
--radius-sm: 0.125rem
--radius-base: 0.25rem
--radius-md: 0.375rem
--radius-lg: 0.5rem
--radius-xl: 0.75rem
--radius-2xl: 1rem
--radius-3xl: 1.5rem
--radius-full: 9999px
```

### Shadow Tokens

```typescript
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

---

## Color System

### Primary Color Usage

The primary color palette is used for interactive elements, brand accents, and call-to-action components.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary-500` | `#3b82f6` | Primary buttons, active states, links |
| `--color-primary-600` | `#2563eb` | Primary buttons (hover), focus rings |
| `--color-primary-700` | `#1d4ed8` | Primary buttons (active), emphasis |
| `--color-primary-100` | `#dbeafe` | Backgrounds, badges, light accents |

### Semantic Color Usage

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success-500` | `#22c55e` | Success messages, positive actions |
| `--color-warning-500` | `#f59e0b` | Warnings, cautionary states |
| `--color-error-500` | `#ef4444` | Error messages, destructive actions |
| `--color-info-500` | `#3b82f6` | Informational messages, tips |

### Color Accessibility

All text must maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text against its background. Use the [ColorBlindnessSimulator](./ColorBlindnessSimulator.tsx) component to test designs.

```tsx
// Example: Accessible text with proper contrast
<div className="bg-neutral-900">
  <Text className="text-white">Accessible text</Text>
</div>
```

---

## Typography System

### Font Stack

DesignForge uses a system font stack optimized for performance and readability:

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Type Scale

| Level | Size | Line Height | Usage |
|-------|------|-------------|-------|
| Display | 3.5rem (56px) | 1.1 | Hero headlines |
| H1 | 2.5rem (40px) | 1.2 | Page titles |
| H2 | 2rem (32px) | 1.25 | Section headings |
| H3 | 1.5rem (24px) | 1.3 | Subsection headings |
| H4 | 1.25rem (20px) | 1.4 | Component titles |
| Body Large | 1.125rem (18px) | 1.6 | Lead paragraphs |
| Body | 1rem (16px) | 1.6 | Regular text |
| Body Small | 0.875rem (14px) | 1.5 | Secondary text |
| Caption | 0.75rem (12px) | 1.4 | Labels, metadata |

### Component Typography

```tsx
// Page Title (H1)
<h1 className="text-4xl font-bold tracking-tight text-neutral-900">

// Section Title (H2)
<h2 className="text-2xl font-semibold tracking-tight text-neutral-900">

// Card Title (H3)
<h3 className="text-lg font-medium text-neutral-900">

// Body Text
<p className="text-base text-neutral-600 leading-relaxed">

// Caption
<span className="text-sm text-neutral-500">
```

---

## Spacing & Layout

### Spacing Scale

DesignForge uses a 4px base unit for spacing. All spacing values should be multiples of 4px:

| Token | Pixels | Usage |
|-------|--------|-------|
| `--space-1` | 4px | Tight spacing, inline elements |
| `--space-2` | 8px | Standard gap, button inner spacing |
| `--space-3` | 12px | Small component spacing |
| `--space-4` | 16px | Component spacing, padding |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Large section spacing |
| `--space-12` | 48px | Page section gaps |

### Layout Grid

```css
/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Grid System */
.grid-cols-4  { grid-template-columns: repeat(4, 1fr); }
.grid-cols-8  { grid-template-columns: repeat(8, 1fr); }
.grid-cols-12 { grid-template-columns: repeat(12, 1fr); }

/* Gap */
.gap-2  { gap: var(--space-2); }
.gap-4  { gap: var(--space-4); }
.gap-6  { gap: var(--space-6); }
.gap-8  { gap: var(--space-8); }
```

### Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

---

## Component Guidelines

### Button Component

```tsx
import { Button } from './components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Card Component

```tsx
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Input Component

```tsx
import { Input } from './components/ui/input'

<Input 
  placeholder="Enter text..."
  type="email"
  disabled={false}
/>
```

---

## Accessibility Guidelines

### WCAG 2.1 Compliance

DesignForge targets WCAG 2.1 Level AA compliance.

### ARIA Requirements

All interactive components must include appropriate ARIA attributes:

```tsx
// Accessible button with aria-label
<button 
  aria-label="Close dialog"
  onClick={handleClose}
>
  <XIcon />
</button>

// Accessible input with aria-describedby
<Input 
  aria-describedby="email-help"
  aria-invalid={hasError}
/>
<span id="email-help">Enter your email address</span>
```

### Focus Management

```css
/* Visible focus ring */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order should follow visual order
- Focus indicators must be visible
- Skip links should be provided for main content

---

## Motion & Animation

### Animation Tokens

```typescript
--animate-fade-in: fade-in 0.3s ease-out
--animate-slide-up: slide-up 0.3s ease-out
--animate-slide-down: slide-down 0.3s ease-out
--animate-scale-in: scale-in 0.2s ease-out
--animate-spin: spin 1s linear infinite

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Animation Duration

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-fast` | 150ms | Micro-interactions, hover states |
| `--duration-normal` | 300ms | Component transitions |
| `--duration-slow` | 500ms | Page transitions, modals |
| `--duration-slower` | 700ms | Complex animations |

### Motion Guidelines

```tsx
// Use Framer Motion for complex animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## Iconography

### Icon Set

DesignForge uses Lucide React icons:

```tsx
import { 
  Home, 
  Settings, 
  User, 
  Bell, 
  Search,
  Menu,
  X,
  Plus,
  Edit,
  Trash,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
```

### Icon Sizes

| Size | Token | Usage |
|------|-------|-------|
| Small | 16px | Inline text icons, badges |
| Medium | 20px | Default icon size |
| Large | 24px | Hero icons, featured |
| XL | 32px | Display icons |

---

## Dark Mode

### Dark Mode Colors

```css
.dark {
  --color-background: 222 47% 11%;
  --color-foreground: 210 40% 98%;
  --color-primary: 217 91% 60%;
  --color-secondary: 217 33% 17%;
  --color-muted: 217 33% 17%;
  --color-accent: 217 33% 17%;
}
```

### Dark Mode Implementation

```tsx
// Using CSS custom properties
<div className="bg-white dark:bg-neutral-900">
  <p className="text-neutral-900 dark:text-neutral-100">
    Content adapts to dark mode
  </p>
</div>

// Using Tailwind's dark modifier
<button className="dark:bg-primary-600">
  Button adapts to dark mode
</button>
```

---

## File Structure

```
src/
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── animations/            # Animation components
│   ├── landing/               # Landing page components
│   └── tokens/                # Token management components
├── pages/                     # Page components
├── styles/                    # Global styles
└── utils/                     # Utility functions
```

---

## Contributing

When contributing to the design system:

1. Follow token naming conventions
2. Ensure color contrast compliance
3. Add appropriate ARIA attributes
4. Test keyboard navigation
5. Document new components
6. Update this documentation

---

## Related Documentation

- [Component Library Documentation](./COMPONENT_LIBRARY.md)
- [Design Tokens Specification](./DESIGN_TOKENS.md)
- [Accessibility Guidelines](./ACCESSIBILITY.md)
- [Color System Documentation](./COLOR_SYSTEM.md)
- [Typography System Documentation](./TYPOGRAPHY.md)
