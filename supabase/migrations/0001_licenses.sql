-- Reaper Audio Tools licensing.
-- Run once in Supabase: SQL Editor → New query → paste this file → Run.
-- Row-level security is on with no policies, so these tables are only reachable
-- with the service role key (the site's server code), never from a browser.

create extension if not exists pgcrypto;

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  product text not null,                       -- 'easyduck', 'drumcrusher', …
  email text not null,
  customer_name text,
  paddle_transaction_id text,
  paddle_customer_id text,
  status text not null default 'active' check (status in ('active', 'revoked')),
  revoked_reason text,
  max_activations int not null default 2,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists licenses_email_idx on public.licenses (lower(email));
create index if not exists licenses_transaction_idx on public.licenses (paddle_transaction_id);
-- One license per product per Paddle transaction line, so webhook retries never double-issue.
create unique index if not exists licenses_txn_product_uniq on public.licenses (paddle_transaction_id, product) where paddle_transaction_id is not null;

create table if not exists public.activations (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references public.licenses (id) on delete cascade,
  machine_id text not null,
  machine_name text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (license_id, machine_id)
);

create index if not exists activations_license_idx on public.activations (license_id);

-- Every Paddle webhook we have handled, so a resend is ignored.
create table if not exists public.paddle_events (
  event_id text primary key,
  event_type text not null,
  received_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists licenses_touch on public.licenses;
create trigger licenses_touch before update on public.licenses
  for each row execute function public.touch_updated_at();

alter table public.licenses enable row level security;
alter table public.activations enable row level security;
alter table public.paddle_events enable row level security;

-- Private bucket for plugin installers. Upload files as <product>/<platform>.<ext>,
-- e.g. easyduck/mac.pkg and easyduck/windows.exe.
insert into storage.buckets (id, name, public)
values ('installers', 'installers', false)
on conflict (id) do nothing;
