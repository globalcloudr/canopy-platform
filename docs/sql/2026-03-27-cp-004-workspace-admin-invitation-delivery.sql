begin;

alter table public.workspace_admin_invitations
  add column if not exists sent_at timestamptz,
  add column if not exists delivery_status text not null default 'pending_unsent';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workspace_admin_invitations_delivery_status_check'
  ) then
    alter table public.workspace_admin_invitations
      add constraint workspace_admin_invitations_delivery_status_check
      check (delivery_status in ('pending_unsent', 'sent', 'failed'));
  end if;
end $$;

update public.workspace_admin_invitations
set
  delivery_status = case
    when status = 'pending' and sent_at is null then 'pending_unsent'
    when status = 'pending' and sent_at is not null then 'sent'
    else delivery_status
  end
where delivery_status is null
   or delivery_status not in ('pending_unsent', 'sent', 'failed');

commit;
