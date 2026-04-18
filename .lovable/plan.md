

# Complete Implementation Plan: DesignForge Production Readiness

## Current State Summary

**Working well:** Landing page, auth (email + Google), AI design system generation with fallback, sidebar navigation, save/load/rename/duplicate/delete lifecycle, export to multiple formats, dark mode, keyboard shortcuts.

**Broken or incomplete:**

1. **SharedDesign uses `as any` casts** — `share_id` and `is_public` columns exist in DB but Supabase types file hasn't been regenerated, so the code uses unsafe casts (`eq("share_id" as any, id)`)
2. **No DB triggers active** — The `<db-triggers>` section shows "There are no triggers in the database" despite migrations creating them. The owner auto-assign trigger and `updated_at` trigger are not firing.
3. **Share overwrites share_id every time** — `handleShare` generates a new `share_id` on every click instead of reusing existing one
4. **Team invite is user-ID based only** — No email-based invite flow; `inviteMember` requires knowing the target user's UUID
5. **No profile management** — Users can't edit their name, avatar, or username
6. **Token storage is JSONB blob** — All tokens stored in `design_system_data.tokens`, no dedicated table
7. **Version history is unwired** — `design_system_versions` table exists but no auto-snapshot on save
8. **No "forgot password" flow** on auth page
9. **Landing page has placeholder content** — fake logos, fake testimonials, fake stats, fake video embed
10. **Mobile header missing export/save buttons** — only desktop header shows them

## Implementation Plan (4 Phases)

### Phase 1: Fix Critical Bugs (Immediate)

**1a. Re-create missing database triggers**
- Migration to recreate `trg_assign_owner_on_design_system_create` and `set_updated_at` triggers (they exist as functions but triggers aren't attached)
- Verify with a test insert

**1b. Fix share flow**
- Check if design already has a `share_id` before generating a new one
- Remove `as any` casts in `SharedDesign.tsx` — regenerate types or use `.eq("share_id", id)` directly since columns now exist

**1c. Fix mobile header**
- Add Save and Export buttons to mobile Sheet menu in the result view header

**Files:** 1 migration, `DesignSystemDashboard.tsx`, `SharedDesign.tsx`, `Index.tsx`

### Phase 2: Core Feature Gaps

**2a. Email-based team invite**
- Create edge function `invite-member` that looks up user by email in `profiles`, inserts `user_roles` row
- Add email input field to `TeamSettings.tsx` invite UI
- Handle "user not found" gracefully with a message

**2b. Profile management page**
- New `ProfileSettings.tsx` component: edit `full_name`, `username`, `avatar_url`
- Add "Profile" link in the app header user menu
- Wire to `profiles` table UPDATE

**2c. Auto-snapshot versions on save**
- In `handleSave` (Index.tsx), after successful save/update, insert a row into `design_system_versions`
- Wire `VersionManager` component to display version history from DB
- Add restore functionality

**2d. Forgot password**
- Add "Forgot password?" link on Auth page sign-in tab
- Call `supabase.auth.resetPasswordForEmail()`
- Add password reset confirmation UI

**Files:** 1 edge function, `TeamSettings.tsx`, new `ProfileSettings.tsx`, `Index.tsx`, `Auth.tsx`, `VersionManager.tsx`

### Phase 3: Token Management Migration

**3a. Create `design_tokens` table**
- Migration: `design_tokens` with columns `id`, `design_system_id`, `path`, `name`, `type`, `value` (jsonb), `description`, `status`, `created_by`, `created_at`, `updated_at`
- RLS: members can CRUD tokens for their design systems
- Enable realtime

**3b. Migrate `useTokens` hook**
- Query `design_tokens` table instead of JSONB blob
- Keep fallback: if no rows in `design_tokens`, flatten from `design_system_data` (backward compat)
- Individual token CRUD operations become simple row inserts/updates/deletes

**Files:** 1 migration, `useTokens.ts`, `TokenEditor.tsx`

### Phase 4: Polish & Launch Readiness

**4a. Landing page cleanup**
- Replace fake logos/testimonials/stats with realistic placeholder content or remove sections
- Remove fake video embed or replace with a screenshot/demo GIF
- Ensure all CTA buttons link to `/auth` or `/app`

**4b. Empty states & error handling**
- Add proper empty states for: Tokens (no tokens yet), Team (only you), Governance (no requests), Analytics (no events), Docs (no docs), Assets (no assets)
- Wrap all tab content in ErrorBoundary

**4c. Loading state consistency**
- Ensure all Suspense fallbacks use consistent skeleton components
- Add loading states to team invite, share, and delete operations

**4d. Accessibility pass**
- Add `aria-label` to all icon-only buttons
- Ensure focus management in sidebar navigation
- Check color contrast in both light and dark modes

**Files:** Multiple landing components, various tab components in `Index.tsx`

## Execution Order

```text
Phase 1 (1-2 days):  Fix triggers, share flow, mobile header
Phase 2 (3-5 days):  Team invite, profiles, versions, forgot password
Phase 3 (2-3 days):  Token table migration + hook rewrite
Phase 4 (2-3 days):  Polish, empty states, landing cleanup
```

## Database Changes Summary
1. Recreate triggers (owner auto-assign + updated_at)
2. Create `design_tokens` table with RLS
3. No new columns needed (share_id, is_public already exist)

## Key Decisions
- Keep backward compatibility: `useTokens` falls back to JSONB if `design_tokens` table is empty
- Team invite works by email lookup, not by sending actual invitation emails (simpler, ships faster)
- Version snapshots are automatic on every save, not manual

