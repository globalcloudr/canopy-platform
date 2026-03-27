begin;

create table if not exists public.product_entitlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_key text not null,
  status text not null default 'active',
  plan_key text,
  setup_state text not null default 'ready',
  source text not null default 'manual_provisioning',
  starts_at timestamptz,
  ends_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_entitlements_product_key_check'
  ) then
    alter table public.product_entitlements
      add constraint product_entitlements_product_key_check
      check (
        product_key in (
          'photovault',
          'canopy_web',
          'create_canopy',
          'publish_canopy',
          'stories_canopy',
          'community_canopy',
          'reach_canopy',
          'assist_canopy',
          'insights_canopy',
          'website_setup',
          'design_support',
          'communications_support'
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_entitlements_status_check'
  ) then
    alter table public.product_entitlements
      add constraint product_entitlements_status_check
      check (status in ('trial', 'active', 'pilot', 'paused'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_entitlements_setup_state_check'
  ) then
    alter table public.product_entitlements
      add constraint product_entitlements_setup_state_check
      check (setup_state in ('not_started', 'in_setup', 'ready', 'blocked'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_entitlements_source_check'
  ) then
    alter table public.product_entitlements
      add constraint product_entitlements_source_check
      check (source in ('sales', 'manual_provisioning', 'migration', 'internal_grant'));
  end if;
end $$;

create unique index if not exists product_entitlements_org_product_key_idx
  on public.product_entitlements (organization_id, product_key);

create index if not exists product_entitlements_org_status_idx
  on public.product_entitlements (organization_id, status);

alter table public.product_entitlements enable row level security;

drop policy if exists product_entitlements_select_org_viewer on public.product_entitlements;
create policy product_entitlements_select_org_viewer
on public.product_entitlements
for select
to public
using (
  public.is_org_viewer(organization_id)
  or public.is_platform_operator()
);

drop policy if exists product_entitlements_insert_super_admin on public.product_entitlements;
create policy product_entitlements_insert_super_admin
on public.product_entitlements
for insert
to authenticated
with check (public.is_super_admin());

drop policy if exists product_entitlements_update_super_admin on public.product_entitlements;
create policy product_entitlements_update_super_admin
on public.product_entitlements
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists product_entitlements_delete_super_admin on public.product_entitlements;
create policy product_entitlements_delete_super_admin
on public.product_entitlements
for delete
to authenticated
using (public.is_super_admin());

insert into public.product_entitlements (
  organization_id,
  product_key,
  status,
  plan_key,
  setup_state,
  source,
  notes
)
select
  o.id,
  'photovault',
  'active',
  'bridge',
  'ready',
  'migration',
  'Backfilled during Canopy portal entitlement bootstrap.'
from public.organizations o
where not exists (
  select 1
  from public.product_entitlements pe
  where pe.organization_id = o.id
    and pe.product_key = 'photovault'
);

commit;
