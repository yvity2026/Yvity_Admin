-- =============================================================================
-- YVITY Gold — end-to-end Supabase / Postgres schema (single file)
-- =============================================================================
-- Source: YVITY-Dashboard live public schema + YVITY Gold bridge columns
-- Covers: users, advisor_profiles, IRDAI approvals, payments (Razorpay),
--         career (advisor_journey), services, achievements, gallery,
--         testimonials, leads (advisor_prospects), admin, platform testimonials
--
-- HOW TO RUN (new Supabase project):
--   1. Supabase Dashboard → SQL Editor → New query
--   2. Paste this ENTIRE file → Run (may take 30–60s)
--   3. Run the OPTIONAL SEED block at the bottom (after first Auth user exists)
--   4. Storage: create buckets `verification-docs`, `selfies`, `intro-video` (public or RLS as needed)
--   5. Set env in Vercel: NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY
--
-- NOTES:
--   • `users.id` references `auth.users` — sign-up creates auth row first, then mirror to public.users
--   • Gold local `.data` JSON maps to these tables (see mapping comment at file end)
--   • `src/components/yvity-gold/` is UI only — no extra tables
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."achievement_type_enum" AS ENUM (
    'education',
    'profession',
    'certificate'
);


ALTER TYPE "public"."achievement_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."admin_role" AS ENUM (
    'super_admin',
    'admin'
);


ALTER TYPE "public"."admin_role" OWNER TO "postgres";


CREATE TYPE "public"."advisor_plan_enum" AS ENUM (
    'free',
    'silver',
    'gold'
);


ALTER TYPE "public"."advisor_plan_enum" OWNER TO "postgres";


CREATE TYPE "public"."advisor_status" AS ENUM (
    'active',
    'under_review',
    'action_required'
);


ALTER TYPE "public"."advisor_status" OWNER TO "postgres";


CREATE TYPE "public"."journey_type_enum" AS ENUM (
    'education',
    'profession',
    'certificate'
);


ALTER TYPE "public"."journey_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."payment_status" AS ENUM (
    'created',
    'authorized',
    'paid',
    'failed',
    'refunded'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


CREATE TYPE "public"."recommendation_status_enum" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE "public"."recommendation_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."stats_type_enum" AS ENUM (
    'view',
    'share',
    'contact'
);


ALTER TYPE "public"."stats_type_enum" OWNER TO "postgres";


CREATE TYPE "public"."testimonial_type_enum" AS ENUM (
    'text',
    'audio',
    'video'
);


ALTER TYPE "public"."testimonial_type_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."clean_expired_device_tokens"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  update users
  set device_tokens = (
    select coalesce(jsonb_agg(t), '[]'::jsonb)
    from jsonb_array_elements(coalesce(device_tokens, '[]'::jsonb)) t
    where 
      (t ? 'expires_at')
      and (t->>'expires_at')::timestamptz > now()
  )
  where device_tokens is not null;
end;
$$;


ALTER FUNCTION "public"."clean_expired_device_tokens"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."clean_expired_otps"() RETURNS "void"
    LANGUAGE "sql"
    AS $$
delete from otp_verifications
where expires_at < now();
$$;


ALTER FUNCTION "public"."clean_expired_otps"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cleanup_expired_admin_otps"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
begin
  delete from public.admin_otps
  where expires_at < now();
end;
$$;


ALTER FUNCTION "public"."cleanup_expired_admin_otps"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_otp"("p_identifier" "text", "p_purpose" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions'
    AS $$
declare
  generated_otp text;
begin
  generated_otp := lpad((floor(random() * 1000000))::text, 6, '0');

  delete from otp_verifications
  where identifier = p_identifier
    and purpose = p_purpose;

  insert into otp_verifications (
    identifier,
    otp_hash,
    purpose,
    expires_at
  )
  values (
    p_identifier,
    extensions.crypt(generated_otp, extensions.gen_salt('bf')),
    p_purpose,
    now() + interval '5 minutes'
  );

  return generated_otp;
end;
$$;


