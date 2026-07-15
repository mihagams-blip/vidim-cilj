-- Vidim cilj CMS: uredniki, vsebine strani, novice, revizije in mediji.
-- Zaženite celotno datoteko v Supabase SQL Editorju.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key check (email = lower(email)),
  role text not null default 'editor' check (role in ('admin', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_sections (
  section_key text not null,
  locale text not null default 'sl' check (locale in ('sl', 'en')),
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (section_key, locale)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 180),
  excerpt text not null default '' check (char_length(excerpt) <= 500),
  body text not null default '',
  category text not null default 'Aktualno' check (char_length(category) <= 80),
  cover_image_url text,
  cover_image_alt text,
  image_credit text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_posts_have_content check (
    status = 'draft' or (
      char_length(trim(excerpt)) > 0 and
      char_length(trim(body)) > 0 and
      published_at is not null and
      (cover_image_url is null or char_length(trim(coalesce(cover_image_alt, ''))) > 0)
    )
  )
);

create index if not exists posts_publication_idx
  on public.posts (status, published_at desc);

create table if not exists public.content_revisions (
  id bigint generated always as identity primary key,
  section_key text not null,
  locale text not null,
  content jsonb not null,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create table if not exists public.post_revisions (
  id bigint generated always as identity primary key,
  post_id uuid not null,
  snapshot jsonb not null,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create or replace function public.current_editor_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.admin_users
  where email = lower(coalesce(auth.jwt() ->> 'email', ''))
    and active = true
  limit 1;
$$;

revoke all on function public.current_editor_role() from public;
grant execute on function public.current_editor_role() to anon, authenticated;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_editor_role() in ('admin', 'editor');
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_editor_role() = 'admin';
$$;

revoke all on function public.is_editor() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_editor() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.archive_site_section()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.content_revisions(section_key, locale, content, changed_by)
  values (old.section_key, old.locale, old.content, auth.uid());
  return new;
end;
$$;

create or replace function public.archive_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.post_revisions(post_id, snapshot, changed_by)
  values (old.id, to_jsonb(old), auth.uid());
  return new;
end;
$$;

drop trigger if exists site_sections_touch_updated_at on public.site_sections;
create trigger site_sections_touch_updated_at
before update on public.site_sections
for each row execute function public.touch_updated_at();

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
before update on public.posts
for each row execute function public.touch_updated_at();

drop trigger if exists site_sections_archive_update on public.site_sections;
create trigger site_sections_archive_update
before update on public.site_sections
for each row when (old.content is distinct from new.content)
execute function public.archive_site_section();

drop trigger if exists posts_archive_update on public.posts;
create trigger posts_archive_update
before update on public.posts
for each row execute function public.archive_post();

alter table public.admin_users enable row level security;
alter table public.site_sections enable row level security;
alter table public.posts enable row level security;
alter table public.content_revisions enable row level security;
alter table public.post_revisions enable row level security;

grant select on public.site_sections, public.posts to anon;
grant select, insert, update, delete on public.admin_users, public.site_sections, public.posts to authenticated;
grant select on public.content_revisions, public.post_revisions to authenticated;

drop policy if exists "Editors see own access" on public.admin_users;
create policy "Editors see own access" on public.admin_users
for select to authenticated
using (email = lower(coalesce(auth.jwt() ->> 'email', '')) or public.is_admin());

drop policy if exists "Admins manage access" on public.admin_users;
create policy "Admins manage access" on public.admin_users
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public reads site content" on public.site_sections;
create policy "Public reads site content" on public.site_sections
for select to anon, authenticated using (true);

drop policy if exists "Editors insert site content" on public.site_sections;
create policy "Editors insert site content" on public.site_sections
for insert to authenticated with check (public.is_editor());

drop policy if exists "Editors update site content" on public.site_sections;
create policy "Editors update site content" on public.site_sections
for update to authenticated using (public.is_editor()) with check (public.is_editor());

drop policy if exists "Public reads published posts" on public.posts;
create policy "Public reads published posts" on public.posts
for select to anon
using (status = 'published' and published_at <= now());

drop policy if exists "Editors read all posts" on public.posts;
create policy "Editors read all posts" on public.posts
for select to authenticated using (public.is_editor());

drop policy if exists "Editors insert posts" on public.posts;
create policy "Editors insert posts" on public.posts
for insert to authenticated with check (public.is_editor());

drop policy if exists "Editors update posts" on public.posts;
create policy "Editors update posts" on public.posts
for update to authenticated using (public.is_editor()) with check (public.is_editor());

drop policy if exists "Editors delete posts" on public.posts;
create policy "Editors delete posts" on public.posts
for delete to authenticated using (public.is_editor());

drop policy if exists "Editors read content revisions" on public.content_revisions;
create policy "Editors read content revisions" on public.content_revisions
for select to authenticated using (public.is_editor());

drop policy if exists "Editors read post revisions" on public.post_revisions;
create policy "Editors read post revisions" on public.post_revisions
for select to authenticated using (public.is_editor());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-media',
  'public-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Editors upload public media" on storage.objects;
create policy "Editors upload public media" on storage.objects
for insert to authenticated
with check (bucket_id = 'public-media' and public.is_editor());

drop policy if exists "Editors update public media" on storage.objects;
create policy "Editors update public media" on storage.objects
for update to authenticated
using (bucket_id = 'public-media' and public.is_editor())
with check (bucket_id = 'public-media' and public.is_editor());

drop policy if exists "Editors delete public media" on storage.objects;
create policy "Editors delete public media" on storage.objects
for delete to authenticated
using (bucket_id = 'public-media' and public.is_editor());

-- Po migraciji v ločenem SQL ukazu dodajte prvi račun in zamenjajte naslov:
-- insert into public.admin_users(email, role) values ('vas.email@gmail.com', 'admin');
