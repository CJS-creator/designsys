-- Migration: Add sort_order to design_tokens for reordering support
ALTER TABLE public.design_tokens ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update existing tokens to have a default order based on their creation time
WITH ordered_tokens AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY design_system_id ORDER BY created_at) as row_num
  FROM public.design_tokens
)
UPDATE public.design_tokens
SET sort_order = ordered_tokens.row_num
FROM ordered_tokens
WHERE public.design_tokens.id = ordered_tokens.id;
