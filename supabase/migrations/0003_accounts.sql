-- Update emails. Run once in Supabase: SQL Editor → New query → paste → Run.

-- One row per plugin version we've announced, so each release is emailed once.
create table if not exists public.release_notices (
  product text not null,
  version text not null,
  recipients int not null default 0,
  created_at timestamptz not null default now(),
  primary key (product, version)
);

-- People who unsubscribed from update emails.
create table if not exists public.email_optouts (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.release_notices enable row level security;
alter table public.email_optouts enable row level security;
