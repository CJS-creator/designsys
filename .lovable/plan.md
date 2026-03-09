

# DesignForge Production Readiness Enhancement Plan

## Current State Assessment

The application has a significant gap between its declared schema and actual database state:

**Database reality**: Only 2 tables exist (`design_systems`, `git_connections`)
**Types file declares**: 11 tables (`api_keys`, `approval_changes`, `approval_requests`, `analytics_events`, `audit_logs`, `design_system_versions`, `profiles`, `user_roles`, `version_changelog` -- all missing)

Multiple components are stubbed or will silently fail. Security scan found 5 actionable findings. The app loads but core features (governance, team management, versioning, API keys) are non-functional.

---

## Phase 1: Database Foundation (Critical -- blocks everything else)

Create the 9 missing tables with proper RLS policies to match the existing `types.ts` schema. This unblocks every stubbed feature.

**Tables to create (single migration):**

1. `profiles` -- user metadata, auto-created via trigger on `auth.users` insert
2. `user_roles` -- role-based access (owner/editor/viewer) per design system
3. `approval_requests` -- governance workflow requests with status enum
4. `approval_changes` -- individual token changes within an approval request
5. `api_keys` -- API key management for external access
6. `audit_logs` -- immutable audit trail for all actions
7. `analytics_events` -- event tracking
8. `design_system_versions` -- snapshot versioning with publish state
9. `version_changelog` -- granular change tracking per version

**RLS policies for each table:**
- All tables restricted to authenticated users
- `profiles`: users can read/update their own profile
- `user_roles`: owners can manage roles; members can read their own
- `approval_requests`/`approval_changes`: accessible by design system owner and team members
- `api_keys`: owner-only CRUD
- `audit_logs`: insert by team members, read by owner/editors, no delete
- `design_system_versions`/`version_changelog`: accessible by team members

**Supporting objects:**
- `approval_status` enum: DRAFT, PENDING_REVIEW, APPROVED, REJECTED, PUBLISHED
- `app_role` enum: owner, editor, viewer
- Trigger: auto-create `profiles` row on new user signup
- Trigger: `update_updated_at_column` on all tables with `updated_at`

---

## Phase 2: Activate Stubbed Features

Once tables exist, replace stubs with real database queries:

1. **Team Settings** (`TeamSettings.tsx`, `useTeam.ts`) -- wire up `user_roles` + `profiles` join queries
2. **Approval Workflow** (`ApprovalWorkflow.tsx`, `useApprovals.ts`) -- already has full logic, just needs tables to exist
3. **API Keys** (`APIKeys.tsx`) -- wire up `api_keys` table with edge function for key generation
4. **Token Versioning** (`TokenVersioning.tsx`, `versioning.tsx`) -- connect to `design_system_versions` and `version_changelog`
5. **Audit Logs** (`AuditLogViewer.tsx`, `auditLogs.ts`) -- connect to `audit_logs` table

---

## Phase 3: Security Remediation

Address the 5 findings from the security scan:

1. **Access tokens in plaintext** (error) -- Migrate GitHub/Figma tokens to Supabase Vault encryption
2. **`record_audit_log` SECURITY DEFINER without constraints** (warn) -- Add authorization check and `SET search_path = public`
3. **Broken migration reference** (error) -- Fix `figma_sync` migration referencing non-existent `handle_updated_at()` function
4. **Error boundary info leakage** (warn) -- Show generic error in production, detailed only in dev mode
5. **XSS in static HTML export** (warn) -- Add `escapeHtml()` sanitizer to `static-docs.ts`
6. **Leaked password protection** -- Enable in auth settings

---

## Phase 4: Code Cleanup and Stability

1. **Remove dead file** -- `src/integrations/supabase/safe-client.ts` (already cleaned up, confirm removed)
2. **Remove legacy folders** -- `apps/` directory is no longer needed after restructuring
3. **Fix console.log in production** -- Replace `console.log` calls in `monitoring.ts` with conditional dev-only logging
4. **Consolidate `useUserRole`** -- Single hook that reads from `user_roles` table instead of localStorage
5. **Shared design route** -- Either implement `is_public` flag on `design_systems` or remove `/share/:id` route

---

## Phase 5: Performance and Polish

1. **Lazy-load heavy libraries** -- `reactflow`, `recharts`, `jspdf`, `docx`, `jszip` should only load when their components mount
2. **Mobile responsiveness audit** -- Landing page hero text, bento grid overflow, navigation z-index
3. **Loading/error state consistency** -- Standardize skeleton loaders and error feedback across all data-fetching components
4. **Enable email confirmation** -- Ensure users verify email before accessing protected routes

---

## Recommended Execution Order

```text
Week 1:  Phase 1 (database migration) + Phase 3 items 3,4,5
Week 2:  Phase 2 (activate features) + Phase 3 items 1,2
Week 3:  Phase 4 (cleanup) + Phase 5 (performance)
```

## Success Criteria

- All 11 declared tables exist with RLS policies
- Zero security scan errors
- Team management, approval workflow, API keys, and versioning work end-to-end
- No stubbed/placeholder UI visible to users
- Build passes with zero TypeScript errors
- Landing page scores 90+ on Lighthouse performance

