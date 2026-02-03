-- Migration for Custom Export Templates
CREATE TABLE IF NOT EXISTS public.export_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template TEXT NOT NULL,
    extension TEXT NOT NULL DEFAULT 'json',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.export_templates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own templates"
ON public.export_templates
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.design_systems
    WHERE id = export_templates.design_system_id
    AND user_id = auth.uid()
));

-- Trigger for updated_at
-- Assuming update_updated_at_column() exists from previous migrations
CREATE TRIGGER update_export_templates_updated_at
BEFORE UPDATE ON public.export_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
