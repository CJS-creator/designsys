-- Migration for Collaboration & Governance (Phase 2)

-- 1. Git Code Connect (2.1)

-- Enum for providers
DO $$ BEGIN
    CREATE TYPE public.git_provider AS ENUM ('github', 'gitlab', 'bitbucket');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Git Connections table
CREATE TABLE IF NOT EXISTS public.git_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  provider public.git_provider NOT NULL DEFAULT 'github',
  repo_full_name TEXT NOT NULL,
  default_branch TEXT NOT NULL DEFAULT 'main',
  access_token TEXT, -- Encrypted via Vault or application layer
  installation_id TEXT, -- GitHub App specific
  config JSONB NOT NULL DEFAULT '{
    "base_path": "styles/tokens",
    "formats": ["json", "css", "dtcg"],
    "auto_pr": true,
    "commit_message": "chore: update design tokens [designforge]"
  }',
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending', -- idle, syncing, error
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(design_system_id)
);

-- Git Sync Logs for observability
CREATE TABLE IF NOT EXISTS public.git_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.git_connections(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- PUSH, PR_CREATED, WEBHOOK_RECEIVED
  status TEXT NOT NULL, -- success, failure
  payload JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RBAC (2.2)

-- Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, design_system_id)
);

-- Enable RLS
ALTER TABLE public.git_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.git_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies for git_connections
CREATE POLICY "Users can manage own git connections"
ON public.git_connections FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.git_connections.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- Policies for git_sync_logs
CREATE POLICY "Users can view own git sync logs"
ON public.git_sync_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.git_connections gc
    JOIN public.design_systems ds ON ds.id = gc.design_system_id
    WHERE gc.id = public.git_sync_logs.connection_id
    AND ds.user_id = auth.uid()
  )
);

-- Policies for user_roles
CREATE POLICY "Users can view roles for accessible design systems"
ON public.user_roles FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.user_roles.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- Trigger for timestamp updates
CREATE TRIGGER update_git_connections_updated_at
BEFORE UPDATE ON public.git_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
