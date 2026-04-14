-- Canopy Platform — allow Canopy Create in product launch handoffs

do $$
declare
  constraint_name text;
begin
  select con.conname
    into constraint_name
  from pg_constraint con
  where con.conrelid = 'public.product_launch_handoffs'::regclass
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) like '%product_key%';

  if constraint_name is not null then
    execute format(
      'alter table public.product_launch_handoffs drop constraint %I',
      constraint_name
    );
  end if;
end $$;

alter table public.product_launch_handoffs
  add constraint product_launch_handoffs_product_key_check
  check (
    product_key in (
      'photovault',
      'stories_canopy',
      'community_canopy',
      'reach_canopy',
      'create_canopy'
    )
  );
