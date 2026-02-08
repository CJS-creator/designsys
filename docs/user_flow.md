# DesignForge User Flow Documentation

> **Last Updated:** February 2024  
> **Architecture:** Tab-based Navigation with Route Aliases

---

## Overview

DesignForge uses a **tab-based navigation architecture** within the main `/app` route. This document describes the actual implementation flow, which differs from the earlier route-based documentation.

## Architecture Decision

The app uses **tab-based navigation** as the primary navigation pattern, with **route aliases** provided for deep linking and direct access to specific sections.

**Why Tab-Based?**
- Smoother user experience within a single design system context
- State preserved when switching between tabs
- Faster navigation without full page reloads
- Better performance with React state management

---

## User Flow

### 1. Authentication Flow

```
User Visits DesignForge
        │
        ▼
┌───────────────────┐
│   Landing Page    │  ← Public page with product info
│   /               │    Sign in / Get Started buttons
└───────────────────┘
        │
        ▼ (Click "Get Started" or "Sign In")
┌───────────────────┐
│   Auth Page      │  ← Email/password or OAuth
│   /auth          │    Supabase authentication
└───────────────────┘
        │
        ▼ (After successful auth)
┌───────────────────┐
│   Dashboard       │  ← Tab-based app interface
│   /app           │    Default: Overview tab
└───────────────────┘
```

### 2. Design System Creation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        DASHBOARD                            │
│                        /app                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Design Requirements Form                          │     │
│  │  ┌─────────────────────────────────────────────┐ │     │
│  │  │ Platform Type (Mobile/Web/Both)             │ │     │
│  │  │ Industry (Healthcare, Tech, etc.)          │ │     │
│  │  │ Brand Mood (Select up to 3)                │ │     │
│  │  │ Primary Brand Color (Optional)              │ │     │
│  │  │ Project Description                        │ │     │
│  │  └─────────────────────────────────────────────┘ │     │
│  │                    │                               │     │
│  │                    ▼                               │     │
│  │  ┌─────────────────────────────────────────────┐ │     │
│  │  │ [Generate Design System]                     │ │     │
│  │  └─────────────────────────────────────────────┘ │     │
│  └─────────────────────────────────────────────────────┘     │
│                            │                                  │
│                            ▼                                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  AI Processing (Fallback algorithm if AI fails)    │     │
│  └─────────────────────────────────────────────────────┘     │
│                            │                                  │
│                            ▼                                  │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Design System Generated                            │     │
│  │  ┌─────────────────────────────────────────────┐ │     │
│  │  │ ✅ Overview Tab (Active)                     │ │     │
│  │  │    - Color Palette                          │ │     │
│  │  │    - Typography System                      │ │     │
│  │  │    - Spacing & Radius                       │ │     │
│  │  │    - Shadows & Elevation                    │ │     │
│  │  │    - Layout Grid                           │ │     │
│  │  └─────────────────────────────────────────────┘ │     │
│  └─────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 3. Tab Navigation

After generating a design system, users can navigate between tabs:

