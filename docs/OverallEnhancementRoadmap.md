# Overall Enhancement Roadmap

## Purpose
Ensure we improve the full platform, not just approval flow. This roadmap aligns with `docs/ApprovalWorkflowPitch.md` and turns governance into one pillar of a broader product strategy.

## Current Baseline
- Lint/type quality gate is stabilized:
  - `npm run lint`: pass
  - `npx tsc -p tsconfig.app.json --noEmit`: pass
  - `npx tsc --noEmit --incremental false`: pass
- `npm run build`: pass
- Governance workflow is now live end-to-end (`ApprovalQueue`, `ApprovalRequest`, `useApprovals`, `ApprovalWorkflow` -> `GovernanceDashboard`).

## Strategic Goals (Next 2 Quarters)
1. Make governance production-ready and trustworthy.
2. Improve end-to-end token workflow speed for designers and developers.
3. Strengthen app architecture for scale (data model, performance, reliability).
4. Improve accessibility, usability, and cross-platform responsiveness.
5. Build stronger integration value with Figma, Storybook, and token ecosystems.

## Priority Workstreams

### 1) Governance and Approval Workflow (Critical)
Impact:
- Core differentiator from pitch is not fully functional today.

Root issues:
- `src/hooks/useApprovals.ts` is a stub, despite schema/types including `approval_requests` and `approval_changes`.
- `src/components/ApprovalWorkflow.tsx` is a stub while another governance UI exists in `src/components/tokens/GovernanceDashboard.tsx`.
- User flow is split across surfaces, creating confusion and weak trust.

Actions:
- Implement `useApprovals` with real Supabase queries/mutations and typed payloads.
- Consolidate governance entry points into one primary experience.
- Add explicit status transitions (`DRAFT -> PENDING_REVIEW -> APPROVED/REJECTED -> PUBLISHED`) with audit logging.
- Add reject reasons, activity timeline, and notifications.

Effort:
- 2 to 3 weeks

### 2) Data Model and Architecture Modernization (Critical)
Impact:
- Token editing and governance scale is limited by storing mutable tokens in a single JSON blob.

Root issues:
- `useTokens` currently reads/writes `design_system_data.tokens` JSON in `design_systems`.
- Weak concurrency controls and coarse update granularity.
- Migrations show overlapping governance/table definitions, increasing schema drift risk.

Actions:
- Move token persistence to normalized tables (`design_tokens`, `token_versions`, `token_groups`) with optimistic versioning.
- Introduce service/repository layer for Supabase access to isolate UI from data contracts.
- Add migration audit cleanup doc and idempotency guardrails for schema evolution.

Effort:
- 3 to 5 weeks

### 3) UX, Accessibility, and Workflow Efficiency (Major)
Impact:
- Adoption and task completion speed depend on clarity and feedback quality.

Root issues:
- Governance is discoverable in multiple places with inconsistent readiness.
- Loading/error/empty states vary by module and can feel unreliable.
- Some text rendering indicates encoding issues (for example mojibake bullet/arrow characters).

Actions:
- Standardize UX states (loading, success, partial failure, retry) in shared components.
- Add guided workflow: draft changes -> request approval -> review -> publish summary.
- Fix encoding inconsistencies and tighten copy.
- Run accessibility pass: keyboard nav, focus traps, ARIA labels, contrast, screen-reader intent.

Effort:
- 2 to 4 weeks (can run in parallel with workstream 1)

### 4) Performance and Reliability (Major)
Impact:
- Large token systems and real-time collaboration need predictable performance.

Root issues:
- Heavy pages with many lazy modules and broad state updates.
- Potential repeated token scans and non-virtualized list rendering.
- Inconsistent observability around p95 UI actions.

Actions:
- Add list virtualization for large token/audit views.
- Memoize expensive token analyses and diff generation.
- Add lightweight performance instrumentation (load, interaction, approval actions).
- Add smoke tests for core governance/token flows.

Effort:
- 2 to 3 weeks

