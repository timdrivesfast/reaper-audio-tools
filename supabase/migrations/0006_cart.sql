-- Cart checkout: one Stripe order can hold several plugins, so a session gets one license per plugin.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe on existing rows (each session has one license today).
create unique index if not exists licenses_stripe_session_product_uniq on public.licenses (stripe_session_id, product) where stripe_session_id is not null;
drop index if exists public.licenses_stripe_session_uniq;