ALTER FUNCTION "public"."create_otp"("p_identifier" "text", "p_purpose" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_achievement_score"("p_advisor" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $_$
declare
  v_points int := 0;
begin
  if exists (
    select 1
    from public.advisor_achievements
    where advisor_id = p_advisor
      and upper(coalesce(title, '')) ~ '\mTOT\M'
      and coalesce(achievement_year, '') ~ '^(19|20)\d{2}$'
  ) then
    return 10;
  end if;

  with parsed as (
    select distinct
      case
        when upper(coalesce(title, '')) ~ '\mCOT\M' then 'COT'
        when upper(coalesce(title, '')) ~ '\mMDRT\M' then 'MDRT'
        else null
      end as achievement_type,
      match[1]::int as achievement_year
    from public.advisor_achievements
    cross join lateral regexp_matches(
      coalesce(achievement_year, ''),
      '^((?:19|20)\d{2})$',
      'g'
    ) as match
    where advisor_id = p_advisor
      and (
        upper(coalesce(title, '')) ~ '\mCOT\M'
        or upper(coalesce(title, '')) ~ '\mMDRT\M'
      )
  )
  select least(
    coalesce(sum(
      case
        when achievement_type = 'COT' then 6
        when achievement_type = 'MDRT' then 2
        else 0
      end
    ), 0),
    10
  )
  into v_points
  from parsed;

  return coalesce(v_points, 0);
end;
$_$;


ALTER FUNCTION "public"."get_achievement_score"("p_advisor" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_profile_strength_score"("p_advisor" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
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


ALTER FUNCTION "public"."get_profile_strength_score"("p_advisor" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_recommendation_score"("p_advisor" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
declare
  v_plan text := 'free';
  v_account_status text := 'active';
  v_effective_plan text := 'free';
  v_recommendation_count int := 0;
  v_base_pts int := 0;
begin
  select
    lower(coalesce(subscription_plan::text, 'free')),
    coalesce(account_status, 'active')
  into v_plan, v_account_status
  from public.advisor_profiles
  where advisor_id = p_advisor;

  if v_plan in ('silver', 'gold') and v_account_status = 'active' then
    v_effective_plan := v_plan;
  end if;

  if v_effective_plan = 'free' then
    return 0;
  end if;

  select count(*)
  into v_recommendation_count
  from public.advisor_recommendations
  where advisor_id = p_advisor;

  v_base_pts := least(coalesce(v_recommendation_count, 0) * 2, 14);

  if coalesce(v_recommendation_count, 0) >= 7 then
    return least(v_base_pts + 1, 15);
  end if;

  return v_base_pts;
end;
$$;


ALTER FUNCTION "public"."get_recommendation_score"("p_advisor" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_testimonial_score"("p_advisor" "uuid") RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
declare
  v_plan text := 'free';
  v_account_status text := 'active';
  v_effective_plan text := 'free';
  v_text_count int := 0;
  v_audio_count int := 0;
  v_video_count int := 0;
begin
  select
    lower(coalesce(subscription_plan::text, 'free')),
    coalesce(account_status, 'active')
  into v_plan, v_account_status
  from public.advisor_profiles
  where advisor_id = p_advisor;

  if v_plan in ('silver', 'gold') and v_account_status = 'active' then
    v_effective_plan := v_plan;
  end if;

  select
    count(*) filter (where testimonial_type = 'text'),
    count(*) filter (where testimonial_type = 'audio'),
    count(*) filter (where testimonial_type = 'video')
  into v_text_count, v_audio_count, v_video_count
  from public.advisor_testimonials
  where advisor_id = p_advisor;

  return
    least(coalesce(v_text_count, 0), 2) +
    case
      when v_effective_plan in ('silver', 'gold')
        then least(coalesce(v_audio_count, 0) * 2, 4)
      else 0
    end +
    case
      when v_effective_plan = 'gold'
        then least(coalesce(v_video_count, 0) * 3, 9)
      else 0
    end;
end;
$$;


ALTER FUNCTION "public"."get_testimonial_score"("p_advisor" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_advisor_login_score"("p_advisor" "uuid", "p_login_date" "date" DEFAULT CURRENT_DATE) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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


ALTER FUNCTION "public"."increment_advisor_login_score"("p_advisor" "uuid", "p_login_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."process_month_end_advisor_login_scores"("p_target_date" "date" DEFAULT CURRENT_DATE) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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


ALTER FUNCTION "public"."process_month_end_advisor_login_scores"("p_target_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."recalculate_advisor_score"("p_advisor" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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
    coalesce(
      case
        when coalesce(nullif(trim(iridai_certificate_url), ''), '') <> ''
          and account_status = 'active'
          and coalesce(subscription_plan::text, 'free') in ('silver', 'gold')
        then 5
        else 0
      end,
      0
    ),
    coalesce(
      case
        when coalesce(nullif(trim(intro_url), ''), '') <> ''
          and account_status = 'active'
          and coalesce(subscription_plan::text, 'free') = 'gold'
        then 10
        else 0
      end,
      0
    ),
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
$$;


ALTER FUNCTION "public"."recalculate_advisor_score"("p_advisor" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reset_expired_advisor_plans"("run_at" timestamp with time zone DEFAULT "now"()) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  affected_rows integer;
begin
  update public.advisor_profiles
  set
    subscription_plan = 'free'::public.advisor_plan_enum,
    subscription_activated_at = null,
    subscription_expires_at = null,
    plan_active = false,
    updated_at = now()
  where coalesce(subscription_plan::text, 'free') in ('silver', 'gold')
    and subscription_expires_at is not null
    and subscription_expires_at <= run_at
    and coalesce(plan_active, false) = true;

  get diagnostics affected_rows = row_count;
  return affected_rows;
end;
$$;


ALTER FUNCTION "public"."reset_expired_advisor_plans"("run_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_yvity_testimonials_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;


ALTER FUNCTION "public"."set_yvity_testimonials_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."verify_otp"("p_identifier" "text", "p_otp" "text", "p_purpose" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions'
    AS $$
declare
  rec record;
begin
  select *
  into rec
  from otp_verifications
  where identifier = p_identifier
    and purpose = p_purpose
  order by created_at desc
  limit 1;

  if rec is null or rec.expires_at < now() or rec.attempts >= 5 then
    return false;
  end if;

  if rec.otp_hash = extensions.crypt(p_otp, rec.otp_hash) then
    delete from otp_verifications
    where id = rec.id;
    return true;
  else
    update otp_verifications
    set attempts = attempts + 1
    where id = rec.id;

    return false;
  end if;
end;
$$;


ALTER FUNCTION "public"."verify_otp"("p_identifier" "text", "p_otp" "text", "p_purpose" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_otps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "admin_id" "uuid",
    "otp" "text" NOT NULL,
    "purpose" "text" DEFAULT 'login'::"text",
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "phone" "text" NOT NULL,
    "used" boolean DEFAULT false
);


ALTER TABLE "public"."admin_otps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "phone_number" "text" NOT NULL,
    "role" "public"."admin_role" DEFAULT 'admin'::"public"."admin_role" NOT NULL,
    "permissions" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true,
    "last_login_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "name" "text" DEFAULT 'Krishna'::"text" NOT NULL,
    "profile_image_url" "text",
    CONSTRAINT "phone_format" CHECK (("phone_number" ~ '^\+[1-9]\d{7,14}$'::"text"))
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "organisation" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "achievement_year" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "type" "text",
    "image_url" "text"
);


ALTER TABLE "public"."advisor_achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_gallery" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "caption" "text",
    "category" "text" NOT NULL,
    "sort_order" integer DEFAULT 0,
    "is_public" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."advisor_gallery" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_journey" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "entry_type" "text" NOT NULL,
    "service_category" "text",
    "custom_service_category" "text",
    "title" "text" NOT NULL,
    "organisation" "text",
    "description" "text",
    "from_year" integer,
    "to_year" integer,
    "date" integer,
    "is_ongoing" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "degree_or_certificate" "text",
    "institution" "text",
    "certificate_name" "text",
    CONSTRAINT "advisor_journey_entry_type_check" CHECK (("entry_type" = ANY (ARRAY['Education'::"text", 'Profession'::"text", 'Certificate'::"text"])))
);


ALTER TABLE "public"."advisor_journey" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_login_activity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "login_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."advisor_login_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "currency" "text" DEFAULT 'INR'::"text",
    "status" "text" DEFAULT 'created'::"text" NOT NULL,
    "plan_id" "text",
    "razorpay_order_id" "text",
    "razorpay_payment_id" "text",
    "razorpay_signature" "text",
    "payment_method" "text",
    "receipt" "text",
    "failure_reason" "text",
    "webhook_verified" boolean DEFAULT false,
    "paid_at" timestamp with time zone,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."advisor_payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_profile_stats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "viewer_id" "uuid",
    "anonymous_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "stats_type" "public"."stats_type_enum"
);


ALTER TABLE "public"."advisor_profile_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "advisor_role_id" "uuid" NOT NULL,
    "services" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "short_bio" "text",
    "iridai_certificate_url" "text" NOT NULL,
    "profile_status" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "intro_url" "text" DEFAULT ''::"text",
    "ispublic_professional" boolean DEFAULT true,
    "ispublic_services" boolean DEFAULT true,
    "ispublic_achievements" boolean DEFAULT true,
    "ispublic_gallery" boolean DEFAULT true,
    "ispublic_testimonials" boolean DEFAULT true,
    "ispublic_profile" boolean DEFAULT true,
    "score_last_recalculated_at" timestamp with time zone,
    "expected_time" timestamp with time zone DEFAULT ("now"() + '48:00:00'::interval),
    "account_status" "public"."advisor_status" DEFAULT 'under_review'::"public"."advisor_status",
    "subscription_plan" "public"."advisor_plan_enum" DEFAULT 'free'::"public"."advisor_plan_enum",
    "profile_slug" "text",
    "subscription_expires_at" timestamp with time zone,
    "subscription_activated_at" timestamp with time zone,
    "plan_active" boolean DEFAULT false,
    "designation" "text",
    "show_contactdetails" boolean DEFAULT true,
    "irdai_rejected_reason" "text",
    "is_hero" boolean DEFAULT false NOT NULL,
    "is_landing" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."advisor_profiles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."advisor_profiles"."intro_url" IS 'Video introduction of the Advisor';



CREATE TABLE IF NOT EXISTS "public"."advisor_prospects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "phone_number" "text" NOT NULL,
    "email" "text",
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."advisor_prospects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "recommendations" "text"[] NOT NULL,
    "mobile_number" "text" NOT NULL,
    "is_mobile_verified" boolean DEFAULT false,
    "status" "public"."recommendation_status_enum" DEFAULT 'approved'::"public"."recommendation_status_enum",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "points" integer
);


ALTER TABLE "public"."advisor_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_by_id" "uuid" NOT NULL,
    "title" "text" DEFAULT 'Insurance Advisor'::"text" NOT NULL,
    "description" "text",
    "is_available" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "icon" "text"
);


ALTER TABLE "public"."advisor_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_scores" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "identity_total" integer DEFAULT 0 NOT NULL,
    "visibility_total" integer DEFAULT 0 NOT NULL,
    "trust_total" integer DEFAULT 0 NOT NULL,
    "total_score" integer DEFAULT 0 NOT NULL,
    "mobile_pts" integer DEFAULT 0 NOT NULL,
    "email_pts" integer DEFAULT 0 NOT NULL,
    "selfie_pts" integer DEFAULT 0 NOT NULL,
    "irda_pts" integer DEFAULT 0 NOT NULL,
    "intro_video_pts" integer DEFAULT 0 NOT NULL,
    "public_profile_pts" integer DEFAULT 0 NOT NULL,
    "self_share_pts" integer DEFAULT 0 NOT NULL,
    "client_share_pts" integer DEFAULT 0 NOT NULL,
    "profile_strength_pts" integer DEFAULT 0 NOT NULL,
    "login_activity_pts" integer DEFAULT 0 NOT NULL,
    "testimonial_pts" integer DEFAULT 0 NOT NULL,
    "recommendation_pts" integer DEFAULT 0 NOT NULL,
    "achievement_pts" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "login_score_last_awarded_on" "date",
    "login_score_last_decay_month" "date"
);


ALTER TABLE "public"."advisor_scores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_services" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "service_type" "text" NOT NULL,
    "company" "text" NOT NULL,
    "experience_years" integer,
    "key_services" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "is_public" boolean DEFAULT true,
    "no_of_clients" integer,
    "from_year" "date",
    "to_year" "date",
    "short_summary" "text",
    "company_logo_url" "text",
    "number_of_climes" integer
);


ALTER TABLE "public"."advisor_services" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_share_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "share_type" "text" NOT NULL,
    "channel" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "advisor_share_events_share_type_check" CHECK (("share_type" = ANY (ARRAY['self'::"text", 'client'::"text"])))
);


ALTER TABLE "public"."advisor_share_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."advisor_testimonials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "name" "text" NOT NULL,
    "mobile_number" "text" NOT NULL,
    "is_mobile_verified" boolean DEFAULT false,
    "testimonial_type" "public"."testimonial_type_enum" NOT NULL,
    "content" "text",
    "media_url" "text",
    "otp_code" "text",
    "otp_expires_at" timestamp with time zone,
    "is_verified" boolean DEFAULT false,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "testimonial_rating" numeric DEFAULT '0'::numeric,
    "reply_text" "text",
    "reply_created_at" timestamp with time zone,
    "reply_updated_at" timestamp with time zone
);