```
┌─────────────────────────────────────────────────────────────────┐
│                      APP HEADER                                  │
│  [Logo] DesignForge  [Brand Switcher] [Export] [User Menu]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐ │
│  │Overview │  Tokens │  Docs   │ Preview │Components│ Motion │ │
│  │         │         │         │         │         │         │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
│                                                                 │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐ │
│  │  Team   │Governance│ Store  │ Assets  │ Vision  │Insights│ │
│  │         │         │        │         │         │         │ │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
│                                                                 │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐          │
│  │ Themes  │Analytics│Accessibl│  Figma  │  Saved  │ Settings│ │
│  └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      TAB CONTENT                          │ │
│  │  (Changes based on selected tab)                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────┬───────┘
                                                          │
                    ┌────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────────┐
│                    TAB DESCRIPTIONS                            │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 OVERVIEW (Default Tab)                                    │
│  ├─ Color Palette (Primary, Secondary, Accent colors)         │
│  ├─ Typography System (Heading & Body scales)                 │
│  ├─ Spacing & Radius (Base unit & border radius values)       │
│  ├─ Elevation & Shadows (Light/Dark compatible)                 │
│  └─ Layout Grid (12-column responsive grid)                    │
│                                                               │
│  🎨 TOKENS                                                   │
│  ├─ Token List (Manage color, spacing, typography tokens)      │
│  ├─ Token Editor (Edit token values with live preview)         │
│  ├─ Version History (Track changes over time)                 │
│  ├─ Sandbox (Compare token changes)                           │
│  ├─ Governance (Approval workflows for token changes)          │
│  └─ AI Copilot (AI suggestions for token optimization)        │
│                                                               │
│  📝 DOCS                                                      │
│  ├─ Documentation Editor                                      │
│  ├─ Component Documentation                                   │
│  └─ Export Options (Markdown, HTML, PDF)                      │
│                                                               │
│  👁️ PREVIEW                                                   │
│  ├─ Interactive Color Preview                                 │
│  ├─ Typography Preview                                        │
│  └─ Responsive Testing                                        │
│                                                               │
│  🧩 COMPONENTS                                                │
│  ├─ Component Sandbox                                         │
│  ├─ Component Library Preview                                 │
│  ├─ Component Blueprints                                      │
│  └─ Code Snippets (React, Vue, HTML, CSS)                     │
│                                                               │
│  ⚡ MOTION                                                    │
│  ├─ Animation Library                                         │
│  ├─ Motion Guidelines                                        │
│  └─ Animation Presets                                         │
│                                                               │
│  👥 TEAM                                                      │
│  ├─ Team Members (Invite, promote, remove)                     │
│  ├─ Role Management (Owner, Editor, Viewer)                   │
│  └─ Project Governance (Freeze/unfreeze project)               │
│                                                               │
│  🛡️ GOVERNANCE                                                 │
│  ├─ Approval Queue (Pending token changes)                    │
│  ├─ Approval Requests (Submit for review)                     │
│  └─ Audit Logs (Track all changes)                             │
│                                                               │
│  🏪 STORE                                                     │
│  ├─ Marketplace (Browse design system templates)               │
│  └─ Asset Hub (Shared assets library)                         │
│                                                               │
│  🎨 ASSETS                                                    │
│  ├─ Asset Library                                              │
│  └─ Export Options                                             │
│                                                               │
│  ✨ VISION                                                     │
│  ├─ Generate from Image                                        │
│  └─ Color Inspiration                                         │
│                                                               │
│  🧠 INSIGHTS                                                  │
│  ├─ Design Health Score                                        │
│  ├─ AI Advisor                                                │
│  └─ Analytics Dashboard                                        │
│                                                               │
│  🎨 THEMES                                                    │
│  └─ Theme Management                                          │
│                                                               │
│  📊 ANALYTICS                                                 │
│  └─ Usage Analytics                                           │
│                                                               │
│  ♿ ACCESSIBILITY                                              │
│  ├─ Accessibility Checker                                     │
│  ├─ Color Blindness Simulator                                 │
│  └─ WCAG Compliance                                           │
│                                                               │
│  🔗 FIGMA                                                     │
│  ├─ Figma Sync                                                │
│  └─ Import from Figma                                         │
│                                                               │
│  📁 SAVED                                                     │
│  ├─ Saved Designs                                             │
│  └─ Version History                                           │
│                                                               │
│  ⚙️ SETTINGS                                                  │
│  ├─ Git Settings (Version control integration)                 │
│  └─ Project Settings                                          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Token Workflow (Draft → Staging → Approval → Live)

Design tokens follow a governance workflow:

```
┌─────────────────────────────────────────────────────────────┐
│                    TOKEN WORKFLOW                            │
│                                                             │
│  1. DRAFT (Local Changes)                                   │
│     └─ User edits tokens in Token Editor                     │
│     └─ Changes apply immediately in local preview            │
│     └─ Not visible to other team members                     │
│                                                             │
│  2. SUBMIT FOR REVIEW                                        │
│     └─ User submits token changes for approval               │
│     └─ Tokens move to "Pending Approval" state               │
│     └─ Team members with approval role can review           │
│                                                             │
│  3. APPROVAL PROCESS                                         │
│     └─ Reviewer examines proposed changes                    │
│     └─ Approve, reject, or request modifications             │
│     └─ Comments can be added for feedback                    │
│                                                             │
│  4. STAGING                                                  │
│     └─ Approved tokens move to Staging                      │
│     └─ Can be tested in preview environment                  │
│     └─ Final review before production                       │
│                                                             │
│  5. LIVE/PRODUCTION                                         │
│     └─ Tokens deployed to production                        │
│     └─ Visible to all users with access                     │
│     └─ Version tagged for reference                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Route Aliases

