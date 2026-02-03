-- Figma Sync Connections (Phase 10.4)
CREATE TABLE IF NOT EXISTS public.figma_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  figma_file_key TEXT,
  access_token TEXT NOT NULL,
  sync_status TEXT DEFAULT 'idle',
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(design_system_id)
);

-- RLS for figma_connections
ALTER TABLE public.figma_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own figma connections"
  ON public.figma_connections FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.design_system_id = figma_connections.design_system_id 
    AND user_roles.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own figma connections"
  ON public.figma_connections FOR ALL
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.design_system_id = figma_connections.design_system_id 
    AND user_roles.user_id = auth.uid() 
    AND role IN ('owner', 'editor')
  ));

-- Trigger for updated_at
CREATE TRIGGER set_figma_connections_updated_at
  BEFORE UPDATE ON public.figma_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