ALTER TABLE "public"."advisor_testimonials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "mobile" character varying(10) NOT NULL,
    "name" "text" NOT NULL,
    "dob" "date",
    "gender" "text",
    "email" "text",
    "city" "text",
    "profession" "text",
    "selfie_url" "text",
    "mobile_verified" boolean DEFAULT false,
    "email_verified" boolean DEFAULT false,
    "roles" "jsonb" DEFAULT '["customer"]'::"jsonb",
    "device_tokens" "jsonb" DEFAULT '[]'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_active" boolean DEFAULT true NOT NULL,
    "last_login_at" timestamp with time zone,
    "account_status" "text" DEFAULT 'active'::"text" NOT NULL,
    "deactivated_until" timestamp with time zone,
    "deleted_at" timestamp with time zone,
    "account_status_updated_at" timestamp with time zone,
    "account_status_reason" "text",
    "original_mobile" character varying(10),
    "original_email" "text",
    "banner_image_url" "text",
    CONSTRAINT "users_account_status_check" CHECK (("account_status" = ANY (ARRAY['active'::"text", 'deactivated'::"text", 'deleted'::"text"]))),
    CONSTRAINT "users_gender_check" CHECK (("gender" = ANY (ARRAY['male'::"text", 'female'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."city_counts" AS
 SELECT "city",
    "count"(*) AS "total"
   FROM "public"."users"
  WHERE ("city" IS NOT NULL)
  GROUP BY "city";


ALTER VIEW "public"."city_counts" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."company_counts" AS
 SELECT "company",
    "count"(*) AS "total"
   FROM "public"."advisor_services"
  WHERE ("company" IS NOT NULL)
  GROUP BY "company";


ALTER VIEW "public"."company_counts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."otp_verifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "identifier" "text" NOT NULL,
    "otp_hash" "text" NOT NULL,
    "purpose" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "attempts" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "otp_verifications_purpose_check" CHECK (("purpose" = ANY (ARRAY['signup'::"text", 'login'::"text", 'password_reset'::"text", 'verify_email'::"text", 'verify_mobile'::"text", 'deactivate_account'::"text", 'delete_account'::"text"])))
);


ALTER TABLE "public"."otp_verifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saved_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "advisor_profile_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."saved_profiles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."service_counts" AS
 SELECT "service_type",
    "count"(*) AS "total"
   FROM "public"."advisor_services"
  WHERE ("service_type" IS NOT NULL)
  GROUP BY "service_type";


ALTER VIEW "public"."service_counts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."testimonial_otps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "advisor_id" "uuid" NOT NULL,
    "phone" "text" NOT NULL,
    "otp" "text" NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '00:10:00'::interval) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_used" boolean DEFAULT false
);


ALTER TABLE "public"."testimonial_otps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."testimonials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "mobile" "text" NOT NULL,
    "is_verified" boolean DEFAULT false,
    "otp_verified_at" timestamp without time zone,
    "advisor_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "content" "text",
    "media_url" "text",
    "thumbnail_url" "text",
    "duration_seconds" integer,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "testimonials_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"]))),
    CONSTRAINT "testimonials_type_check" CHECK (("type" = ANY (ARRAY['text'::"text", 'audio'::"text", 'video'::"text"])))
);


