alter table public.advisor_profiles
add column if not exists profile_slug text;

with base_slugs as (
  select
    ap.id,
    coalesce(
      nullif(
        trim(
          both '-'
          from regexp_replace(
            regexp_replace(lower(coalesce(u.name, 'advisor')), '[^a-z0-9\s-]', '', 'g'),
            '\s+',
            '-',
            'g'
          )
        ),
        ''
      ),
      'advisor'
    ) as base_slug
  from public.advisor_profiles ap
  join public.users u
    on u.id = ap.advisor_id
),
ranked_slugs as (
  select
    id,
    base_slug,
    row_number() over (partition by base_slug order by id) as slug_rank
  from base_slugs
)
update public.advisor_profiles ap
set profile_slug = case
  when rs.slug_rank = 1 then rs.base_slug
  else rs.base_slug || '-' || rs.slug_rank
end
from ranked_slugs rs
where ap.id = rs.id
  and ap.profile_slug is null;

create unique index if not exists idx_advisor_profiles_profile_slug
on public.advisor_profiles using btree (profile_slug)
where profile_slug is not null;
