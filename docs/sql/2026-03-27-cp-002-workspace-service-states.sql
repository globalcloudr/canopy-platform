begin;

create table if not exists public.workspace_service_states (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_key text not null,
  status text not null default 'available',
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
    where conname = 'workspace_service_states_service_key_check'
  ) then
    alter table public.workspace_service_states
      add constraint workspace_service_states_service_key_check
      check (
        service_key in (
          'school-website-setup',
          'creative-retainer'
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspace_service_states_status_check'
  ) then
    alter table public.workspace_service_states
      add constraint workspace_service_states_status_check
      check (status in ('active', 'available', 'paused', 'inactive'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspace_service_states_setup_state_check'
  ) then
    alter table public.workspace_service_states
      add constraint workspace_service_states_setup_state_check
      check (setup_state in ('setup', 'ready', 'pilot'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspace_service_states_source_check'
  ) then
    alter table public.workspace_service_states
      add constraint workspace_service_states_source_check
      check (source in ('sales', 'manual_provisioning', 'migration', 'internal_grant', 'canopy_provisioning'));
  end if;
end $$;

create unique index if not exists workspace_service_states_org_service_key_idx
  on public.workspace_service_states (organization_id, service_key);

create index if not exists workspace_service_states_org_status_idx
  on public.workspace_service_states (organization_id, status);

alter table public.workspace_service_states enable row level security;

drop policy if exists workspace_service_states_select_org_viewer on public.workspace_service_states;
create policy workspace_service_states_select_org_viewer
on public.workspace_service_states
for select
to public
using (
  public.is_org_viewer(organization_id)
  or public.is_platform_operator()
);

drop policy if exists workspace_service_states_insert_super_admin on public.workspace_service_states;
create policy workspace_service_states_insert_super_admin
on public.workspace_service_states
for insert
to authenticated
with check (public.is_super_admin());

drop policy if exists workspace_service_states_update_super_admin on public.workspace_service_states;
create policy workspace_service_states_update_super_admin
on public.workspace_service_states
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists workspace_service_states_delete_super_admin on public.workspace_service_states;
create policy workspace_service_states_delete_super_admin
on public.workspace_service_states
for delete
to authenticated
using (public.is_super_admin());

commit;
