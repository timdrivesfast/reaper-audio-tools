-- Rate limit for the sign-in and free download forms. Run once in Supabase.
create table if not exists public.email_sends (
  id bigint generated always as identity primary key,
  kind text not null,          -- 'signin' | 'free-license'
  email text not null,
  ip_hash text not null,       -- hashed, never the raw IP
  created_at timestamptz not null default now()
);
create index if not exists email_sends_email_idx on public.email_sends (kind, email, created_at);
create index if not exists email_sends_ip_idx on public.email_sends (ip_hash, created_at);
alter table public.email_sends enable row level security;
