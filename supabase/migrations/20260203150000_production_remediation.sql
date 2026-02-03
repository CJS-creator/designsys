-- Migration: Production Readiness Hardening
-- Addresses missing tables and RLS gaps from Phase 10 Audit

-- 1. Approval Requests (Phase 6.3/10.1)
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES auth.users(id),
  token_path TEXT NOT NULL,
  old_value JSONB,
  proposed_value JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approval requests for their systems"
ON public.approval_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.approval_requests.design_system_id
    AND public.design_systems.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE public.user_roles.design_system_id = public.approval_requests.design_system_id
    AND public.user_roles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage approval requests for their systems"
ON public.approval_requests FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.approval_requests.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- 2. Design System Webhooks (Phase 6.2/10.1)
CREATE TABLE IF NOT EXISTS public.design_system_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret TEXT,
  events TEXT[] DEFAULT '{tokens.updated}',
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.design_system_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their webhooks"
ON public.design_system_webhooks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.design_system_webhooks.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- 3. Triggers for Timestamp Updates
CREATE TRIGGER update_approval_requests_updated_at
BEFORE UPDATE ON public.approval_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_design_system_webhooks_updated_at
BEFORE UPDATE ON public.design_system_webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Ensure Token Management references are valid
-- (Already covered in 20260121133500_advanced_tokens.sql)

-- 5. Security: Ensure RLS is enabled on all critical tables
ALTER TABLE IF EXISTS public.marketplace_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.export_templates ENABLE ROW LEVEL SECURITY;
