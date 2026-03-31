-- Canopy Platform — one-time product launch handoffs
-- Replaces raw token-in-URL handoff with short-lived single-use exchange codes.

create table if not exists public.product_launch_handoffs (
  id uuid primary key default gen_random_uuid(),
  handoff_code text not null unique,
  product_key text not null,
  workspace_slug text,
  access_token text not null,
  refresh_token text not null,
  issued_by_user_id uuid,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  check (product_key in ('photovault', 'stories_canopy', 'reach_canopy'))
);

create index if not exists product_launch_handoffs_lookup_idx
  on public.product_launch_handoffs (handoff_code, product_key);

create index if not exists product_launch_handoffs_expiry_idx
  on public.product_launch_handoffs (expires_at, consumed_at);

alter table public.product_launch_handoffs enable row level security;

drop policy if exists product_launch_handoffs_no_direct_access on public.product_launch_handoffs;
create policy product_launch_handoffs_no_direct_access
on public.product_launch_handoffs
for all
using (false)
with check (false);
