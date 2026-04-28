CREATE OR REPLACE FUNCTION public.recalculate_advisor_score(p_advisor uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  v_mobile int := 0;
  v_email int := 0;
  v_selfie int := 0;
  v_irda int := 0;
  v_intro int := 0;

  v_identity int := 0;

  v_public int := 0;
  v_self_share int := 0;
  v_client_share int := 0;
  v_strength int := 0;
  v_login int := 0;
  v_visibility int := 0;

  v_testimonial int := 0;
  v_recommendation int := 0;
  v_achievement int := 0;
  v_trust int := 0;

  v_total int := 0;
begin
  select
    coalesce(case when mobile_verified then 3 else 0 end, 0),
    coalesce(case when email_verified then 2 else 0 end, 0),
    coalesce(case when selfie_url is not null then 10 else 0 end, 0)
  into v_mobile, v_email, v_selfie
  from public.users
  where id = p_advisor;

  v_mobile := coalesce(v_mobile, 0);
  v_email := coalesce(v_email, 0);
  v_selfie := coalesce(v_selfie, 0);

  select
    coalesce(case when profile_status then 5 else 0 end, 0),
    coalesce(case when coalesce(intro_url, '') <> '' then 10 else 0 end, 0),
    coalesce(case when ispublic_profile then 10 else 0 end, 0)
  into v_irda, v_intro, v_public
  from public.advisor_profiles
  where advisor_id = p_advisor;

  v_irda := coalesce(v_irda, 0);
  v_intro := coalesce(v_intro, 0);
  v_public := coalesce(v_public, 0);

  v_identity :=
    coalesce(v_mobile, 0) +
    coalesce(v_email, 0) +
    coalesce(v_selfie, 0) +
    coalesce(v_irda, 0) +
    coalesce(v_intro, 0);

  select coalesce(least((count(*) / 5)::int, 5), 0)
  into v_self_share
  from public.advisor_share_events
  where advisor_id = p_advisor
    and share_type = 'self';

  select coalesce(least(count(*), 5), 0)
  into v_client_share
  from public.advisor_share_events
  where advisor_id = p_advisor
    and share_type = 'client';

  select coalesce(login_activity_pts, 0)
  into v_login
  from public.advisor_scores
  where advisor_id = p_advisor;

  v_login := coalesce(v_login, 0);

  v_strength := coalesce(public.get_profile_strength_score(p_advisor), 0);
  
  v_visibility :=
    coalesce(v_public, 0) +
    coalesce(v_self_share, 0) +
    coalesce(v_client_share, 0) +
    coalesce(v_strength, 0) +
    coalesce(v_login, 0);

  v_testimonial := coalesce(public.get_testimonial_score(p_advisor), 0);
  v_recommendation := coalesce(public.get_recommendation_score(p_advisor), 0);
  v_achievement := coalesce(public.get_achievement_score(p_advisor), 0);

  v_trust :=
    coalesce(v_testimonial, 0) +
    coalesce(v_recommendation, 0) +
    coalesce(v_achievement, 0);
    
  v_total := coalesce(v_identity, 0) + coalesce(v_visibility, 0) + coalesce(v_trust, 0);

  insert into public.advisor_scores(
    advisor_id,
    identity_total,
    visibility_total,
    trust_total,
    total_score,
    mobile_pts,
    email_pts,
    selfie_pts,
    irda_pts,
    intro_video_pts,
    public_profile_pts,
    self_share_pts,
    client_share_pts,
    profile_strength_pts,
    login_activity_pts,
    testimonial_pts,
    recommendation_pts,
    achievement_pts
  )
  values(
    p_advisor,
    v_identity,
    v_visibility,
    v_trust,
    v_total,
    v_mobile,
    v_email,
    v_selfie,
    v_irda,
    v_intro,
    v_public,
    v_self_share,
    v_client_share,
    v_strength,
    v_login,
    v_testimonial,
    v_recommendation,
    v_achievement
  )
  on conflict (advisor_id)
  do update set
    identity_total = excluded.identity_total,
    visibility_total = excluded.visibility_total,
    trust_total = excluded.trust_total,
    total_score = excluded.total_score,
    mobile_pts = excluded.mobile_pts,
    email_pts = excluded.email_pts,
    selfie_pts = excluded.selfie_pts,
    irda_pts = excluded.irda_pts,
    intro_video_pts = excluded.intro_video_pts,
    public_profile_pts = excluded.public_profile_pts,
    self_share_pts = excluded.self_share_pts,
    client_share_pts = excluded.client_share_pts,
    profile_strength_pts = excluded.profile_strength_pts,
    login_activity_pts = excluded.login_activity_pts,
    testimonial_pts = excluded.testimonial_pts,
    recommendation_pts = excluded.recommendation_pts,
    achievement_pts = excluded.achievement_pts,
    updated_at = now();

  update public.advisor_profiles
  set score_last_recalculated_at = now()
  where advisor_id = p_advisor;
end;
$function$;