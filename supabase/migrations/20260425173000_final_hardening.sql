-- Hardening Migration: Constraints, Indices, and RLS refinement
-- Phase 2.3 & 3.4 of the Hardening Plan

-- 1. Ensure design_tokens has relational integrity constraints
ALTER TABLE public.design_tokens 
DROP CONSTRAINT IF EXISTS design_tokens_path_check;

ALTER TABLE public.design_tokens 
ADD CONSTRAINT design_tokens_path_check 
CHECK (path ~ '^[a-zA-Z0-9._-]+$');

-- 2. Performance Indices
CREATE INDEX IF NOT EXISTS idx_design_tokens_ds_id_path 
ON public.design_tokens (design_system_id, path);

CREATE INDEX IF NOT EXISTS idx_design_tokens_ds_id_type 
ON public.design_tokens (design_system_id, type);

CREATE INDEX IF NOT EXISTS idx_design_systems_user_id 
ON public.design_systems (user_id);

-- 3. RLS Refinement for Design Systems (Ensuring INSERT is covered)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'design_systems' AND policyname = 'Users can create design systems'
    ) THEN
        CREATE POLICY "Users can create design systems"
        ON public.design_systems FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- 4. Secure the design_system_data JSONB structure
-- We add a check to ensure it at least has a name
ALTER TABLE public.design_systems
DROP CONSTRAINT IF EXISTS design_systems_data_name_check;

ALTER TABLE public.design_systems
ADD CONSTRAINT design_systems_data_name_check
CHECK (design_system_data ? 'name');

-- 5. Audit Log Security Refinement
-- Ensure users can only insert their own audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'audit_logs' AND policyname = 'Users can insert their own audit logs'
    ) THEN
        CREATE POLICY "Users can insert their own audit logs"
        ON public.audit_logs FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- 6. Function for better role checking (if not exists)
CREATE OR REPLACE FUNCTION public.is_ds_owner(_user_id UUID, _ds_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE id = _ds_id AND user_id = _user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;
