create table if not exists public.admin_otps (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_users(id) on delete cascade,
  otp text not null,
  purpose text default 'login',
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Index for fast cleanup + queries
create index if not exists idx_admin_otps_expires
on public.admin_otps(expires_at);


create or replace function public.cleanup_expired_admin_otps()
returns void
language plpgsql
as $$
begin
  delete from public.admin_otps
  where expires_at < now();
end;
$$;

select cron.schedule(
  'cleanup-admin-otps',
  '* * * * *', -- every minute
  $$select public.cleanup_expired_admin_otps();$$
);