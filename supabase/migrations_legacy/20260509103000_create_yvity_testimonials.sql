create table if not exists public.yvity_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  profession text not null,
  city text not null,
  respondent_type text not null check (respondent_type in ('customer', 'advisor')),
  mobile_number varchar(10) not null,
  testimonial_type text not null check (testimonial_type in ('text', 'audio', 'video')),
  testimonial_rating integer not null check (testimonial_rating between 1 and 5),
  content text null,
  media_url text null,
  status text not null default 'submitted',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint yvity_testimonials_mobile_type_unique unique (mobile_number, testimonial_type),
  constraint yvity_testimonials_content_or_media_check check (
    (testimonial_type = 'text' and content is not null and media_url is null) or
    (testimonial_type in ('audio', 'video') and media_url is not null)
  )
);

create or replace function public.set_yvity_testimonials_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_yvity_testimonials_updated_at on public.yvity_testimonials;

create trigger set_yvity_testimonials_updated_at
before update on public.yvity_testimonials
for each row
execute function public.set_yvity_testimonials_updated_at();
