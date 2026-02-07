-- Migration for Advanced Governance (Draft/Live State)

-- 1. Add staging columns to design_tokens
ALTER TABLE public.design_tokens 
ADD COLUMN IF NOT EXISTS staging_value JSONB,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('synced', 'changed')) DEFAULT 'synced';

-- 2. Backfill staging_value with current value for existing tokens
UPDATE public.design_tokens 
SET staging_value = value, status = 'synced' 
WHERE staging_value IS NULL;

-- 3. Create function to publish a specific token (promote staging to live)
CREATE OR REPLACE FUNCTION public.publish_token(p_token_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.design_tokens
  SET value = staging_value, status = 'synced', updated_at = now()
  WHERE id = p_token_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function to publish all tokens in a design system
CREATE OR REPLACE FUNCTION public.publish_design_system_tokens(p_design_system_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.design_tokens
  SET value = staging_value, status = 'synced', updated_at = now()
  WHERE design_system_id = p_design_system_id AND status = 'changed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
