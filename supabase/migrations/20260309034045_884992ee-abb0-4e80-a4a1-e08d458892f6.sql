
-- =====================================================
-- Phase 1: DesignForge Production Database Foundation
-- Creates 9 missing tables, enums, triggers, and RLS
-- =====================================================

-- 1. Create enums
CREATE TYPE public.app_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE public.approval_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'published');

-- 2. Profiles table (auto-created on signup)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
        NEW.raw_user_meta_data ->> 'avatar_url'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
    role public.app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, design_system_id)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _design_system_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id
          AND design_system_id = _design_system_id
          AND role = _role
    );
$$;

CREATE OR REPLACE FUNCTION public.is_member(_user_id UUID, _design_system_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id
          AND design_system_id = _design_system_id
    );
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owners can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), design_system_id, 'owner'));
CREATE POLICY "Users can insert own owner role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND role = 'owner');

-- 4. Approval requests
CREATE TABLE public.approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status public.approval_status NOT NULL DEFAULT 'draft',
    reviewed_at TIMESTAMPTZ,
    review_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view approval requests" ON public.approval_requests FOR SELECT TO authenticated USING (public.is_member(auth.uid(), design_system_id));
CREATE POLICY "Members can create approval requests" ON public.approval_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id AND public.is_member(auth.uid(), design_system_id));
CREATE POLICY "Owners/editors can update approval requests" ON public.approval_requests FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), design_system_id, 'owner') OR auth.uid() = requester_id
);

-- 5. Approval changes
CREATE TABLE public.approval_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_request_id UUID NOT NULL REFERENCES public.approval_requests(id) ON DELETE CASCADE,
    token_path TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_type TEXT NOT NULL DEFAULT 'modified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.approval_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view approval changes" ON public.approval_changes FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.approval_requests ar WHERE ar.id = approval_request_id AND public.is_member(auth.uid(), ar.design_system_id))
);
CREATE POLICY "Requester can insert approval changes" ON public.approval_changes FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.approval_requests ar WHERE ar.id = approval_request_id AND ar.requester_id = auth.uid())
);

-- 6. API keys
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    key_prefix TEXT,
    scopes TEXT[] NOT NULL DEFAULT '{read:tokens}',
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own API keys" ON public.api_keys FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own API keys" ON public.api_keys FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own API keys" ON public.api_keys FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own API keys" ON public.api_keys FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 7. Audit logs (append-only)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (
    public.is_member(auth.uid(), design_system_id)
);
CREATE POLICY "Authenticated can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 8. Analytics events
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" ON public.analytics_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 9. Design system versions
CREATE TABLE public.design_system_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    name TEXT NOT NULL,
    description TEXT,
    snapshot_data JSONB NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (design_system_id, version_number)
);
ALTER TABLE public.design_system_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view versions" ON public.design_system_versions FOR SELECT TO authenticated USING (
    public.is_member(auth.uid(), design_system_id)
);
CREATE POLICY "Members can create versions" ON public.design_system_versions FOR INSERT TO authenticated WITH CHECK (
    public.is_member(auth.uid(), design_system_id) AND auth.uid() = created_by
);

-- 10. Version changelog
CREATE TABLE public.version_changelog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES public.design_system_versions(id) ON DELETE CASCADE,
    token_path TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_type TEXT NOT NULL DEFAULT 'modified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.version_changelog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view changelog" ON public.version_changelog FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.design_system_versions v WHERE v.id = version_id AND public.is_member(auth.uid(), v.design_system_id))
);
CREATE POLICY "Members can insert changelog" ON public.version_changelog FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.design_system_versions v WHERE v.id = version_id AND public.is_member(auth.uid(), v.design_system_id))
);

-- =====================================================
-- Apply updated_at triggers to all relevant tables
-- =====================================================
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_approval_requests_updated_at BEFORE UPDATE ON public.approval_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
