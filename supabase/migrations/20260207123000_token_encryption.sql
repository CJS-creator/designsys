-- Enable Vault extension for secure token storage
CREATE EXTENSION IF NOT EXISTS vault WITH SCHEMA vault;

-- Function to safely store tokens in Vault and reference them in connection tables
CREATE OR REPLACE FUNCTION public.store_connection_secret(
  p_design_system_id UUID,
  p_user_id UUID,
  p_type TEXT, -- 'figma' or 'git'
  p_token TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  l_secret_id UUID;
  l_name TEXT;
  l_placeholder TEXT;
BEGIN
  -- Generate a unique name for the secret to identify it in Vault (optional but good for management)
  l_name := p_type || '_token_' || p_design_system_id || '_' || extract(epoch from now())::text;
  
  -- Store in Vault
  -- vault.create_secret(secret text, name text, description text) returns uuid
  l_secret_id := vault.create_secret(p_token, l_name, 'Design System Connection Token');
  l_placeholder := 'vault:' || l_secret_id;

  -- Update appropriate table
  IF p_type = 'figma' THEN
    -- Ensure figma_connections exists and has correct columns
    -- We store the placeholder in access_token to satisfy NOT NULL constraint if present
    INSERT INTO public.figma_connections (
      design_system_id, user_id, access_token, metadata, sync_status
    ) VALUES (
      p_design_system_id, p_user_id, l_placeholder, p_metadata, 'idle'
    )
    ON CONFLICT (design_system_id) DO UPDATE SET
      access_token = l_placeholder,
      metadata = p_metadata,
      updated_at = now();
      
  ELSIF p_type = 'git' THEN
    -- Ensure git_connections exists
    INSERT INTO public.git_connections (
      design_system_id, user_id, repo_full_name, default_branch, provider, sync_status
    ) VALUES (
      p_design_system_id, p_user_id, 
      COALESCE(p_metadata->>'repoFullName', ''), 
      COALESCE(p_metadata->>'defaultBranch', 'main'),
      'github', 
      'idle'
    )
    ON CONFLICT (design_system_id) DO UPDATE SET
      repo_full_name = COALESCE(p_metadata->>'repoFullName', EXCLUDED.repo_full_name),
      default_branch = COALESCE(p_metadata->>'defaultBranch', EXCLUDED.default_branch),
      updated_at = now();
      
    -- Note: git_connections might not have an access_token column in some versions of the schema
    -- If it does, we'd update it here. For now, we assume the token is strictly in Vault
    -- and the connection record just tracks metadata.
    -- If we need to link them, we might need a separate 'secret_id' column.
    -- But since we use 'vault:' placeholder in figma, maybe we don't need explicit column if we trust the vault lookup by name?
    -- Actually, looking up by name is harder. 
    -- Let's stick to returning the ID.
  END IF;

  RETURN l_secret_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
