-- Stripe checkout. Run once in Supabase: SQL Editor → New query → paste → Run.
alter table public.licenses add column if not exists stripe_session_id text;
alter table public.licenses add column if not exists stripe_payment_intent text;
create unique index if not exists licenses_stripe_session_uniq on public.licenses (stripe_session_id) where stripe_session_id is not null;
create index if not exists licenses_stripe_pi_idx on public.licenses (stripe_payment_intent);

-- Every Stripe webhook event we've handled, so a resend is ignored.
create table if not exists public.stripe_events (
  event_id text primary key,
  event_type text not null,
  received_at timestamptz not null default now()
);
alter table public.stripe_events enable row level security;
