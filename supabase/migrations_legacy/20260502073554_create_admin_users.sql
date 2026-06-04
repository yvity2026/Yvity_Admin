-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Admin roles enum
create type public.admin_role as enum ('super_admin', 'admin');

-- Admin table
create table public.admin_users (
    id uuid primary key default gen_random_uuid(),

    -- Link to Supabase auth
    user_id uuid references auth.users(id) on delete cascade,

    phone_number text unique not null,

    role public.admin_role not null default 'admin',

    -- Permissions (flexible JSON for future scaling)
    permissions jsonb default '{}'::jsonb,

    is_active boolean default true,

    last_login_at timestamptz,

    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    created_by uuid references public.admin_users(id),

    constraint phone_format check (phone_number ~ '^\+[1-9]\d{7,14}$')
);

-- Index for performance
create index idx_admin_users_user_id on public.admin_users(user_id);
create index idx_admin_users_role on public.admin_users(role);


alter table public.admin_users enable row level security;

create policy "Admins can read their own data"
on public.admin_users
for select
using (auth.uid() = user_id);

create policy "Super admin full access"
on public.admin_users
for all
using (
    exists (
        select 1 from public.admin_users
        where user_id = auth.uid()
        and role = 'super_admin'
    )
);

create policy "Only super admin can insert"
on public.admin_users
for insert
with check (
    exists (
        select 1 from public.admin_users
        where user_id = auth.uid()
        and role = 'super_admin'
    )
);

create policy "Only super admin can update"
on public.admin_users
for update
using (
    exists (
        select 1 from public.admin_users
        where user_id = auth.uid()
        and role = 'super_admin'
    )
);

create policy "Only super admin can delete"
on public.admin_users
for delete
using (
    exists (
        select 1 from public.admin_users
        where user_id = auth.uid()
        and role = 'super_admin'
    )
);