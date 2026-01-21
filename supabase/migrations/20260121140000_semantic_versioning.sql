-- Migration for Semantic Versioning

-- Versions table
CREATE TABLE IF NOT EXISTS public.design_system_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL, -- SemVer format (e.g., 1.0.0)
  name TEXT, -- Optional name for the version
  description TEXT, -- Release notes
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  parent_version_id UUID REFERENCES public.design_system_versions(id),
  snapshot JSONB NOT NULL, -- Complete state of tokens at this version
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(design_system_id, version_number)
);

-- Changelog / Diffs table
CREATE TABLE IF NOT EXISTS public.version_changelog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES public.design_system_versions(id) ON DELETE CASCADE,
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- ADDED, MODIFIED, DELETED
  token_path TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.design_system_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.version_changelog ENABLE ROW LEVEL SECURITY;

-- Policies for design_system_versions
CREATE POLICY "Users can view own design versions"
ON public.design_system_versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.design_system_versions.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own design versions"
ON public.design_system_versions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.design_system_versions.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- Policies for version_changelog
CREATE POLICY "Users can view own version changelog"
ON public.version_changelog FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.version_changelog.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- Trigger for timestamp updates
CREATE TRIGGER update_design_system_versions_updated_at
BEFORE UPDATE ON public.design_system_versions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
