--------------------------------------------------
-- EXTENSIONS
--------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
create extension if not exists pg_cron;

--------------------------------------------------
-- USERS TABLE
--------------------------------------------------
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,

  mobile varchar(10) unique not null,
  name text not null,
  dob date,
  gender text check (gender in ('male', 'female', 'other')),

  email text unique,
  city text,
  profession text,

  selfie_url text,

  mobile_verified boolean default false,
  email_verified boolean default false,

  roles jsonb default '["customer"]'::jsonb,
  device_tokens jsonb default '[]'::jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function update_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at on users;

create trigger users_updated_at
before update on users
for each row
execute function update_updated_at();

create index if not exists idx_users_roles on users using gin(roles);

--------------------------------------------------
-- RLS (USERS)
--------------------------------------------------
alter table users enable row level security;

create policy "insert_own_profile"
on users
for insert
to authenticated
with check (auth.uid() = id);

create policy "select_own_profile"
on users
for select
to authenticated
using (auth.uid() = id);

create policy "update_own_profile"
on users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

--------------------------------------------------
-- DEVICE TOKEN CLEANUP
--------------------------------------------------
create or replace function clean_expired_device_tokens()
returns void
language plpgsql
security definer
set search_path = public
as $$
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

alter function clean_expired_device_tokens() owner to postgres;

grant execute on function clean_expired_device_tokens() to postgres;

-- avoid duplicate cron
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then

    perform cron.unschedule(jobid)
    from cron.job
    where jobname = 'clean-device-tokens-daily';

    perform cron.schedule(
      'clean-device-tokens-daily',
      '0 2 * * *',
      $cron$select public.clean_expired_device_tokens();$cron$
    );

  end if;
end;
$$;

--------------------------------------------------
-- OTP TABLE (SECURE)
--------------------------------------------------
create table if not exists otp_verifications (
  id uuid primary key default gen_random_uuid(),

  identifier text not null,
  otp_hash text not null,

  purpose text not null check (
    purpose in ('signup', 'login', 'password_reset', 'verify_email', 'verify_mobile')
  ),

  expires_at timestamptz not null,
  attempts int default 0,

  created_at timestamptz default now()
);

--------------------------------------------------
-- INDEXES (PERFORMANCE)
--------------------------------------------------
create index if not exists idx_otp_identifier_purpose
on otp_verifications(identifier, purpose);

create index if not exists idx_otp_expiry 
on otp_verifications(expires_at);

--------------------------------------------------
-- RLS (OTP BLOCKED)
--------------------------------------------------
alter table otp_verifications enable row level security;

create policy "no_direct_access"
on otp_verifications
for all
to authenticated
using (false)
with check (false);

--------------------------------------------------
-- CREATE OTP
--------------------------------------------------
create or replace function create_otp(
  p_identifier text,
  p_purpose text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
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
    crypt(generated_otp, gen_salt('bf')),
    p_purpose,
    now() + interval '5 minutes'
  );

  return generated_otp;
end;
$$;

--------------------------------------------------
-- VERIFY OTP
--------------------------------------------------
create or replace function verify_otp(
  p_identifier text,
  p_otp text,
  p_purpose text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
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

  if rec.otp_hash = crypt(p_otp, rec.otp_hash) then
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

grant execute on function create_otp(text, text) to authenticated;
grant execute on function verify_otp(text, text, text) to authenticated;

--------------------------------------------------
-- CLEAN OTP (AUTO)
--------------------------------------------------
create or replace function clean_expired_otps()
returns void
language sql
as $$
delete from otp_verifications
where expires_at < now();
$$;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then

    perform cron.unschedule(jobid)
    from cron.job
    where jobname = 'clean-otp';

    perform cron.schedule(
      'clean-otp',
      '*/10 * * * *',
      $cron$select public.clean_expired_otps();$cron$
    );

  end if;
end;
$$;