ALTER TABLE "public"."testimonials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."yvity_testimonials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "profession" "text" NOT NULL,
    "city" "text" NOT NULL,
    "respondent_type" "text" NOT NULL,
    "mobile_number" character varying(10) NOT NULL,
    "testimonial_type" "text" NOT NULL,
    "testimonial_rating" integer NOT NULL,
    "content" "text",
    "media_url" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "yvity_reply" "text",
    CONSTRAINT "yvity_testimonials_content_or_media_check" CHECK (((("testimonial_type" = 'text'::"text") AND ("content" IS NOT NULL) AND ("media_url" IS NULL)) OR (("testimonial_type" = ANY (ARRAY['audio'::"text", 'video'::"text"])) AND ("media_url" IS NOT NULL)))),
    CONSTRAINT "yvity_testimonials_respondent_type_check" CHECK (("respondent_type" = ANY (ARRAY['customer'::"text", 'advisor'::"text"]))),
    CONSTRAINT "yvity_testimonials_testimonial_rating_check" CHECK ((("testimonial_rating" >= 1) AND ("testimonial_rating" <= 5))),
    CONSTRAINT "yvity_testimonials_testimonial_type_check" CHECK (("testimonial_type" = ANY (ARRAY['text'::"text", 'audio'::"text", 'video'::"text"])))
);


