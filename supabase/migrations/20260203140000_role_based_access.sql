-- Create role enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('owner', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    design_system_id UUID NOT NULL REFERENCES public.design_systems(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, design_system_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _design_system_id UUID, _role app_role)
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

-- RLS Policies
DROP POLICY IF EXISTS "Owners can manage roles" ON public.user_roles;
CREATE POLICY "Owners can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
    public.has_role(auth.uid(), design_system_id, 'owner')
);

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Automatically assign 'owner' role when creating a design system
-- function to trigger on design_system creation
CREATE OR REPLACE FUNCTION public.handle_new_design_system() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, design_system_id, role)
  VALUES (auth.uid(), NEW.id, 'owner');
  RETURN NEW;
END;
$$;

-- Trigger
DROP TRIGGER IF EXISTS on_design_system_created ON public.design_systems;
CREATE TRIGGER on_design_system_created
  AFTER INSERT ON public.design_systems
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_design_system();
