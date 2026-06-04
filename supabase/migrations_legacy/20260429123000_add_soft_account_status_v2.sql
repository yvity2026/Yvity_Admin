-- Soft account status for advisor danger-zone actions.
-- Deleted/deactivated rows stay in the database, while auth/register flows can
-- ignore non-active accounts and allow a new active account with the same mobile.

alter table public.users
add column if not exists account_status text not null default 'active'
check (account_status in ('active', 'deactivated', 'deleted'));

alter table public.users
add column if not exists deactivated_until timestamptz null;

alter table public.users
add column if not exists deleted_at timestamptz null;

alter table public.users
add column if not exists account_status_updated_at timestamptz null;

alter table public.users
add column if not exists account_status_reason text null;

alter table public.users
add column if not exists original_mobile varchar(10) null;

alter table public.users
add column if not exists original_email text null;

create index if not exists idx_users_account_status
on public.users(account_status);

create index if not exists idx_users_deactivated_until
on public.users(deactivated_until);

do $$
declare
  constraint_name text;
begin
  select tc.constraint_name
  into constraint_name
  from information_schema.table_constraints tc
  join information_schema.constraint_column_usage ccu
    on ccu.constraint_name = tc.constraint_name
   and ccu.table_schema = tc.table_schema
  where tc.table_schema = 'public'
    and tc.table_name = 'users'
    and tc.constraint_type = 'UNIQUE'
    and ccu.column_name = 'mobile'
  limit 1;

  if constraint_name is not null then
    execute format('alter table public.users drop constraint %I', constraint_name);
  end if;

  select tc.constraint_name
  into constraint_name
  from information_schema.table_constraints tc
  join information_schema.constraint_column_usage ccu
    on ccu.constraint_name = tc.constraint_name
   and ccu.table_schema = tc.table_schema
  where tc.table_schema = 'public'
    and tc.table_name = 'users'
    and tc.constraint_type = 'UNIQUE'
    and ccu.column_name = 'email'
  limit 1;

  if constraint_name is not null then
    execute format('alter table public.users drop constraint %I', constraint_name);
  end if;
end $$;

create unique index if not exists users_active_mobile_unique
on public.users(mobile)
where account_status = 'active';

create unique index if not exists users_active_email_unique
on public.users(email)
where email is not null and account_status = 'active';

alter table public.otp_verifications
drop constraint if exists otp_verifications_purpose_check;

alter table public.otp_verifications
add constraint otp_verifications_purpose_check
check (
  purpose in (
    'signup',
    'login',
    'password_reset',
    'verify_email',
    'verify_mobile',
    'deactivate_account',
    'delete_account'
  )
);