ALTER TABLE "public"."yvity_testimonials" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_otps"
    ADD CONSTRAINT "admin_otps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_phone_number_key" UNIQUE ("phone_number");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_achievements"
    ADD CONSTRAINT "advisor_achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_journey"
    ADD CONSTRAINT "advisor_journey_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_login_activity"
    ADD CONSTRAINT "advisor_login_activity_advisor_id_login_date_key" UNIQUE ("advisor_id", "login_date");



ALTER TABLE ONLY "public"."advisor_login_activity"
    ADD CONSTRAINT "advisor_login_activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_payments"
    ADD CONSTRAINT "advisor_payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_payments"
    ADD CONSTRAINT "advisor_payments_razorpay_order_id_key" UNIQUE ("razorpay_order_id");



ALTER TABLE ONLY "public"."advisor_payments"
    ADD CONSTRAINT "advisor_payments_razorpay_payment_id_key" UNIQUE ("razorpay_payment_id");



ALTER TABLE ONLY "public"."advisor_gallery"
    ADD CONSTRAINT "advisor_photos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_profiles"
    ADD CONSTRAINT "advisor_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_profiles"
    ADD CONSTRAINT "advisor_profiles_user_id_key" UNIQUE ("advisor_id");



ALTER TABLE ONLY "public"."advisor_prospects"
    ADD CONSTRAINT "advisor_prospects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_recommendations"
    ADD CONSTRAINT "advisor_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_roles"
    ADD CONSTRAINT "advisor_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_scores"
    ADD CONSTRAINT "advisor_scores_advisor_id_key" UNIQUE ("advisor_id");



ALTER TABLE ONLY "public"."advisor_scores"
    ADD CONSTRAINT "advisor_scores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_services"
    ADD CONSTRAINT "advisor_services_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_share_events"
    ADD CONSTRAINT "advisor_share_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_testimonials"
    ADD CONSTRAINT "advisor_testimonials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."advisor_profile_stats"
    ADD CONSTRAINT "advisor_views_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."otp_verifications"
    ADD CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."saved_profiles"
    ADD CONSTRAINT "saved_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."saved_profiles"
    ADD CONSTRAINT "saved_profiles_user_id_advisor_profile_id_key" UNIQUE ("user_id", "advisor_profile_id");



ALTER TABLE ONLY "public"."testimonial_otps"
    ADD CONSTRAINT "testimonial_otps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."yvity_testimonials"
    ADD CONSTRAINT "yvity_testimonials_mobile_type_unique" UNIQUE ("mobile_number", "testimonial_type");



ALTER TABLE ONLY "public"."yvity_testimonials"
    ADD CONSTRAINT "yvity_testimonials_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_admin_otps_expires" ON "public"."admin_otps" USING "btree" ("expires_at");



CREATE INDEX "idx_admin_users_role" ON "public"."admin_users" USING "btree" ("role");



CREATE INDEX "idx_admin_users_user_id" ON "public"."admin_users" USING "btree" ("user_id");



CREATE UNIQUE INDEX "idx_advisor_profiles_profile_slug" ON "public"."advisor_profiles" USING "btree" ("profile_slug") WHERE ("profile_slug" IS NOT NULL);



