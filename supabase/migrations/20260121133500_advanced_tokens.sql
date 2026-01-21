-- Migration for Advanced Design Token Management

-- Token groups for organization
CREATE TABLE IF NOT EXISTS public.token_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.token_groups(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for token_groups
ALTER TABLE public.token_groups ENABLE ROW LEVEL SECURITY;

-- Policies for token_groups
CREATE POLICY "Users can view own token groups"
ON public.token_groups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.token_groups.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own token groups"
ON public.token_groups FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.token_groups.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- Token definitions table with full type support
CREATE TABLE IF NOT EXISTS public.design_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.token_groups(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  path TEXT NOT NULL, -- e.g., "color.primary.500"
  token_type TEXT NOT NULL, -- color, spacing, gradient, composition, etc.
  value JSONB NOT NULL, -- Flexible structure per type
  description TEXT,
  extensions JSONB, -- Custom metadata
  is_alias BOOLEAN DEFAULT false,
  alias_path TEXT, -- Reference to another token
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(design_system_id, path)
);

-- Enable RLS for design_tokens
ALTER TABLE public.design_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for design_tokens
CREATE POLICY "Users can view own design tokens"
ON public.design_tokens FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.design_tokens.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own design tokens"
ON public.design_tokens FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.design_tokens.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- Triggers for timestamp updates
CREATE TRIGGER update_token_groups_updated_at
BEFORE UPDATE ON public.token_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_design_tokens_updated_at
BEFORE UPDATE ON public.design_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
