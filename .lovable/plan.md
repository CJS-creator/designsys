
# Overview Page UI/UX Audit & Enhancement Plan

## Issues Found

### 1. Layout & Alignment
- **Sticky sidebar broken**: `lg:col-span-4 sticky top-0` — `top-0` with no offset means it tucks under the page header. Should be `top-20` (or matching header height) and needs `self-start` so it doesn't stretch.
- **Sidebar can exceed viewport**: `DesignHealthScore` + `AIAdvisor` + `InteractiveColorsDisplay` stacked in a sticky column will scroll-jump on shorter viewports. Needs `max-h-[calc(100vh-6rem)] overflow-y-auto`.
- **Inconsistent card radius**: Hero uses `rounded-[2.5rem]`, all section cards use `rounded-xl`, sub-cards inside use `rounded-2xl`/`rounded-3xl`. Needs a single radius scale (suggest `rounded-2xl` for sections, `rounded-xl` for sub-cards).
- **Inconsistent padding**: Sections use `p-5 md:p-6`, hero uses `p-5 md:p-8`, FeaturesOverview cards use `p-5`. Standardize to `p-6`.
- **Spacing & Radius section**: header `mb-4` while every other section uses `mb-2` between icon-row and description — visual rhythm is off.

### 2. Content Duplication
- **`InteractiveColorsDisplay` appears twice**: in the Overview sidebar AND inside the Colors tab (line 462). Sidebar position duplicates content the user sees again on the Colors tab.
- **Brand Color Palette block is identical** in Overview (line 400-407) and Colors tab (line 454-460). Overview should be a condensed preview, not a full duplicate.
- **Spacing/Typography/Shadows blocks** in Overview duplicate their dedicated tabs verbatim — Overview becomes a long scroll instead of a summary.

### 3. Typography & Hierarchy
- **Mixed font weights**: HeroSection uses `font-black`, FeaturesOverview uses `font-bold`, DesignHealthScore uses `font-black tracking-tighter`. No consistent type scale.
- **Hero h2 uses `leading-none`** — long design system names (e.g. "Enterprise SaaS Platform") clip descenders.
- **Section titles inconsistent**: `text-lg font-semibold` in sections vs `text-xl` in DesignHealthScore vs `text-4xl md:text-5xl` in hero — no clear h1/h2/h3 step.
- **Sub-headers in Spacing section** use `uppercase tracking-wider` but section title doesn't — inconsistent treatment.

### 4. Visual Noise
- **Hero badge text** "READY FOR PRODUCTION" is misleading on a freshly generated, unsaved system.
- **FeaturesOverview values are static/fake**: "100%", "<1ms", "Pass" are hardcoded marketing copy, not real metrics. Should be removed or wired to actual audit data.
- **Hero "Colors" / "Type Scales" pills** repeat info shown immediately below in FeaturesOverview and DesignHealthScore.
- **DesignHealthScore inside narrow `col-span-4` sidebar**: 3 stat cards (`flex gap-4`) get squeezed, numbers wrap awkwardly below ~360px column width.

### 5. Responsive Issues
- **`lg` breakpoint flip is jarring**: at `<1024px` everything collapses to one column, sidebar drops below content (DesignHealthScore appears after a long scroll). Health Score should appear near the top on mobile.
- **Hero text** `text-4xl md:text-5xl` with `leading-none tracking-tighter` overflows on narrow viewports for long names.
- **InteractiveColorsDisplay** inside `col-span-4` shows `lg:grid-cols-4` which becomes 4 tiny squeezed swatches per row in the sidebar.

### 6. Accessibility
- Hero badge `Sparkles` icon is decorative but not marked `aria-hidden`.
- FeaturesOverview cards are visual-only with no semantic role; values like "Pass" lack context for screen readers.
- DesignHealthScore percentage uses color-only signaling (red/amber/green) without text labels.
- "View N More Issues" button in DesignHealthScore is non-functional (no onClick).

### 7. Interaction
- Section cards have no clear CTA to jump to their dedicated tab. User has to manually click sidebar links.
- Hero pills have `cursor-default` — they look like buttons but do nothing. Either make them clickable filters or remove the button styling.
- AIAdvisor suggestions are read-only — no "fix it" or "dismiss" actions despite mentioning "Magic Fix".

## Proposed Fixes

### Phase A — Layout (high impact, low risk)
1. Fix sticky sidebar: `lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto`
2. Standardize card chrome: `rounded-2xl p-6 border border-border bg-card shadow-sm`
3. On mobile (`<lg`), reorder so DesignHealthScore appears between hero and FeaturesOverview.

### Phase B — Reduce duplication
4. Overview should show **previews**, not full sections. Replace the full `ColorPaletteDisplay` / `TypographyDisplay` / `SpacingDisplay` / `ShadowDisplay` / `GridDisplay` blocks with compact summary cards (top 6 colors, 2 font samples, 4 spacing steps) that link "View all →" to the dedicated tab.
5. Remove `InteractiveColorsDisplay` from sidebar (keep on Colors tab only). Replace with a slim "Quick Actions" card (Save, Export, Share).

### Phase C — Typography & polish
6. Define a 3-step heading scale used everywhere on this page: hero `text-3xl md:text-4xl font-bold tracking-tight leading-tight`, section title `text-lg font-semibold`, sub `text-sm font-semibold uppercase tracking-wider text-muted-foreground`.
7. Normalize font weight: `font-bold` for titles, `font-semibold` for sub-titles, drop `font-black`.
8. Add `aria-hidden` to all decorative icons; add `aria-label` to icon-only buttons.

### Phase D — Truthful metrics
9. Replace FeaturesOverview hardcoded values with real ones: token count from `Object.keys`, contrast pass count from `getContrastRatio`, font names from `designSystem.typography.fontFamily`.
10. Wire DesignHealthScore "View N More Issues" button to expand the list.
11. Remove "READY FOR PRODUCTION" badge or make it conditional on `designSystem.id` (i.e., only after first save).

### Phase E — Interaction
12. Add a "View details →" link to each Overview section card that switches to that tab.
13. Make hero stat pills either clickable (jump to that tab) or downgrade to non-button `<div>`s without `hover-lift`.

## Files Changed
- `src/pages/Index.tsx` (Overview branch, lines 387-450) — layout, ordering, preview cards
- `src/components/HeroSection.tsx` — typography, conditional badge, a11y
- `src/components/FeaturesOverview.tsx` — wire real metrics
- `src/components/DesignHealthScore.tsx` — sidebar-friendly compact mode, "View more" wiring
- `src/components/AIAdvisor.tsx` — minor a11y pass

## Out of Scope
- Sidebar nav itself (separate concern)
- Other tabs (Colors, Typography, etc. — only mentioned where they overlap with Overview)
- Landing page