For deep linking, the following routes are available as aliases:

| Route | Description |
|-------|-------------|
| `/app` | Main dashboard (defaults to Overview tab) |
| `/app?tab=tokens` | Tokens tab |
| `/app?tab=docs` | Documentation tab |
| `/app?tab=preview` | Preview tab |
| `/app?tab=components` | Components tab |
| `/app?tab=motion` | Motion tab |
| `/app?tab=team` | Team tab |
| `/app?tab=governance` | Governance tab |
| `/app?tab=marketplace` | Marketplace tab |
| `/app/settings` | Settings page |
| `/app/api-keys` | API Keys (redirects to Settings) |

**Note:** Direct routes without query params (e.g., `/app/tokens`) are not currently supported. Use the query parameter format for deep linking.

---

## State Management

### Local State
- **Design System State:** Stored in `Index` component (React `useState`)
- **Tab State:** Managed via URL search params (`?tab=xxx`)
- **Form State:** Persisted to `localStorage` for form recovery

### Context Providers
- **AuthContext:** User authentication state
- **OnboardingContext:** Onboarding tour state

### Data Flow
```
User Action
    │
    ▼
Component Handler
    │
    ▼
Update Local State
    │
    ▼
Trigger Re-render
    │
    ▼
UI Updates
```

---

## API Endpoints

### Design Systems
- `POST /v1/design-system` - Create new design system
- `GET /v1/design-system/:id` - Get design system by ID
- `PUT /v1/design-system/:id` - Update design system

### Tokens
- `GET /v1/tokens` - Get tokens for design system (live only)
- `POST /v1/tokens` - Create new token
- `PUT /v1/tokens/:id` - Update token
- `DELETE /v1/tokens/:id` - Delete token

### Team
- `GET /v1/team-members` - Get team members
- `POST /v1/invite` - Invite team member
- `PUT /v1/team-members/:id/role` - Update member role

---

## Responsive Design

The app is fully responsive with breakpoints:

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, scrollable tabs |
| Tablet | 768px - 1024px | Grid layouts adapt |
| Desktop | > 1024px | Full layouts |

---

## Security

- All `/app` routes require authentication (ProtectedRoute)
- API calls authenticated via Supabase session
- Role-based access control (RBAC) for team features
- XSS protection on user input
- SQL injection prevention via Supabase client

---

## Performance

- Lazy loading for heavy components
- Code splitting by routes and tabs
- Local state for instant UI updates
- Optimistic updates for form submissions
- Debounced API calls for search/filter

---

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## Error Handling

### Network Errors
- Automatic retry for transient failures
- Toast notifications for user feedback
- Fallback to mock data in development

### Validation Errors
- Inline form validation
- Real-time feedback on inputs
- Error boundaries for component failures

---

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratios meet standards
- Focus indicators on all interactive elements

---

## Related Documentation

- [API Specification](../api-spec.yaml)
- [Component Library](../components/)
- [Design Tokens](../types/tokens.ts)
- [Supabase Schema](../supabase/schema.sql)
