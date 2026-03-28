begin;

create table if not exists public.workspace_admin_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'owner',
  status text not null default 'pending',
  source text not null default 'manual_provisioning',
  invited_by_user_id uuid references auth.users(id) on delete set null,
  accepted_by_user_id uuid references auth.users(id) on delete set null,
  accepted_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspace_admin_invitations_role_check'
  ) then
    alter table public.workspace_admin_invitations
      add constraint workspace_admin_invitations_role_check
      check (role in ('owner', 'admin', 'staff', 'uploader', 'viewer'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspace_admin_invitations_status_check'
  ) then
    alter table public.workspace_admin_invitations
      add constraint workspace_admin_invitations_status_check
      check (status in ('pending', 'accepted', 'cancelled'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspace_admin_invitations_source_check'
  ) then
    alter table public.workspace_admin_invitations
      add constraint workspace_admin_invitations_source_check
      check (source in ('manual_provisioning', 'migration', 'internal_grant'));
  end if;
end $$;

create unique index if not exists workspace_admin_invitations_org_email_idx
  on public.workspace_admin_invitations (organization_id, email);

create index if not exists workspace_admin_invitations_status_idx
  on public.workspace_admin_invitations (status);

alter table public.workspace_admin_invitations enable row level security;

drop policy if exists workspace_admin_invitations_select_org_viewer on public.workspace_admin_invitations;
create policy workspace_admin_invitations_select_org_viewer
on public.workspace_admin_invitations
for select
to public
using (
  public.is_org_viewer(organization_id)
  or public.is_platform_operator()
);

drop policy if exists workspace_admin_invitations_insert_super_admin on public.workspace_admin_invitations;
create policy workspace_admin_invitations_insert_super_admin
on public.workspace_admin_invitations
for insert
to authenticated
with check (public.is_super_admin());

drop policy if exists workspace_admin_invitations_update_super_admin on public.workspace_admin_invitations;
create policy workspace_admin_invitations_update_super_admin
on public.workspace_admin_invitations
for update
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists workspace_admin_invitations_delete_super_admin on public.workspace_admin_invitations;
create policy workspace_admin_invitations_delete_super_admin
on public.workspace_admin_invitations
for delete
to authenticated
using (public.is_super_admin());

commit;
