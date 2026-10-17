-- CampusCare initial schema.
-- Run once: Supabase Dashboard -> SQL Editor -> New query -> paste this file -> Run.
-- Safe to run again (it is written to be repeatable).

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

-- One profile per signed-up user. The "role" column decides who is an admin.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 5 and 120),
  category text not null check (
    category in ('academic', 'hostel', 'facilities', 'library', 'transport', 'other')
  ),
  description text not null check (char_length(description) between 20 and 2000),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'resolved', 'rejected')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists complaints_student_idx
  on public.complaints (student_id, created_at desc);
create index if not exists complaints_status_idx
  on public.complaints (status, created_at desc);

-- ---------------------------------------------------------------------------
-- 2. Functions and triggers
-- ---------------------------------------------------------------------------

-- Create a profile automatically when someone signs up.
-- The role is ALWAYS 'student' here; nobody can pick "admin" at signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh whenever a complaint changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists complaints_set_updated_at on public.complaints;
create trigger complaints_set_updated_at
  before update on public.complaints
  for each row execute function public.set_updated_at();

-- True when the signed-in user is an admin. Used by the security policies below.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Create profiles for any users that signed up before this script ran.
insert into public.profiles (id, full_name)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', '')
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Row Level Security (RLS): who can see and change what
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.complaints enable row level security;

-- Table permissions (RLS policies below narrow these further).
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

revoke all on public.complaints from anon, authenticated;
grant select, insert on public.complaints to authenticated;
grant update (status) on public.complaints to authenticated; -- only the status can change

-- Profiles: read your own; admins read everyone's (to show student names).
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

-- Complaints: students see only their own; admins see all.
drop policy if exists "complaints_select" on public.complaints;
create policy "complaints_select" on public.complaints
  for select to authenticated
  using (student_id = (select auth.uid()) or public.is_admin());

-- Students can only create complaints for themselves, always starting as 'pending'.
drop policy if exists "complaints_insert" on public.complaints;
create policy "complaints_insert" on public.complaints
  for insert to authenticated
  with check (student_id = (select auth.uid()) and status = 'pending');

-- Only admins can update complaints (and only the status column, see grants above).
drop policy if exists "complaints_update" on public.complaints;
create policy "complaints_update" on public.complaints
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No delete policy: complaints are never deleted through the app.
