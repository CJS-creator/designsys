-- Recreate triggers that were dropped
-- 1. Auto-assign owner role on design_systems insert
DROP TRIGGER IF EXISTS trg_assign_owner_on_design_system_create ON public.design_systems;
CREATE TRIGGER trg_assign_owner_on_design_system_create
AFTER INSERT ON public.design_systems
FOR EACH ROW
EXECUTE FUNCTION public.assign_owner_on_design_system_create();

-- 2. Auto-update updated_at on design_systems
DROP TRIGGER IF EXISTS set_design_systems_updated_at ON public.design_systems;
CREATE TRIGGER set_design_systems_updated_at
BEFORE UPDATE ON public.design_systems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Auto-update updated_at on profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Auto-update updated_at on user_roles
DROP TRIGGER IF EXISTS set_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER set_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Auto-update updated_at on approval_requests
DROP TRIGGER IF EXISTS set_approval_requests_updated_at ON public.approval_requests;
CREATE TRIGGER set_approval_requests_updated_at
BEFORE UPDATE ON public.approval_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Auto-update updated_at on api_keys
DROP TRIGGER IF EXISTS set_api_keys_updated_at ON public.api_keys;
CREATE TRIGGER set_api_keys_updated_at
BEFORE UPDATE ON public.api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Auto-update updated_at on git_connections
DROP TRIGGER IF EXISTS set_git_connections_updated_at ON public.git_connections;
CREATE TRIGGER set_git_connections_updated_at
BEFORE UPDATE ON public.git_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Auto-create profile on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Phase 3: Create design_tokens table for granular token management
CREATE TABLE IF NOT EXISTS public.design_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  ref TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (design_system_id, path)
);

CREATE INDEX IF NOT EXISTS idx_design_tokens_design_system_id ON public.design_tokens(design_system_id);
CREATE INDEX IF NOT EXISTS idx_design_tokens_path ON public.design_tokens(path);
CREATE INDEX IF NOT EXISTS idx_design_tokens_status ON public.design_tokens(status);

ALTER TABLE public.design_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view tokens"
ON public.design_tokens FOR SELECT
TO authenticated
USING (public.is_member(auth.uid(), design_system_id));

CREATE POLICY "Members can insert tokens"
ON public.design_tokens FOR INSERT
TO authenticated
WITH CHECK (public.is_member(auth.uid(), design_system_id) AND auth.uid() = created_by);

CREATE POLICY "Members can update tokens"
ON public.design_tokens FOR UPDATE
TO authenticated
USING (public.is_member(auth.uid(), design_system_id));

CREATE POLICY "Owners and editors can delete tokens"
ON public.design_tokens FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), design_system_id, 'owner'::app_role) OR
  public.has_role(auth.uid(), design_system_id, 'editor'::app_role)
);

CREATE TRIGGER set_design_tokens_updated_at
BEFORE UPDATE ON public.design_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER TABLE public.design_tokens REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.design_tokens;