-- Admin controls: admin reply/note on complaints + student email on profiles.
-- Run once: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run. Safe to re-run.

-- 1. Admin reply (visible to the student who filed the complaint)
alter table public.complaints
  add column if not exists admin_note text check (admin_note is null or char_length(admin_note) <= 1000);

grant update (status, admin_note) on public.complaints to authenticated;

-- 2. Store email on profiles so admins never see "Unknown student"
alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
