DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='figma_connections') THEN
    DROP TRIGGER IF EXISTS set_figma_connections_updated_at ON public.figma_connections;
    CREATE TRIGGER set_figma_connections_updated_at
      BEFORE UPDATE ON public.figma_connections
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;