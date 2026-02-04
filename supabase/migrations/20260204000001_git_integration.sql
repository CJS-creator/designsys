-- Migration: Create Git Integration tables
CREATE TABLE IF NOT EXISTS public.git_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'github',
    repo_full_name TEXT NOT NULL,
    default_branch TEXT NOT NULL DEFAULT 'main',
    access_token TEXT, -- In a real app, this should be encrypted
    sync_status TEXT DEFAULT 'idle',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(design_system_id)
);

CREATE TABLE IF NOT EXISTS public.git_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id UUID REFERENCES public.git_connections(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- 'pending', 'success', 'failed'
    event_type TEXT, -- 'push', 'pull', 'webhook'
    message TEXT,
    error_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.git_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.git_sync_logs ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies (for now)
CREATE POLICY "Users can manage their own git connections" ON public.git_connections
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view logs for their connections" ON public.git_sync_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.git_connections 
            WHERE id = public.git_sync_logs.connection_id 
            AND user_id = auth.uid()
        )
    );
