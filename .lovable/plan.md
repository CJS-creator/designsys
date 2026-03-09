

# Rework Design System Output: Sidebar Navigation Layout

## Problem
The current design system view uses a horizontal scrolling tab bar with 18+ tabs. This is hard to navigate, tabs overflow on smaller screens, and users can't see all sections at a glance.

## New Layout

```text
+------------------+--------------------------------------+
| HEADER (sticky, compact)                                |
+------------------+--------------------------------------+
| SIDEBAR (fixed)  | CONTENT AREA (scrollable)            |
| 240px wide       |                                      |
| ┌──────────────┐ | Section content renders here based   |
| │ ◉ Overview   │ | on selected nav item                 |
| │ ○ Colors     │ |                                      |
| │ ○ Typography │ |                                      |
| │ ○ Spacing    │ |                                      |
| │ ─────────── │ |                                      |
| │ TOOLS        │ |                                      |
| │ ○ Tokens     │ |                                      |
| │ ○ Components │ |                                      |
| │ ○ Motion     │ |                                      |
| │ ─────────── │ |                                      |
| │ COLLABORATE  │ |                                      |
| │ ○ Team       │ |                                      |
| │ ○ Governance │ |                                      |
| │ ─────────── │ |                                      |
| │ MORE         │ |                                      |
| │ ○ Settings   │ |                                      |
| └──────────────┘ |                                      |
+------------------+--------------------------------------+
```

## Sidebar Design
- Fixed left sidebar (240px) with grouped navigation items
- Groups: **Foundation** (Overview, Colors, Typography, Spacing, Shadows, Grid, Radius), **Tools** (Tokens, Preview, Components, Motion, Docs), **Collaborate** (Team, Governance, Marketplace, Assets), **AI & Insights** (Vision, Insights, Themes, Analytics, Accessibility), **Integrations** (Figma, Saved, Settings)
- Each item has icon + label, active state with primary color highlight and left border indicator
- Collapsible on mobile via a hamburger toggle (Sheet drawer)
- Smooth hover animations, subtle glassmorphism background

## Key Changes

### 1. Refactor `src/pages/Index.tsx` (Result View section, lines 211-617)
- Replace the `<Tabs>` + horizontal `<TabsList>` with a two-column flex layout
- Left column: new `DesignSystemSidebar` component
- Right column: conditional rendering based on `activeTab` state (same as current but without Tabs wrapper)
- Keep all existing Suspense/lazy loading patterns

### 2. Create `src/components/DesignSystemSidebar.tsx`
- Receives `activeTab`, `onTabChange`, and collapsed state
- Renders grouped nav items with icons, labels, group headers
- Active item gets `bg-primary/10 text-primary border-l-2 border-primary` styling
- Scroll area for overflow, sticky positioning
- Mobile: renders inside a Sheet drawer triggered by a Menu button in the header

### 3. Split Overview into individual Foundation sections
- Currently Overview tab contains Colors, Typography, Spacing, Shadows, Grid all in one scroll
- The new sidebar will have individual nav items for each, but Overview still shows them all together
- Clicking "Colors" scrolls to or shows just the color section; "Overview" shows the combined view

### 4. Header adjustments
- Remove the sticky tabs bar entirely
- Keep the existing header but make it more compact
- Move the mobile menu trigger to open the sidebar drawer

## Technical Details
- Reuse existing `activeTab` state and `handleTabChange` -- no routing changes needed
- URL sync via `searchParams` stays the same
- All lazy-loaded components remain unchanged
- Sidebar uses `ScrollArea` from radix for overflow
- Framer Motion `layoutId` on the active indicator for smooth transitions between items
- `cn()` utility for conditional classes

## Files Changed
1. `src/pages/Index.tsx` -- Replace tabs layout with sidebar + content layout
2. `src/components/DesignSystemSidebar.tsx` -- New sidebar component

