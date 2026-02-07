-- Catch-up migration to create missing tables and ensure schema consistency
-- Based on types.ts definitions and missing tables report

-- 1. Token Groups
CREATE TABLE IF NOT EXISTS public.token_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  path TEXT NOT NULL,
  parent_id UUID REFERENCES public.token_groups(id) ON DELETE CASCADE,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(design_system_id, path)
);

-- 2. Design Tokens
CREATE TABLE IF NOT EXISTS public.design_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.token_groups(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  token_type TEXT NOT NULL,
  value JSONB NOT NULL,
  path TEXT NOT NULL,
  alias_path TEXT,
  is_alias BOOLEAN DEFAULT false,
  extensions JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(design_system_id, path)
);

-- 3. Brand Themes
CREATE TABLE IF NOT EXISTS public.brand_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  mode TEXT DEFAULT 'light',
  is_default BOOLEAN DEFAULT false,
  tokens_override JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. User Roles (RBAC)
CREATE TYPE public.app_role AS ENUM ('owner', 'editor', 'viewer');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, design_system_id)
);

-- 5. API Keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  scopes TEXT[],
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Approval Requests
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  version_number TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED')) DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Approval Changes
CREATE TABLE IF NOT EXISTS public.approval_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_request_id UUID REFERENCES public.approval_requests(id) ON DELETE CASCADE NOT NULL,
  token_path TEXT NOT NULL,
  change_type TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB
);

-- 8. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  summary TEXT,
  old_value JSONB,
  new_value JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- Enable RLS
ALTER TABLE public.token_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Simplified for remediation, aiming for owner-access)

-- Token Groups
CREATE POLICY "Users can view token groups for their design systems" ON public.token_groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.design_systems 
      WHERE design_systems.id = token_groups.design_system_id 
      AND design_systems.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.design_system_id = token_groups.design_system_id
      AND user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage token groups" ON public.token_groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.design_systems 
      WHERE design_systems.id = token_groups.design_system_id 
      AND design_systems.user_id = auth.uid()
    )
  );

-- Design Tokens
CREATE POLICY "Users can view tokens for their design systems" ON public.design_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.design_systems 
      WHERE design_systems.id = design_tokens.design_system_id 
      AND design_systems.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.design_system_id = design_tokens.design_system_id
      AND user_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage tokens" ON public.design_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.design_systems 
      WHERE design_systems.id = design_tokens.design_system_id 
      AND design_systems.user_id = auth.uid()
    )
  );

-- User Roles
CREATE POLICY "Users can view roles for their design systems" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.design_systems 
      WHERE design_systems.id = user_roles.design_system_id 
      AND design_systems.user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Owners can manage roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.design_systems 
      WHERE design_systems.id = user_roles.design_system_id 
      AND design_systems.user_id = auth.uid()
    )
  );

-- Audit Logs
CREATE POLICY "Users can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.design_systems 
      WHERE design_systems.id = audit_logs.design_system_id 
      AND design_systems.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.design_system_id = audit_logs.design_system_id
      AND user_roles.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_token_groups_updated_at BEFORE UPDATE ON public.token_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_design_tokens_updated_at BEFORE UPDATE ON public.design_tokens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_brand_themes_updated_at BEFORE UPDATE ON public.brand_themes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_approval_requests_updated_at BEFORE UPDATE ON public.approval_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
