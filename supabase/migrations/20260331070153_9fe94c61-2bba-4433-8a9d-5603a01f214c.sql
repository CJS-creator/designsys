
-- Add updated_at trigger on design_systems
CREATE OR REPLACE TRIGGER set_design_systems_updated_at
  BEFORE UPDATE ON public.design_systems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add owner assignment trigger on design_systems insert
CREATE OR REPLACE TRIGGER trg_assign_owner_on_design_system_create
  AFTER INSERT ON public.design_systems
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_owner_on_design_system_create();
