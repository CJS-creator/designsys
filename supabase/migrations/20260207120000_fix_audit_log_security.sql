-- Fix for Issue #21: SECURITY DEFINER Function Without Constraints
-- This migration replaces the record_audit_log function with one that includes proper authorization checks.

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
  auth_user_id UUID;
BEGIN
  -- Get current user ID
  auth_user_id := auth.uid();

  -- CRITICAL SECURITY CHECK: Ensure user has access to the design system
  IF NOT EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE id = p_design_system_id AND user_id = auth_user_id
  ) AND NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE design_system_id = p_design_system_id AND user_id = auth_user_id
  ) THEN
    RAISE EXCEPTION 'Unauthorized: User % does not have access to design system %', auth_user_id, p_design_system_id;
  END IF;

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
    auth_user_id,
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
