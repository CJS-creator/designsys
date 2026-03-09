
-- Create trigger function to auto-assign owner role when a design system is created
CREATE OR REPLACE FUNCTION public.assign_owner_on_design_system_create()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, design_system_id, role)
    VALUES (NEW.user_id, NEW.id, 'owner');
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER trg_assign_owner_on_design_system_create
AFTER INSERT ON public.design_systems
FOR EACH ROW
EXECUTE FUNCTION public.assign_owner_on_design_system_create();