CREATE INDEX "idx_advisor_profiles_public" ON "public"."advisor_profiles" USING "btree" ("ispublic_profile");



CREATE INDEX "idx_advisor_profiles_verified" ON "public"."advisor_profiles" USING "btree" ("profile_status");



CREATE INDEX "idx_advisor_prospects_advisor_created_at" ON "public"."advisor_prospects" USING "btree" ("advisor_id", "created_at" DESC);



CREATE INDEX "idx_advisor_scores_total" ON "public"."advisor_scores" USING "btree" ("total_score" DESC);



CREATE INDEX "idx_login_activity_advisor" ON "public"."advisor_login_activity" USING "btree" ("advisor_id", "login_date");



CREATE INDEX "idx_otp_expiry" ON "public"."otp_verifications" USING "btree" ("expires_at");



CREATE INDEX "idx_otp_identifier_purpose" ON "public"."otp_verifications" USING "btree" ("identifier", "purpose");



CREATE INDEX "idx_profile_stats_profile" ON "public"."advisor_profile_stats" USING "btree" ("profile_id");



CREATE INDEX "idx_recommendations_advisor_status" ON "public"."advisor_recommendations" USING "btree" ("advisor_id", "status");



CREATE INDEX "idx_share_events_advisor" ON "public"."advisor_share_events" USING "btree" ("advisor_id", "share_type");



CREATE INDEX "idx_testimonials_advisor_status" ON "public"."advisor_testimonials" USING "btree" ("advisor_id", "status");



CREATE INDEX "idx_users_account_status" ON "public"."users" USING "btree" ("account_status");



CREATE INDEX "idx_users_active" ON "public"."users" USING "btree" ("is_active");



CREATE INDEX "idx_users_deactivated_until" ON "public"."users" USING "btree" ("deactivated_until");



CREATE INDEX "idx_users_email_verified" ON "public"."users" USING "btree" ("email_verified");



CREATE INDEX "idx_users_mobile_verified" ON "public"."users" USING "btree" ("mobile_verified");



CREATE INDEX "idx_users_roles" ON "public"."users" USING "gin" ("roles");



CREATE UNIQUE INDEX "users_active_email_unique" ON "public"."users" USING "btree" ("email") WHERE (("email" IS NOT NULL) AND ("account_status" = 'active'::"text"));



CREATE UNIQUE INDEX "users_active_mobile_unique" ON "public"."users" USING "btree" ("mobile") WHERE ("account_status" = 'active'::"text");



CREATE OR REPLACE TRIGGER "advisor_prospects_updated_at" BEFORE UPDATE ON "public"."advisor_prospects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "advisor_scores_updated_at" BEFORE UPDATE ON "public"."advisor_scores" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



CREATE OR REPLACE TRIGGER "set_yvity_testimonials_updated_at" BEFORE UPDATE ON "public"."yvity_testimonials" FOR EACH ROW EXECUTE FUNCTION "public"."set_yvity_testimonials_updated_at"();



CREATE OR REPLACE TRIGGER "users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at"();



ALTER TABLE ONLY "public"."admin_otps"
    ADD CONSTRAINT "admin_otps_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."admin_users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."advisor_journey"
    ADD CONSTRAINT "advisor_journey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."advisor_login_activity"
    ADD CONSTRAINT "advisor_login_activity_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."advisor_payments"
    ADD CONSTRAINT "advisor_payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."advisor_profiles"
    ADD CONSTRAINT "advisor_profiles_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."advisor_profiles"
    ADD CONSTRAINT "advisor_profiles_advisor_role_id_fkey" FOREIGN KEY ("advisor_role_id") REFERENCES "public"."advisor_roles"("id");



ALTER TABLE ONLY "public"."advisor_prospects"
    ADD CONSTRAINT "advisor_prospects_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."advisor_recommendations"
    ADD CONSTRAINT "advisor_recommendations_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."advisor_roles"
    ADD CONSTRAINT "advisor_roles_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."advisor_scores"
    ADD CONSTRAINT "advisor_scores_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."advisor_share_events"
    ADD CONSTRAINT "advisor_share_events_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."advisor_share_events"
    ADD CONSTRAINT "advisor_share_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."advisor_testimonials"
    ADD CONSTRAINT "advisor_testimonials_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."saved_profiles"
    ADD CONSTRAINT "saved_profiles_advisor_profile_id_fkey" FOREIGN KEY ("advisor_profile_id") REFERENCES "public"."advisor_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_profiles"
    ADD CONSTRAINT "saved_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."testimonial_otps"
    ADD CONSTRAINT "testimonial_otps_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_advisor_id_fkey" FOREIGN KEY ("advisor_id") REFERENCES "public"."advisor_profiles"("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can read their own data" ON "public"."admin_users" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Only super admin can delete" ON "public"."admin_users" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "admin_users_1"
  WHERE (("admin_users_1"."user_id" = "auth"."uid"()) AND ("admin_users_1"."role" = 'super_admin'::"public"."admin_role")))));



