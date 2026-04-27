create or replace function public.get_profile_strength_score(p_advisor uuid)
returns int
language plpgsql
as $$
declare
  pts int := 0;
begin
  if exists (
    select 1
    from public.advisor_journey
    where user_id = p_advisor
  ) then
    pts := pts + 1;
  end if;

  if exists (
    select 1
    from public.advisor_services
    where advisor_id = p_advisor
  ) then
    pts := pts + 1;
  end if;

  if exists (
    select 1
    from public.advisor_achievements
    where advisor_id = p_advisor
  ) then
    pts := pts + 1;
  end if;

  if exists (
    select 1
    from public.advisor_testimonials
    where advisor_id = p_advisor
      and status = 'approved'
  ) then
    pts := pts + 1;
  end if;

  if exists (
    select 1
    from public.advisor_gallery
    where advisor_id = p_advisor
  ) then
    pts := pts + 1;
  end if;

  return least(pts, 5);
end;
$$;
