
-- 1. Add sharing columns to design_systems
ALTER TABLE public.design_systems
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS share_id text UNIQUE;

-- 2. RLS: Allow anonymous SELECT on public design systems
CREATE POLICY "Anyone can view public designs"
  ON public.design_systems
  FOR SELECT
  TO anon
  USING (is_public = true);

-- 3. FK from user_roles.user_id to profiles.id for PostgREST join
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. updated_at trigger on design_systems
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.design_systems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Recreate the owner assignment trigger (it exists as function but trigger is missing)
DROP TRIGGER IF EXISTS trg_assign_owner_on_design_system_create ON public.design_systems;
CREATE TRIGGER trg_assign_owner_on_design_system_create
  AFTER INSERT ON public.design_systems
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_owner_on_design_system_create();

-- 6. Allow authenticated users to view profiles of team members (needed for join)
CREATE POLICY "Authenticated can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);
