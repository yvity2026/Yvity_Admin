alter table public.advisor_scores
add column if not exists login_score_last_awarded_on date,
add column if not exists login_score_last_decay_month date;

create or replace function public.recalculate_advisor_score(p_advisor uuid)
returns void
language plpgsql
as $$
declare
  v_mobile int :=0;
  v_email int :=0;
  v_selfie int :=0;
  v_irda int :=0;
  v_intro int :=0;

  v_identity int :=0;

  v_public int :=10;
  v_self_share int :=0;
  v_client_share int :=0;
  v_strength int :=0;
  v_login int :=0;
  v_visibility int :=0;

  v_testimonial int :=0;
  v_recommendation int :=0;
  v_achievement int :=0;
  v_trust int :=0;

  v_total int :=0;
begin
  select
    case when mobile_verified then 3 else 0 end,
    case when email_verified then 2 else 0 end,
    case when selfie_url is not null then 10 else 0 end
  into v_mobile,v_email,v_selfie
  from public.users
  where id=p_advisor;

  select
    case when profile_status then 5 else 0 end,
    case when coalesce(intro_url,'') <> '' then 10 else 0 end
  into v_irda,v_intro
  from public.advisor_profiles
  where advisor_id=p_advisor;

  v_identity :=
    v_mobile+v_email+v_selfie+v_irda+v_intro;

  select least((count(*)/5)::int,5)
  into v_self_share
  from public.advisor_share_events
  where advisor_id=p_advisor
  and share_type='self';

  select least(count(*),5)
  into v_client_share
  from public.advisor_share_events
  where advisor_id=p_advisor
  and share_type='client';

  select coalesce(login_activity_pts,0)
  into v_login
  from public.advisor_scores
  where advisor_id=p_advisor;

  v_strength := public.get_profile_strength_score(p_advisor);

  v_visibility :=
    v_public + v_self_share + v_client_share + v_strength + v_login;

  v_testimonial := public.get_testimonial_score(p_advisor);
  v_recommendation := public.get_recommendation_score(p_advisor);
  v_achievement := public.get_achievement_score(p_advisor);

  v_trust :=
    v_testimonial + v_recommendation + v_achievement;

  v_total :=
    v_identity + v_visibility + v_trust;

  insert into public.advisor_scores(
    advisor_id,
    identity_total,visibility_total,trust_total,total_score,
    mobile_pts,email_pts,selfie_pts,irda_pts,intro_video_pts,
    public_profile_pts,self_share_pts,client_share_pts,
    profile_strength_pts,login_activity_pts,
    testimonial_pts,recommendation_pts,achievement_pts
  )
  values(
    p_advisor,
    v_identity,v_visibility,v_trust,v_total,
    v_mobile,v_email,v_selfie,v_irda,v_intro,
    v_public,v_self_share,v_client_share,
    v_strength,v_login,
    v_testimonial,v_recommendation,v_achievement
  )
  on conflict(advisor_id)
  do update set
    identity_total=excluded.identity_total,
    visibility_total=excluded.visibility_total,
    trust_total=excluded.trust_total,
    total_score=excluded.total_score,
    mobile_pts=excluded.mobile_pts,
    email_pts=excluded.email_pts,
    selfie_pts=excluded.selfie_pts,
    irda_pts=excluded.irda_pts,
    intro_video_pts=excluded.intro_video_pts,
    public_profile_pts=excluded.public_profile_pts,
    self_share_pts=excluded.self_share_pts,
    client_share_pts=excluded.client_share_pts,
    profile_strength_pts=excluded.profile_strength_pts,
    login_activity_pts=excluded.login_activity_pts,
    testimonial_pts=excluded.testimonial_pts,
    recommendation_pts=excluded.recommendation_pts,
    achievement_pts=excluded.achievement_pts,
    updated_at=now();

  update public.advisor_profiles
  set score_last_recalculated_at = now()
  where advisor_id = p_advisor;
end;
$$;

create or replace function public.increment_advisor_login_score(
  p_advisor uuid,
  p_login_date date default current_date
)
returns void
language plpgsql
as $$
begin
  insert into public.advisor_scores(
    advisor_id,
    login_activity_pts,
    login_score_last_awarded_on
  )
  values (
    p_advisor,
    1,
    p_login_date
  )
  on conflict(advisor_id)
  do update set
    login_activity_pts = case
      when public.advisor_scores.login_score_last_awarded_on is distinct from p_login_date
        then least(coalesce(public.advisor_scores.login_activity_pts, 0) + 1, 5)
      else coalesce(public.advisor_scores.login_activity_pts, 0)
    end,
    login_score_last_awarded_on = case
      when public.advisor_scores.login_score_last_awarded_on is distinct from p_login_date
        then p_login_date
      else public.advisor_scores.login_score_last_awarded_on
    end,
    updated_at = now();

  perform public.recalculate_advisor_score(p_advisor);
end;
$$;

create or replace function public.process_month_end_advisor_login_scores(
  p_target_date date default current_date
)
returns void
language plpgsql
as $$
declare
  v_month_start date := date_trunc('month', p_target_date)::date;
  v_month_end date := (
    date_trunc('month', p_target_date) + interval '1 month - 1 day'
  )::date;
  v_advisor record;
begin
  if p_target_date <> v_month_end then
    return;
  end if;

  insert into public.advisor_scores(advisor_id)
  select u.id
  from public.users u
  where u.roles @> '["advisor"]'::jsonb
  on conflict(advisor_id) do nothing;

  update public.advisor_scores s
  set
    login_activity_pts = greatest(coalesce(s.login_activity_pts, 0) - 1, 0),
    login_score_last_decay_month = v_month_start,
    updated_at = now()
  where s.advisor_id in (
    select u.id
    from public.users u
    where u.roles @> '["advisor"]'::jsonb
  )
  and coalesce(s.login_score_last_decay_month, date '1900-01-01') <> v_month_start
  and not exists (
    select 1
    from public.advisor_login_activity a
    where a.advisor_id = s.advisor_id
    and a.login_date >= v_month_start
    and a.login_date <= v_month_end
  );

  for v_advisor in
    select u.id
    from public.users u
    where u.roles @> '["advisor"]'::jsonb
  loop
    perform public.recalculate_advisor_score(v_advisor.id);
  end loop;
end;
$$;
