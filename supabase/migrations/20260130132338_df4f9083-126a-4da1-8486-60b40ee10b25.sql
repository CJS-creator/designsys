-- Create git_connections table for linking design systems to GitHub repos
CREATE TABLE public.git_connections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    provider TEXT NOT NULL DEFAULT 'github',
    repo_full_name TEXT NOT NULL,
    default_branch TEXT NOT NULL DEFAULT 'main',
    sync_status TEXT NOT NULL DEFAULT 'idle',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(design_system_id)
);

-- Enable RLS
ALTER TABLE public.git_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only manage their own git connections
CREATE POLICY "Users can view own git connections"
ON public.git_connections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own git connections"
ON public.git_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own git connections"
ON public.git_connections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own git connections"
ON public.git_connections FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_git_connections_updated_at
BEFORE UPDATE ON public.git_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();