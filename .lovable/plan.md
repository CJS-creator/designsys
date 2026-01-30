

# DesignForge Domain Update & Build Fix Plan

## Overview

Since you've secured the domain **designforge.me**, we'll keep the "DesignForge" brand name and update all URL references throughout the codebase. We'll also fix the two existing build errors.

---

## Part 1: Fix Build Errors (Immediate)

### Error 1: Missing `ShieldCheck` Import in Index.tsx

**File:** `src/pages/Index.tsx` (Line 312)

**Problem:** The `ShieldCheck` icon is used but not imported from lucide-react.

**Solution:** Add `ShieldCheck` to the existing lucide-react import on line 33.

```typescript
// Line 33 - Add ShieldCheck to imports
import { SwatchBook, Sparkles, ArrowLeft, Wand2, History, FileText, LogOut, User, Brain, Activity, Box, Layers, Type, Settings, Users, Grid3X3, Palette, Eye, Smartphone, Code2, HelpCircle, Zap, X, Search, Lock, Layout, GitCompare, Shield, BookOpen, ExternalLink, Ruler, Maximize, Cast, Menu, BarChart3, ShieldCheck } from "lucide-react";
```

---

### Error 2: Typography Token Type Mismatch in verifyTokenEngine.ts

**File:** `src/tests/verifyTokenEngine.ts` (Lines 17-25)

**Problem:** The `typography.h1` token's value object is missing required properties (`fontFamily`, `lineHeight`) as defined in the `TypographyToken` type.

**Solution:** Add the missing required properties to comply with the `TypographyToken` interface.

```typescript
// Lines 17-25 - Update typography token
'typography.h1': {
    name: 'H1',
    path: 'typography.h1',
    type: 'typography',
    value: {
        fontFamily: 'Inter, sans-serif',  // Added
        fontSize: '{spacing.xl}',
        fontWeight: '{fontWeights.bold}',
        lineHeight: 1.2                    // Added
    }
}
```

---

## Part 2: Update Domain URLs

### Files Requiring URL Updates (5 files)

| File | Current URL | New URL |
|------|-------------|---------|
| `src/lib/exporters/ci-cd-templates.ts` | `api.designforge.ai` | `api.designforge.me` |
| `src/lib/exporters/ci-cd-templates.ts` | `bot@designforge.ai` | `bot@designforge.me` |
| `src/lib/exporters/storybook-advanced.ts` | `designforge.ai` | `designforge.me` |
| `src/components/FigmaSync.tsx` | Plugin community URL | Update to `designforge.me` domain |

### Detailed Changes

**1. `src/lib/exporters/ci-cd-templates.ts`**
```typescript
// Line 27 - Update API URL
curl -X GET "https://api.designforge.me/v1/export/${ds.id || 'current-id'}?format=json" \\

// Line 28 - Update secret name reference
-H "Authorization: Bearer \${{ secrets.DESIGNFORGE_TOKEN }}" \\

// Line 34 - Update bot email
git config --global user.email "bot@designforge.me"
```

**2. `src/lib/exporters/storybook-advanced.ts`**
```typescript
// Line 14-15 - Update brand URLs
brandUrl: 'https://designforge.me',
brandImage: 'https://designforge.me/logo.png',
```

---

## Part 3: Update Meta Tags in index.html

**File:** `index.html`

Update the placeholder meta tags with DesignForge branding:

```html
<title>DesignForge - AI-Powered Design System Generator</title>
<meta name="description" content="Transform natural language prompts into complete, production-ready design systems with AI. Generate colors, typography, spacing, and components in seconds." />
<meta name="author" content="DesignForge" />

<meta property="og:title" content="DesignForge - AI-Powered Design System Generator" />
<meta property="og:description" content="Transform natural language prompts into complete, production-ready design systems with AI." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://designforge.me" />
<meta property="og:image" content="https://designforge.me/og-image.png" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@DesignForgeAI" />
<meta name="twitter:title" content="DesignForge - AI-Powered Design System Generator" />
<meta name="twitter:description" content="Transform natural language prompts into complete, production-ready design systems with AI." />
<meta name="twitter:image" content="https://designforge.me/og-image.png" />
```

---

## Part 4: Update README.md

**File:** `README.md`

Update with proper DesignForge branding and documentation:

```markdown
# DesignForge

AI-powered design system generator that transforms natural language prompts into complete, production-ready design systems.

**Live App:** https://designforge.me

## Features
- AI-powered design system generation
- 20+ export formats (CSS, Tailwind, SwiftUI, Kotlin, Flutter, etc.)
- Real-time collaboration
- Figma Variables sync
- Component library with live previews
- Accessibility checker
- Multi-brand support

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase (via Lovable Cloud)
```

---

## Part 5: Files Summary

### Files to Modify (7 total)

| # | File | Changes |
|---|------|---------|
| 1 | `src/pages/Index.tsx` | Add `ShieldCheck` to imports |
| 2 | `src/tests/verifyTokenEngine.ts` | Fix typography token type |
| 3 | `src/lib/exporters/ci-cd-templates.ts` | Update domain URLs |
| 4 | `src/lib/exporters/storybook-advanced.ts` | Update brand URLs |
| 5 | `index.html` | Update all meta tags |
| 6 | `README.md` | Update project documentation |
| 7 | `src/components/FigmaSync.tsx` | Update plugin URL (optional) |

---

## Part 6: Implementation Order

1. **Immediate (Build Fixes)**
   - Add `ShieldCheck` import to Index.tsx
   - Fix typography token in verifyTokenEngine.ts

2. **Branding Updates**
   - Update index.html meta tags
   - Update README.md

3. **URL Updates**
   - Update ci-cd-templates.ts
   - Update storybook-advanced.ts

4. **Validation**
   - Run `npm run build` to verify no errors
   - Test the app locally

---

## Notes

- The brand name "DesignForge" remains unchanged across all 30+ files
- Only domain-related URLs are being updated to `designforge.me`
- Storage keys like `designforge_onboarding` remain unchanged (internal keys don't need domain updates)
- Package names in exporters like `com.designforge.generated` can remain as-is (valid identifier)

