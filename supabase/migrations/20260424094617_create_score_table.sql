-- ==========================================================
-- YVITY SCORE SYSTEM - FINAL PATCH MIGRATION
-- Uses your existing users table + existing advisor tables
-- Only adds missing columns / policies / functions / score system
-- Safe to run after your current schema exists
-- ==========================================================

create extension if not exists pgcrypto;

-- ==========================================================
-- 1. USERS TABLE IMPROVEMENTS (ONLY IF MISSING)
-- ==========================================================

-- Helpful for score queries / advisor filtering
alter table public.users
add column if not exists is_active boolean not null default true;

-- optional last login tracking
alter table public.users
add column if not exists last_login_at timestamptz null;

create index if not exists idx_users_mobile_verified
on public.users(mobile_verified);

create index if not exists idx_users_email_verified
on public.users(email_verified);

create index if not exists idx_users_active
on public.users(is_active);

-- ==========================================================
-- 2. ADVISOR_PROFILES IMPROVEMENTS
-- ==========================================================

alter table public.advisor_profiles
add column if not exists score_last_recalculated_at timestamptz null;

create index if not exists idx_advisor_profiles_verified
on public.advisor_profiles(is_verified);

create index if not exists idx_advisor_profiles_public
on public.advisor_profiles(ispublic_profile);

-- ==========================================================
-- 3. SCORE TABLE
-- ==========================================================

