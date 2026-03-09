

# Plan: Turn DesignForge from Demo to Production-Ready App

## Current State Assessment

The app has a solid foundation but several critical gaps prevent it from being a real product:

**What works:**
- Auth (signup/login/Google OAuth) with profiles table
- Design system generation (AI + fallback)
- Save/load design systems to database
- UI for tokens, colors, typography, spacing, shadows, grid
- Export to multiple formats (JSON, CSS, Tailwind, SCSS, etc.)
- Sidebar navigation, dark mode, keyboard shortcuts

**What's broken or stubbed:**
- **No owner role auto-assignment** -- when a user creates a design system, no `user_roles` row is inserted, so team/governance features silently fail
- **Token management** stores tokens inside `design_system_data` JSONB (no dedicated token table)
- **FigmaSync** queries a non-existent `figma_connections` table (will error)
- **API Keys** component talks to `api_keys` table but key generation uses an edge function that may not hash properly
- **Approval workflow** is wired to real tables but unusable without role assignment
- **No design system rename/edit** -- users can save but can't rename or update metadata
- **No sharing flow** -- share button exists but no public URL generation
- **No email confirmation handling** -- users can't verify emails smoothly

## Competitive Analysis (vs Supernova, Zeroheight, Tokens Studio)

Missing essentials for market parity:
1. **Design system CRUD lifecycle** -- rename, duplicate, delete with confirmation
2. **Auto-assign owner role on create** -- fundamental for RBAC to work
3. **Team invite flow** -- invite by email, accept/reject
4. **Public sharing** -- generate shareable read-only URLs
5. **Token CRUD** -- dedicated UI to create/edit/delete individual tokens
6. **Version history** -- view and restore previous versions
7. **Profile management** -- edit name, avatar, username

## Implementation Plan (6 Phases)

### Phase 1: Fix the Foundation (Critical Bugs)
- **Auto-assign owner role**: After inserting a design system, also insert a `user_roles` row with `role: 'owner'` for the creator. This unblocks Team, Governance, and Approval features.
- **Fix FigmaSync**: Replace `figma_connections` query with a `git_connections` query (the table that actually exists) or create a proper `figma_connections` table via migration.
- **Fix design system ID propagation**: Ensure `designSystem.id` is set after save so that all downstream hooks (`useTokens`, `useUserRole`, `useTeam`) receive a valid ID.

### Phase 2: Design System Lifecycle
- **Rename design system**: Inline edit for name/description on the header
- **Update design system**: Save changes to existing design system (UPDATE instead of always INSERT)
- **Delete design system**: With confirmation dialog
- **Duplicate design system**: Clone with new name
- **Dashboard view**: Replace the current "Saved" tab with a proper dashboard showing all design systems as cards with last-edited timestamps

### Phase 3: Token Management
- **Create a `design_tokens` table** via migration with columns: `id`, `design_system_id`, `path`, `name`, `type`, `value`, `description`, `created_by`, `created_at`, `updated_at`
- **Migrate `useTokens` hook** to query `design_tokens` table instead of JSONB
- **Token CRUD UI**: Add/edit/delete individual tokens with type validation
- **Bulk import/export**: Import tokens from JSON, export as Style Dictionary format

### Phase 4: Collaboration & Sharing
- **Team invite by email**: Send invite via edge function, create pending `user_roles` row
- **Public sharing**: Add `is_public` and `share_id` columns to `design_systems`, generate shareable URLs
- **Profile page**: Let users edit their name, username, avatar
- **Realtime presence**: Already partially implemented, just needs the `design_system_id` to be valid

### Phase 5: Version Control
- Wire the existing `design_system_versions` table to the UI
- **Auto-snapshot on save**: Create a version entry each time a design system is updated
- **Version diff viewer**: Show what changed between versions using the existing `version_changelog` table
- **Restore version**: One-click restore to a previous snapshot

### Phase 6: Polish & Launch Readiness
- **Onboarding improvements**: Guide users to create their first design system
- **Empty states**: Proper empty state UIs for all sections when no data exists
- **Error handling**: Replace silent failures with user-friendly error messages
- **Loading states**: Ensure all async operations show proper skeletons
- **Mobile responsiveness audit**: Test and fix all views on small screens
- **SEO & meta tags**: Update landing page meta for discoverability

### Database Migrations Required
1. Add `design_tokens` table with RLS
2. Add `figma_connections` table (or repurpose `git_connections`)
3. Add `is_public`, `share_id` columns to `design_systems`
4. Create trigger: auto-insert owner role on `design_systems` INSERT
5. Enable realtime on `design_tokens` table

### Files to Create/Modify (Key ones)
- `src/pages/Index.tsx` -- Fix save flow, add update/rename/delete
- `src/hooks/useTokens.ts` -- Migrate to `design_tokens` table
- `src/hooks/useTeam.ts` -- Add invite functionality
- `src/components/SavedDesigns.tsx` -- Add rename, delete, duplicate actions
- `src/components/TeamSettings.tsx` -- Add email invite form
- `src/components/FigmaSync.tsx` -- Fix table reference
- `src/components/tokens/TokenEditor.tsx` -- Real CRUD operations
- New: `src/components/ProfileSettings.tsx` -- User profile management
- New: `src/components/DesignSystemDashboard.tsx` -- Card grid of all systems
- New: `supabase/functions/invite-member/index.ts` -- Email invite edge function

### Recommended Execution Order
Start with **Phase 1** (fix foundation) since it unblocks 3 other feature areas with minimal effort. Then **Phase 2** (lifecycle) to give users basic CRUD. Then **Phase 3-5** in parallel as independent workstreams. **Phase 6** as final sweep before launch.

