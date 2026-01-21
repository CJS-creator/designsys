-- Migration for Audit Logging (Phase 2.2)

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, PUBLISH, INVITE
  entity_type TEXT NOT NULL, -- TOKEN, PAGE, VERSION, TEAM
  entity_id TEXT,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs
CREATE POLICY "Users can view audit logs for accessible design systems"
ON public.audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.audit_logs.design_system_id
    AND public.design_systems.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE public.user_roles.design_system_id = public.audit_logs.design_system_id
    AND public.user_roles.user_id = auth.uid()
  )
);

-- Function to record audit log
CREATE OR REPLACE FUNCTION public.record_audit_log(
  p_design_system_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  l_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    design_system_id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_value,
    new_value,
    metadata
  ) VALUES (
    p_design_system_id,
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_old_value,
    p_new_value,
    p_metadata
  ) RETURNING id INTO l_id;
  
  RETURN l_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
