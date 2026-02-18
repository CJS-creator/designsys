-- Governance + Analytics reconciliation
-- Align analytics schema with runtime usage, close RLS gaps, and expose KPI views.

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'analytics_events'
      AND column_name = 'event_payload'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'analytics_events'
      AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.analytics_events RENAME COLUMN event_payload TO metadata;
  END IF;
END $$;

ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS metadata JSONB;
UPDATE public.analytics_events SET metadata = '{}'::jsonb WHERE metadata IS NULL;
ALTER TABLE public.analytics_events ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;
ALTER TABLE public.analytics_events ALTER COLUMN metadata SET NOT NULL;
ALTER TABLE public.analytics_events ALTER COLUMN user_id SET DEFAULT auth.uid();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'analytics_events'
      AND column_name = 'event_payload'
  ) THEN
    UPDATE public.analytics_events
    SET metadata = COALESCE(metadata, event_payload, '{}'::jsonb)
    WHERE metadata IS NULL OR metadata = '{}'::jsonb;

    ALTER TABLE public.analytics_events DROP COLUMN IF EXISTS event_payload;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_analytics_events_design_system_id
  ON public.analytics_events(design_system_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_design_system_created_at
  ON public.analytics_events(design_system_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type_created_at
  ON public.analytics_events(event_type, created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view analytics for their design systems" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can insert analytics for accessible design systems" ON public.analytics_events;

CREATE POLICY "Users can view analytics for their design systems"
ON public.analytics_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.design_systems ds
    WHERE ds.id = analytics_events.design_system_id
      AND (
        ds.user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.user_roles ur
          WHERE ur.design_system_id = analytics_events.design_system_id
            AND ur.user_id = auth.uid()
        )
      )
  )
);

CREATE POLICY "Users can insert analytics for accessible design systems"
ON public.analytics_events
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.design_systems ds
    WHERE ds.id = analytics_events.design_system_id
      AND (
        ds.user_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.user_roles ur
          WHERE ur.design_system_id = analytics_events.design_system_id
            AND ur.user_id = auth.uid()
        )
      )
  )
);

CREATE OR REPLACE VIEW public.governance_kpi_weekly_activation
WITH (security_invoker = true) AS
SELECT
  date_trunc('week', created_at) AS week_start,
  count(DISTINCT design_system_id) AS active_design_systems
FROM public.analytics_events
WHERE event_type = 'approval_request_created'
GROUP BY 1;

CREATE OR REPLACE VIEW public.governance_kpi_weekly_throughput
WITH (security_invoker = true) AS
SELECT
  date_trunc('week', created_at) AS week_start,
  count(*) AS published_requests
FROM public.analytics_events
WHERE event_type = 'approval_request_published'
GROUP BY 1;

CREATE OR REPLACE VIEW public.governance_kpi_median_lead_time_28d
WITH (security_invoker = true) AS
SELECT
  design_system_id,
  percentile_cont(0.5) WITHIN GROUP (
    ORDER BY (metadata->>'lead_time_ms')::numeric
  ) AS median_lead_time_ms
FROM public.analytics_events
WHERE event_type = 'approval_request_published'
  AND created_at >= now() - interval '28 days'
  AND COALESCE(metadata->>'lead_time_ms', '') ~ '^[0-9]+(\.[0-9]+)?$'
GROUP BY design_system_id;

CREATE OR REPLACE VIEW public.governance_kpi_rejection_rate_28d
WITH (security_invoker = true) AS
WITH counts AS (
  SELECT
    design_system_id,
    count(*) FILTER (WHERE event_type = 'approval_request_rejected') AS rejected_count,
    count(*) FILTER (WHERE event_type = 'approval_request_published') AS published_count
  FROM public.analytics_events
  WHERE event_type IN ('approval_request_rejected', 'approval_request_published')
    AND created_at >= now() - interval '28 days'
  GROUP BY design_system_id
)
SELECT
  design_system_id,
  rejected_count,
  published_count,
  CASE
    WHEN (rejected_count + published_count) = 0 THEN 0
    ELSE rejected_count::numeric / (rejected_count + published_count)
  END AS rejection_rate
FROM counts;

CREATE OR REPLACE VIEW public.governance_sla_stale_requests
WITH (security_invoker = true) AS
SELECT
  ar.id AS request_id,
  ar.design_system_id,
  ar.author_id,
  ar.version_number,
  ar.created_at,
  (now() - ar.created_at) AS pending_for
FROM public.approval_requests ar
WHERE ar.status = 'PENDING_REVIEW'
  AND ar.created_at <= now() - interval '72 hours';

GRANT SELECT ON public.governance_kpi_weekly_activation TO authenticated;
GRANT SELECT ON public.governance_kpi_weekly_throughput TO authenticated;
GRANT SELECT ON public.governance_kpi_median_lead_time_28d TO authenticated;
GRANT SELECT ON public.governance_kpi_rejection_rate_28d TO authenticated;
GRANT SELECT ON public.governance_sla_stale_requests TO authenticated;
