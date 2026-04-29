-- Supabase commonly installs pgcrypto functions in the extensions schema.
-- Qualify crypt/gen_salt so OTP creation and verification work with a locked
-- function search_path.

create or replace function create_otp(
  p_identifier text,
  p_purpose text
)
returns text
language plpgsql
security definer
set search_path = public, extensions
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
    extensions.crypt(generated_otp, extensions.gen_salt('bf')),
    p_purpose,
    now() + interval '5 minutes'
  );

  return generated_otp;
end;
$$;

create or replace function verify_otp(
  p_identifier text,
  p_otp text,
  p_purpose text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
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

grant execute on function create_otp(text, text) to authenticated;
grant execute on function verify_otp(text, text, text) to authenticated;
