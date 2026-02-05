-- Enable Roles and Approvals Migration

-- 1. Create User Roles Table
CREATE TYPE public.app_role AS ENUM ('owner', 'editor', 'viewer');

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
    role public.app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, design_system_id)
);

-- Enable RLS for user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to check role (Security Definer to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _design_system_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND design_system_id = _design_system_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Owners can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), design_system_id, 'owner')
);

-- 2. Create Approval Workflows Tables

CREATE TYPE public.approval_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED');

CREATE TABLE IF NOT EXISTS public.approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    description TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    status public.approval_status NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.approval_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_request_id UUID NOT NULL REFERENCES public.approval_requests(id) ON DELETE CASCADE,
    token_path TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    change_type TEXT NOT NULL, -- 'color', 'spacing', etc.
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_changes ENABLE ROW LEVEL SECURITY;

-- Policies for Approval Requests
CREATE POLICY "View requests for design system"
ON public.approval_requests FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
          AND design_system_id = public.approval_requests.design_system_id
    )
);

CREATE POLICY "Create requests (Editors+)"
ON public.approval_requests FOR INSERT
TO authenticated
WITH CHECK (
    public.has_role(auth.uid(), design_system_id, 'owner') OR
    public.has_role(auth.uid(), design_system_id, 'editor')
);

CREATE POLICY "Update requests (Editors+)"
ON public.approval_requests FOR UPDATE
TO authenticated
USING (
    public.has_role(auth.uid(), design_system_id, 'owner') OR
    public.has_role(auth.uid(), design_system_id, 'editor')
);

-- Policies for Approval Changes
CREATE POLICY "View changes"
ON public.approval_changes FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.approval_requests
        WHERE id = public.approval_changes.approval_request_id
        AND EXISTS (
             SELECT 1 FROM public.user_roles
             WHERE user_id = auth.uid()
               AND design_system_id = public.approval_requests.design_system_id
        )
    )
);

CREATE POLICY "Manage changes (Editors+)"
ON public.approval_changes FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.approval_requests
        WHERE id = public.approval_changes.approval_request_id
        AND (
            public.has_role(auth.uid(), design_system_id, 'owner') OR
            public.has_role(auth.uid(), design_system_id, 'editor')
        )
    )
);

-- Indexes for performance
CREATE INDEX idx_user_roles_user_ds ON public.user_roles(user_id, design_system_id);
CREATE INDEX idx_approval_requests_ds ON public.approval_requests(design_system_id);
CREATE INDEX idx_approval_changes_request ON public.approval_changes(approval_request_id);
