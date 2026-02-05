-- Migration to add Figma OAuth columns
ALTER TABLE public.figma_connections
ADD COLUMN IF NOT EXISTS figma_token TEXT, -- Encrypted Figma User Token
ADD COLUMN IF NOT EXISTS figma_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB;
