-- Add versioning and publishing status to design_systems
ALTER TABLE public.design_systems 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS live_version_id UUID,
ADD COLUMN IF NOT EXISTS version_number TEXT DEFAULT '0.1.0';

-- Create Audit Logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, PUBLISH
    entity_type TEXT NOT NULL, -- TOKEN, BRAND, SYSTEM
    entity_id TEXT, -- e.g., "colors.primary"
    old_value JSONB,
    new_value JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    summary TEXT
);

-- RLS for Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs for design systems they have access to" 
ON public.audit_logs FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.design_systems ds 
        WHERE ds.id = audit_logs.design_system_id 
        AND ds.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert audit logs for design systems they have access to"
ON public.audit_logs FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.design_systems ds 
        WHERE ds.id = audit_logs.design_system_id 
        AND ds.user_id = auth.uid()
    )
);

-- Create Approval Requests table
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    description TEXT,
    author_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Approval Requests
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approval requests for their design systems" 
ON public.approval_requests FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.design_systems ds 
        WHERE ds.id = approval_requests.design_system_id 
        AND ds.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert approval requests"
ON public.approval_requests FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.design_systems ds 
        WHERE ds.id = approval_requests.design_system_id 
        AND ds.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update approval requests"
ON public.approval_requests FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.design_systems ds 
        WHERE ds.id = approval_requests.design_system_id 
        AND ds.user_id = auth.uid()
    )
);

-- Create Approval Changes table (details for a request)
CREATE TABLE IF NOT EXISTS public.approval_changes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    approval_request_id UUID REFERENCES public.approval_requests(id) ON DELETE CASCADE,
    token_path TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    change_type TEXT NOT NULL -- UPDATE, CREATE, DELETE
);

-- RLS for Approval Changes
ALTER TABLE public.approval_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approval changes" 
ON public.approval_changes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.approval_requests ar
        JOIN public.design_systems ds ON ds.id = ar.design_system_id
        WHERE ar.id = approval_changes.approval_request_id 
        AND ds.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert approval changes"
ON public.approval_changes FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.approval_requests ar
        JOIN public.design_systems ds ON ds.id = ar.design_system_id
        WHERE ar.id = approval_changes.approval_request_id 
        AND ds.user_id = auth.uid()
    )
);
