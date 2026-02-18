# Governance KPI Instrumentation

## Goal
Track approval workflow adoption and productivity with minimal friction.

## Implemented Events
The frontend now emits governance analytics events from `src/hooks/useApprovals.ts` via `trackEvent`:

- `approval_request_created`
- `approval_request_published`
- `approval_request_rejected`

Event types are declared in `src/lib/analytics.ts`.

## Event Payloads

### `approval_request_created`
- `request_id`
- `change_count`

### `approval_request_published`
- `request_id`
- `change_count`
- `lead_time_ms` (time from request creation to publish)

### `approval_request_rejected`
- `request_id`
- `change_count`
- `lead_time_ms` (time from request creation to rejection)

## Core KPIs

1. Workflow Activation
- Definition: unique design systems with at least one `approval_request_created` per week.

2. Approval Throughput
- Definition: count of `approval_request_published` per week.

3. Median Approval Lead Time
- Definition: median `lead_time_ms` for published requests over rolling 28 days.

4. Rejection Rate
- Definition: rejected requests / total decided requests (`published + rejected`).

## Suggested SQL Sketches

```sql
-- Weekly activation (per design system)
select date_trunc('week', created_at) as week_start,
       count(distinct design_system_id) as active_design_systems
from analytics_events
where event_type = 'approval_request_created'
group by 1
order by 1 desc;
```

```sql
-- Median lead time for published requests (hours)
select percentile_cont(0.5) within group (order by (metadata->>'lead_time_ms')::numeric) / 3600000 as median_hours
from analytics_events
where event_type = 'approval_request_published'
  and created_at >= now() - interval '28 days';
```

## Closed in This Pass
- Added reconciliation migration `supabase/migrations/20260218190000_governance_analytics_reconciliation.sql`:
  - ensures `analytics_events` exists
  - normalizes payload column to `metadata`
  - adds insert/select RLS policies for governance telemetry
  - adds indexes for event queries
- Added SQL KPI views for PM/design leadership reporting:
  - `public.governance_kpi_weekly_activation`
  - `public.governance_kpi_weekly_throughput`
  - `public.governance_kpi_median_lead_time_28d`
  - `public.governance_kpi_rejection_rate_28d`
- Added SLA monitoring view:
  - `public.governance_sla_stale_requests` (pending review for more than 72 hours)

## Acceptance Criteria
- Events are emitted on create/publish/reject paths.
- KPI views return non-null data in staging.
- PM dashboard can consume weekly activation, throughput, lead time, rejection rate, and stale SLA queues.