CREATE POLICY "Only super admin can insert" ON "public"."admin_users" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "admin_users_1"
  WHERE (("admin_users_1"."user_id" = "auth"."uid"()) AND ("admin_users_1"."role" = 'super_admin'::"public"."admin_role")))));



CREATE POLICY "Only super admin can update" ON "public"."admin_users" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "admin_users_1"
  WHERE (("admin_users_1"."user_id" = "auth"."uid"()) AND ("admin_users_1"."role" = 'super_admin'::"public"."admin_role")))));



CREATE POLICY "Super admin full access" ON "public"."admin_users" USING ((EXISTS ( SELECT 1
   FROM "public"."admin_users" "admin_users_1"
  WHERE (("admin_users_1"."user_id" = "auth"."uid"()) AND ("admin_users_1"."role" = 'super_admin'::"public"."admin_role")))));



ALTER TABLE "public"."admin_otps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_gallery" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_journey" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_login_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_profile_stats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_prospects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_scores" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_services" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_share_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."advisor_testimonials" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_own_profile" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "no_direct_access" ON "public"."otp_verifications" TO "authenticated" USING (false) WITH CHECK (false);



ALTER TABLE "public"."otp_verifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "own login activity all" ON "public"."advisor_login_activity" USING (("auth"."uid"() = "advisor_id")) WITH CHECK (("auth"."uid"() = "advisor_id"));



CREATE POLICY "own prospects all" ON "public"."advisor_prospects" TO "authenticated" USING (("auth"."uid"() = "advisor_id")) WITH CHECK (("auth"."uid"() = "advisor_id"));



CREATE POLICY "own share events all" ON "public"."advisor_share_events" USING (("auth"."uid"() = "advisor_id")) WITH CHECK (("auth"."uid"() = "advisor_id"));



CREATE POLICY "read own score" ON "public"."advisor_scores" FOR SELECT USING (("auth"."uid"() = "advisor_id"));



ALTER TABLE "public"."saved_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select_own_profile" ON "public"."users" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."testimonial_otps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "update_own_profile" ON "public"."users" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."yvity_testimonials" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."clean_expired_device_tokens"() TO "anon";
GRANT ALL ON FUNCTION "public"."clean_expired_device_tokens"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."clean_expired_device_tokens"() TO "service_role";



