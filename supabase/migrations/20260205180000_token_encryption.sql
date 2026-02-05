-- Enable pgcrypto extension for encryption functions
create extension if not exists pgcrypto;

-- 1. Git Connections: Add encrypted column for GitHub PAT
alter table public.git_connections
add column if not exists encrypted_access_token text;

-- Make plaintext access_token nullable (it likely is already, but ensuring it)
alter table public.git_connections
alter column access_token drop not null;

-- 2. Figma Connections: Add encrypted column for Figma PAT
alter table public.figma_connections
add column if not exists encrypted_figma_token text;

-- Make plaintext figma_token nullable (it likely is already)
alter table public.figma_connections
alter column figma_token drop not null;

-- Comments
comment on column public.git_connections.encrypted_access_token is 'Base64 encoded result of pgp_sym_encrypt(token)';
comment on column public.figma_connections.encrypted_figma_token is 'Base64 encoded result of pgp_sym_encrypt(token)';
