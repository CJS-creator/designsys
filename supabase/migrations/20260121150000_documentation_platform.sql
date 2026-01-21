-- Migration for Interactive Documentation Platform

-- Documentation Pages table
CREATE TABLE IF NOT EXISTS public.documentation_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.documentation_pages(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '[]', -- Block-based content (Tiptap format)
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(design_system_id, slug)
);

-- Documentation Assets table (images, etc. used in docs)
CREATE TABLE IF NOT EXISTS public.documentation_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.documentation_pages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documentation_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_assets ENABLE ROW LEVEL SECURITY;

-- Policies for documentation_pages
CREATE POLICY "Users can view own documentation pages"
ON public.documentation_pages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.documentation_pages.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage own documentation pages"
ON public.documentation_pages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE public.design_systems.id = public.documentation_pages.design_system_id
    AND public.design_systems.user_id = auth.uid()
  )
);

-- Trigger for timestamp updates
CREATE TRIGGER update_documentation_pages_updated_at
BEFORE UPDATE ON public.documentation_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