GRANT ALL ON FUNCTION "public"."clean_expired_otps"() TO "anon";
GRANT ALL ON FUNCTION "public"."clean_expired_otps"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."clean_expired_otps"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cleanup_expired_admin_otps"() TO "anon";
GRANT ALL ON FUNCTION "public"."cleanup_expired_admin_otps"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cleanup_expired_admin_otps"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_otp"("p_identifier" "text", "p_purpose" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_otp"("p_identifier" "text", "p_purpose" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_otp"("p_identifier" "text", "p_purpose" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_achievement_score"("p_advisor" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_achievement_score"("p_advisor" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_achievement_score"("p_advisor" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_profile_strength_score"("p_advisor" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_profile_strength_score"("p_advisor" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profile_strength_score"("p_advisor" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_recommendation_score"("p_advisor" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_recommendation_score"("p_advisor" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_recommendation_score"("p_advisor" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_testimonial_score"("p_advisor" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_testimonial_score"("p_advisor" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_testimonial_score"("p_advisor" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_advisor_login_score"("p_advisor" "uuid", "p_login_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_advisor_login_score"("p_advisor" "uuid", "p_login_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_advisor_login_score"("p_advisor" "uuid", "p_login_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."process_month_end_advisor_login_scores"("p_target_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."process_month_end_advisor_login_scores"("p_target_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."process_month_end_advisor_login_scores"("p_target_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."recalculate_advisor_score"("p_advisor" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."recalculate_advisor_score"("p_advisor" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."recalculate_advisor_score"("p_advisor" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."reset_expired_advisor_plans"("run_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."reset_expired_advisor_plans"("run_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_expired_advisor_plans"("run_at" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_yvity_testimonials_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_yvity_testimonials_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_yvity_testimonials_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."verify_otp"("p_identifier" "text", "p_otp" "text", "p_purpose" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."verify_otp"("p_identifier" "text", "p_otp" "text", "p_purpose" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."verify_otp"("p_identifier" "text", "p_otp" "text", "p_purpose" "text") TO "service_role";



GRANT ALL ON TABLE "public"."admin_otps" TO "anon";
GRANT ALL ON TABLE "public"."admin_otps" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_otps" TO "service_role";



GRANT ALL ON TABLE "public"."admin_users" TO "anon";
GRANT ALL ON TABLE "public"."admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_achievements" TO "anon";
GRANT ALL ON TABLE "public"."advisor_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_achievements" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_gallery" TO "anon";
GRANT ALL ON TABLE "public"."advisor_gallery" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_gallery" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_journey" TO "anon";
GRANT ALL ON TABLE "public"."advisor_journey" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_journey" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_login_activity" TO "anon";
GRANT ALL ON TABLE "public"."advisor_login_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_login_activity" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_payments" TO "anon";
GRANT ALL ON TABLE "public"."advisor_payments" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_payments" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_profile_stats" TO "anon";
GRANT ALL ON TABLE "public"."advisor_profile_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_profile_stats" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_profiles" TO "anon";
GRANT ALL ON TABLE "public"."advisor_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_prospects" TO "anon";
GRANT ALL ON TABLE "public"."advisor_prospects" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_prospects" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_recommendations" TO "anon";
GRANT ALL ON TABLE "public"."advisor_recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_roles" TO "anon";
GRANT ALL ON TABLE "public"."advisor_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_roles" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_scores" TO "anon";
GRANT ALL ON TABLE "public"."advisor_scores" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_scores" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_services" TO "anon";
GRANT ALL ON TABLE "public"."advisor_services" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_services" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_share_events" TO "anon";
GRANT ALL ON TABLE "public"."advisor_share_events" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_share_events" TO "service_role";



GRANT ALL ON TABLE "public"."advisor_testimonials" TO "anon";
GRANT ALL ON TABLE "public"."advisor_testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."advisor_testimonials" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."city_counts" TO "anon";
GRANT ALL ON TABLE "public"."city_counts" TO "authenticated";
GRANT ALL ON TABLE "public"."city_counts" TO "service_role";



GRANT ALL ON TABLE "public"."company_counts" TO "anon";
GRANT ALL ON TABLE "public"."company_counts" TO "authenticated";
GRANT ALL ON TABLE "public"."company_counts" TO "service_role";



GRANT ALL ON TABLE "public"."otp_verifications" TO "anon";
GRANT ALL ON TABLE "public"."otp_verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."otp_verifications" TO "service_role";



GRANT ALL ON TABLE "public"."saved_profiles" TO "anon";
GRANT ALL ON TABLE "public"."saved_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."saved_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."service_counts" TO "anon";
GRANT ALL ON TABLE "public"."service_counts" TO "authenticated";
GRANT ALL ON TABLE "public"."service_counts" TO "service_role";



GRANT ALL ON TABLE "public"."testimonial_otps" TO "anon";
GRANT ALL ON TABLE "public"."testimonial_otps" TO "authenticated";
GRANT ALL ON TABLE "public"."testimonial_otps" TO "service_role";



GRANT ALL ON TABLE "public"."testimonials" TO "anon";
GRANT ALL ON TABLE "public"."testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."testimonials" TO "service_role";



GRANT ALL ON TABLE "public"."yvity_testimonials" TO "anon";
GRANT ALL ON TABLE "public"."yvity_testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."yvity_testimonials" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


-- =============================================================================
-- YVITY Gold bridge (settings + lead CRM metadata)
-- =============================================================================

ALTER TABLE public.advisor_profiles
  ADD COLUMN IF NOT EXISTS gold_settings jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.advisor_prospects
  ADD COLUMN IF NOT EXISTS gold_meta jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.advisor_profiles.gold_settings IS
  'YVITY-Gold: visibility, contact, leads, notifications, publicProfile, appearance, introVideo';

COMMENT ON COLUMN public.advisor_prospects.gold_meta IS
  'YVITY-Gold leads: status, priority, channel, followUp, serviceType, origin, etc.';


-- =============================================================================
-- OPTIONAL SEED — run manually after schema succeeds
-- Replace :auth_user_id with a real auth.users.id (create admin via Supabase Auth first)
-- =============================================================================
/*
-- Default advisor roles (required for profile submit — FK advisor_profiles.advisor_role_id)
INSERT INTO public.advisor_roles (id, created_by_id, title, description, is_available, icon)
VALUES
  ('00000000-0000-4000-8000-000000000001'::uuid, :auth_user_id, 'Life Insurance Advisor', 'Life & term plans', true, 'life'),
  ('00000000-0000-4000-8000-000000000002'::uuid, :auth_user_id, 'Health Insurance Advisor', 'Health & mediclaim', true, 'health'),
  ('00000000-0000-4000-8000-000000000003'::uuid, :auth_user_id, 'General Insurance Advisor', 'Motor & general', true, 'general')
ON CONFLICT (id) DO NOTHING;

-- Dev admin (Dashboard login) — phone must match E.164
INSERT INTO public.admin_users (id, phone_number, role, permissions, is_active, name)
VALUES (
  gen_random_uuid(),
  '+919876543210',
  'super_admin',
  '{}'::jsonb,
  true,
  'Local Admin'
)
ON CONFLICT (phone_number) DO NOTHING;
*/


-- =============================================================================
-- YVITY Gold JSON (.data) → Supabase table mapping
-- =============================================================================
-- registration.json              → users (+ auth.users)
-- advisor-profiles.json          → advisor_profiles
-- advisor-payments.json          → advisor_payments
-- leads.json                     → advisor_prospects (+ gold_meta)
-- career-{userId}.json           → advisor_journey
-- services-{userId}.json         → advisor_services
-- achievements-{userId}.json     → advisor_achievements
-- testimonials-{userId}.json     → advisor_testimonials
-- gallery-{userId}.json          → advisor_gallery
-- advisor-settings-{userId}.json → advisor_profiles.gold_settings + visibility columns
-- services.json (admin queue)    → verification workflow (app-level; not a separate table)




