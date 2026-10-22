-- Waitlist signups (e.g. list 'drumcrusher'). One row per email per list.
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null,
  list text not null,
  created_at timestamptz not null default now(),
  unique (email, list)
);

alter table public.waitlist enable row level security;
