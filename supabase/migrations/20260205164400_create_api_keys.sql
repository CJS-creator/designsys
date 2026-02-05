-- Create api_keys table
create table "public"."api_keys" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null references auth.users(id) on delete cascade,
    "key_hash" text not null,
    "name" text not null,
    "last_used_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone,
    primary key ("id"),
    unique ("key_hash")
);

-- Enable Row Level Security
alter table "public"."api_keys" enable row level security;

-- Create policies
create policy "Users can view their own API keys"
    on "public"."api_keys"
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own API keys"
    on "public"."api_keys"
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can delete their own API keys"
    on "public"."api_keys"
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create index on key_hash for faster lookups during API calls
create index api_keys_key_hash_idx on "public"."api_keys" (key_hash);

-- Create index on user_id for faster dashboard lookups
create index api_keys_user_id_idx on "public"."api_keys" (user_id);
