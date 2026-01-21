-- Migration for Phase 3: AI & Multi-Brand (Weeks 25-48)

-- Brand Themes Table for Multi-Brand Architecture
CREATE TABLE IF NOT EXISTS public.brand_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  overrides JSONB NOT NULL DEFAULT '{}', -- Values that override base tokens
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics Events for Adoption Tracking
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- EXPORT, PAGE_VIEW, TOKEN_EDIT, VERSION_PUBLISH
  event_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for brand_themes
ALTER TABLE public.brand_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage brand themes for their design systems"
ON public.brand_themes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.brand_themes.design_system_id
    AND (
      public.design_systems.user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE public.user_roles.design_system_id = public.brand_themes.design_system_id
        AND public.user_roles.user_id = auth.uid()
        AND public.user_roles.role IN ('owner', 'editor')
      )
    )
  )
);

-- RLS for analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view analytics for their design systems"
ON public.analytics_events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.analytics_events.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);
