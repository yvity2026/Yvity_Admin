create table advisor_roles (
  id uuid primary key default gen_random_uuid(),
  created_by_id uuid not null references auth.users(id),
  title text not null default 'Insurance Advisor',
  description text,
  is_available boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- RLS POLICIES
-- alter table advisor_roles enable row level security;
-- -- any one can view the roles
-- create policy "Anyone can view all advisor roles"
-- on advisor_roles
-- for select
-- using (true);

-- -- admin can only update roles : 
-- create policy "Only admin can update advisor roles"
-- on advisor_roles
-- for update
-- using ((auth.jwt() ->> 'role') = 'admin')
-- with check ((auth.jwt() ->> 'role') = 'admin');

-- -- Admin can only delete roles : 
-- create policy "Only admin can delete advisor roles"
-- on advisor_roles
-- for delete
-- using ((auth.jwt() ->> 'role') = 'admin');

-- -- Admin can only insert roles : 
-- create policy "Only admin can create advisor roles"
-- on advisor_roles
-- for insert
-- with check ((auth.jwt() ->> 'role') = 'admin');