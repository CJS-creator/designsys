-- API Keys for Public Access
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_system_id UUID REFERENCES public.design_systems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  key_hash TEXT NOT NULL, -- Storing hash, not raw key for security
  name TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{read:tokens}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own api keys"
  ON public.api_keys FOR ALL
  USING (auth.uid() = user_id);

-- Index for fast lookup during API calls
CREATE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);