create table if not exists public.advisor_scores (
  id uuid primary key default gen_random_uuid(),

  advisor_id uuid not null unique
  references public.users(id)
  on delete cascade,

  identity_total int not null default 0,
  visibility_total int not null default 0,
  trust_total int not null default 0,
  total_score int not null default 0,

  mobile_pts int not null default 0,
  email_pts int not null default 0,
  selfie_pts int not null default 0,
  irda_pts int not null default 0,
  intro_video_pts int not null default 0,

  public_profile_pts int not null default 0,
  self_share_pts int not null default 0,
  client_share_pts int not null default 0,
  profile_strength_pts int not null default 0,
  login_activity_pts int not null default 0,

  testimonial_pts int not null default 0,
  recommendation_pts int not null default 0,
  achievement_pts int not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_advisor_scores_total
on public.advisor_scores(total_score desc);

create trigger advisor_scores_updated_at
before update on public.advisor_scores
for each row
execute function public.update_updated_at();

-- ==========================================================
-- 4. NEW SUPPORT TABLES
-- ==========================================================

create table if not exists public.advisor_achievements (
  id uuid primary key default gen_random_uuid(),
  advisor_id uuid not null references public.users(id) on delete cascade,
  achievement_type text not null
    check (achievement_type in ('MDRT','COT','TOT')),
  achievement_year int not null,
  certificate_url text not null,
  created_at timestamptz not null default now(),
  unique(advisor_id, achievement_type, achievement_year)
);

create table if not exists public.advisor_login_activity (
  id uuid primary key default gen_random_uuid(),
  advisor_id uuid not null references public.users(id) on delete cascade,
  login_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique(advisor_id, login_date)
);

create table if not exists public.advisor_share_events (
  id uuid primary key default gen_random_uuid(),
  advisor_id uuid not null references public.users(id) on delete cascade,
  user_id uuid null references public.users(id),
  share_type text not null check (share_type in ('self','client')),
  channel text not null,
  created_at timestamptz not null default now()
);

-- ==========================================================
-- 5. INDEXES ON EXISTING TABLES
-- ==========================================================

create index if not exists idx_testimonials_advisor_status
on public.advisor_testimonials(advisor_id,status);

create index if not exists idx_recommendations_advisor_status
on public.advisor_recommendations(advisor_id,status);

create index if not exists idx_profile_stats_profile
on public.advisor_profile_stats(profile_id);

create index if not exists idx_achievements_advisor
on public.advisor_achievements(advisor_id);

create index if not exists idx_login_activity_advisor
on public.advisor_login_activity(advisor_id,login_date);

create index if not exists idx_share_events_advisor
on public.advisor_share_events(advisor_id,share_type);

-- ==========================================================
-- 6. HELPER FUNCTIONS
-- ==========================================================

create or replace function public.get_achievement_score(p_advisor uuid)
returns int
language plpgsql
as $$
declare
  v_year int;
begin
  select max(achievement_year)
  into v_year
  from public.advisor_achievements
  where advisor_id = p_advisor;

  if v_year is null then return 0; end if;

  if exists (
    select 1 from public.advisor_achievements
    where advisor_id=p_advisor
    and achievement_year=v_year
    and achievement_type='TOT'
  ) then return 10; end if;

  if exists (
    select 1 from public.advisor_achievements
    where advisor_id=p_advisor
    and achievement_year=v_year
    and achievement_type='COT'
  ) then return 8; end if;

  if exists (
    select 1 from public.advisor_achievements
    where advisor_id=p_advisor
    and achievement_year=v_year
    and achievement_type='MDRT'
  ) then return 2; end if;

  return 0;
end;
$$;

create or replace function public.get_testimonial_score(p_advisor uuid)
returns int
language sql
as $$
with x as (
select
least(count(*) filter (
where testimonial_type='text'
and status='approved'
),2) as t,

least(
(count(*) filter (
where testimonial_type='audio'
and status='approved'
))*2,4) as a,

least(
(count(*) filter (
where testimonial_type='video'
and status='approved'
))*3,9) as v

from public.advisor_testimonials
where advisor_id=p_advisor
)
select coalesce(t,0)+coalesce(a,0)+coalesce(v,0) from x;
$$;

create or replace function public.get_recommendation_score(p_advisor uuid)
returns int
language plpgsql
as $$
declare
  c int;
  recent_count int;
  base_pts int;
begin
  select count(*)
  into c
  from public.advisor_recommendations
  where advisor_id=p_advisor
  and status='approved';

  base_pts := least(c * 2,14);

  select count(*)
  into recent_count
  from public.advisor_recommendations
  where advisor_id=p_advisor
  and status='approved'
  and created_at >= now() - interval '6 month';

  if recent_count > 0 then
    return least(base_pts + 1,15);
  end if;

  return base_pts;
end;
$$;

create or replace function public.get_profile_strength_score(p_advisor uuid)
returns int
language plpgsql
as $$
declare
  pts int := 0;
begin

  if exists (
    select 1 from public.advisor_profiles
    where advisor_id=p_advisor
    and coalesce(short_bio,'') <> ''
  ) then pts := pts + 1; end if;

  if exists (
    select 1 from public.advisor_profiles
    where advisor_id=p_advisor
    and jsonb_array_length(services) > 0
  ) then pts := pts + 1; end if;

  if exists (
    select 1 from public.advisor_achievements
    where advisor_id=p_advisor
  ) then pts := pts + 1; end if;

  if exists (
    select 1 from public.advisor_testimonials
    where advisor_id=p_advisor
    and status='approved'
  ) then pts := pts + 1; end if;

  if exists (
    select 1 from public.advisor_profiles
    where advisor_id=p_advisor
    and coalesce(intro_url,'') <> ''
  ) then pts := pts + 1; end if;

  return least(pts,5);
end;
$$;

-- ==========================================================
-- 7. MAIN RECALCULATE FUNCTION
-- ==========================================================

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
    case when is_verified then 5 else 0 end,
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

  select least(count(*),5)
  into v_login
  from public.advisor_login_activity
  where advisor_id=p_advisor
  and login_date >= current_date - interval '6 day';

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

-- ==========================================================
-- 8. RLS
-- ==========================================================

alter table public.advisor_scores enable row level security;
alter table public.advisor_achievements enable row level security;
alter table public.advisor_login_activity enable row level security;
alter table public.advisor_share_events enable row level security;

drop policy if exists "read own score" on public.advisor_scores;
create policy "read own score"
on public.advisor_scores
for select
using (auth.uid() = advisor_id);

create policy "own achievements all"
on public.advisor_achievements
for all
using (auth.uid() = advisor_id)
with check (auth.uid() = advisor_id);

create policy "own login activity all"
on public.advisor_login_activity
for all
using (auth.uid() = advisor_id)
with check (auth.uid() = advisor_id);

create policy "own share events all"
on public.advisor_share_events
for all
using (auth.uid() = advisor_id)
with check (auth.uid() = advisor_id);

-- ==========================================================
-- DONE
-- After login / testimonial / recommendation / achievement:
-- select public.recalculate_advisor_score('advisor_uuid');
-- ==========================================================
