# Migration Cleanup Plan

## Goal
Remove schema drift in governance-related migrations and define a single canonical path for approvals, roles, and audit logging.

## Observed Drift
Multiple migrations create or alter the same tables/policies with different shapes and assumptions:

- `public.approval_requests`
- `public.approval_changes`
- `public.user_roles`
- `public.audit_logs`

Examples of overlapping migration files:
- `supabase/migrations/20260203150000_production_remediation.sql`
- `supabase/migrations/20260205160000_enable_roles_and_approvals.sql`
- `supabase/migrations/20260205165600_governance.sql`
- `supabase/migrations/20260207130000_fix_schema_gaps.sql`
- `supabase/migrations/20260218124000_phase_2_database_migration.sql`

## Canonical Target Schema
Use generated TypeScript definitions in `src/integrations/supabase/types.ts` as runtime contract source for:

- `approval_requests`
- `approval_changes`
- `user_roles`
- `audit_logs`

## Cleanup Steps

1. Freeze schema contract
- Confirm canonical columns, enums, and constraints for the four tables.
- Confirm canonical enum values:
  - `app_role`: `owner | editor | viewer`
  - `approval_status`: `DRAFT | PENDING_REVIEW | APPROVED | REJECTED | PUBLISHED`

2. Build migration inventory
- For each migration, classify every statement as:
  - `create`
  - `alter`
  - `policy`
  - `trigger/function`
  - `index`
- Mark statements as `keep`, `replace`, or `remove`.

3. Author reconciliation migration
- Add a new forward-only migration that:
  - normalizes column definitions and defaults
  - creates missing indexes idempotently
  - drops duplicate/conflicting policies by name
  - recreates canonical RLS policies deterministically
  - ensures `updated_at` triggers are attached once

4. Data safety checks
- Add pre/post migration checks:
  - row counts per table
  - nullability violations
  - orphaned foreign keys
  - enum value integrity

5. Regression verification
- Run local migration reset and seed.
- Validate core governance actions:
  - submit request
  - fetch queue/details
  - approve and publish
  - reject and revert
  - audit log write

## Acceptance Criteria
- Migrations run from empty DB without manual patching.
- Governance flows succeed with RLS enabled.
- No duplicate/contradictory policies remain on target tables.
- Generated `src/integrations/supabase/types.ts` remains aligned with live schema.

## Progress Update (2026-02-18)
- Added reconciliation migration for analytics/governance telemetry:
  - `supabase/migrations/20260218190000_governance_analytics_reconciliation.sql`
- Added deterministic analytics RLS policies and KPI/SLA views for governance reporting.
- Remaining schema-drift cleanup for `approval_requests`, `approval_changes`, `user_roles`, and `audit_logs` is still tracked in this plan.

## Ownership and Sequence
- Owner: Backend/platform
- Reviewers: Frontend governance + security
- Sequence:
  1. Contract freeze
  2. Reconciliation migration
  3. Flow verification
  4. Type regeneration and final sign-off
