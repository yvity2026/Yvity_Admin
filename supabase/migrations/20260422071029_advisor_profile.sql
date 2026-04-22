create table advisor_profiles (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  advisor_role_id uuid not null,

  services jsonb not null default '[]',

  short_bio text,

  iridai_certificate_url text not null,

  is_verified boolean default false,

  created_at timestamp default now(),
  updated_at timestamp default now()
);