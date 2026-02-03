-- Migration for Multi-Brand & Theme Mode Support

-- Create brand_themes table
CREATE TABLE IF NOT EXISTS public.brand_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mode TEXT DEFAULT 'light', -- 'light', 'dark', 'high-contrast'
  tokens_override JSONB DEFAULT '{}'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for brand_themes
ALTER TABLE public.brand_themes ENABLE ROW LEVEL SECURITY;

-- Policies for brand_themes
CREATE POLICY "Users can view own brand themes"
ON public.brand_themes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.brand_themes.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own brand themes"
ON public.brand_themes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.brand_themes.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- Trigger for timestamp updates
CREATE TRIGGER update_brand_themes_updated_at
BEFORE UPDATE ON public.brand_themes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