### 5) Security and Compliance Hardening (Major)
Impact:
- Governance features require strong trust and least-privilege behavior.

Root issues:
- Client has fallback Supabase URL/key defaults, which can hide environment misconfiguration.
- Role enforcement is fragmented between UI assumptions and backend policy expectations.

Actions:
- Remove production fallbacks for Supabase credentials; fail fast in misconfigured environments.
- Centralize role checks in typed policy helpers (client + edge functions + DB policies).
- Add immutable audit log policy checks and publish action authorization tests.

Effort:
- 1 to 2 weeks

### 6) Integrations and Ecosystem Value (Major)
Impact:
- Competitive parity and differentiation require seamless external workflows.

Root issues:
- Integration points exist but governance-aware sync/publish flows are not unified.

Actions:
- Figma: map approval status to token sync pipeline and conflict handling.
- Storybook: auto-generate token changelog and visual review bundles on publish.
- GitHub/Git: open PRs containing approved token diffs and release notes.

Effort:
- 3 to 6 weeks (phased)

## Competitive Comparison and Differentiation
- Figma:
  - Strong collaboration and comments; weaker native token governance depth.
  - Opportunity: approval policy engine + audit-grade token lifecycle.
- Storybook:
  - Strong component review/testing workflows.
  - Opportunity: connect token approvals directly to component visual regression checks.
- Tokens Studio / Specify:
  - Strong token management/sync.
  - Opportunity: richer multi-role approvals, compliance reports, and publish controls in one product.

## Suggested Delivery Plan

### Phase 0 (Week 1)
- Finalize architecture decision record for governance + token persistence.
- Resolve schema drift inventory and migration strategy.
- Define metrics dashboard schema.

### Phase 1 (Weeks 2-4)
- Implement `useApprovals` and unify governance UI.
- Add end-to-end approval flow tests.
- Ship role-aware actions and audit trail completeness.

### Phase 2 (Weeks 4-7)
- Start token data model migration with compatibility layer.
- Standardize UX states and accessibility fixes across governance/token modules.
- Add performance instrumentation and baseline reports.

### Phase 3 (Weeks 7-10)
- Launch integration automations (Figma/Storybook/Git publish hooks).
- Add advanced governance (multi-approver rules, SLA timers, escalation).
- Roll out productivity analytics and adoption experiments.

## Success Metrics

### Adoption
- Weekly active teams using governance tab
- Percentage of design systems with at least one approval request per week
- Approval workflow activation rate by workspace

### Productivity
- Median time from draft change to approval
- Median time from approval to publish/export
- Reduction in manual review loops per token change

### Quality and Reliability
- Rollback rate after publish
- Accessibility defect rate per release
- p95 load/interact latency for token and governance views

### Governance and Compliance
- Percentage of token changes that go through approval
- Audit log completeness score (actor, reason, diff, timestamp present)
- Unauthorized action rejection rate (expected policy enforcement)

## Immediate Next Actions
1. [x] Implement real `useApprovals` data layer and remove stub behavior.
2. [x] Decide and document single governance entry point in UX.
3. [x] Create a migration cleanup plan to eliminate overlapping schema definitions. See `docs/MigrationCleanupPlan.md`.
4. [x] Add KPI collection for approval lead time and publish throughput. See `docs/GovernanceKpiInstrumentation.md`.

## Progress Update (2026-02-18)
- `src/hooks/useApprovals.ts` now uses live Supabase reads/writes, request lifecycle transitions, token publish/reject application, realtime refresh, and audit/analytics hooks.
- `src/components/ApprovalWorkflow.tsx` now uses the same governance surface (`GovernanceDashboard`) used in token management, reducing workflow fragmentation.
- Governance KPI events are instrumented for request creation, publish, and rejection.
- Governance analytics schema/policy drift is reconciled in `supabase/migrations/20260218190000_governance_analytics_reconciliation.sql`.
- KPI and SLA views are now available for PM/leadership reporting.
- Supabase client now fails fast when required env vars are missing (no production fallback credentials).
