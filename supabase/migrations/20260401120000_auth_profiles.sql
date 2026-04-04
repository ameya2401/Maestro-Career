create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default 'Learner',
  mobile text not null,
  country_code text not null default '+1',
  date_of_birth date,
  terms_accepted_at timestamptz not null,
  onboarding_completed boolean not null default false,
  preferred_services text[] not null default '{}',
  user_type text,
  study_field text,
  domain text,
  company_role text,
  city text,
  last_login_at timestamptz,
  last_login_method text,
  login_count integer not null default 0,
  inquiry_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_user_type_check check (user_type is null or user_type in ('student', 'working_professional')),
  constraint profiles_last_login_method_check check (last_login_method is null or last_login_method in ('otp', 'password'))
);

create table if not exists public.auth_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  message text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint auth_activity_type_check check (type in ('registration', 'login', 'profile', 'password_reset'))
);

create index if not exists auth_activity_user_id_created_at_idx
  on public.auth_activity (user_id, created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.auth_activity enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "auth_activity_select_own" on public.auth_activity;
create policy "auth_activity_select_own"
on public.auth_activity
for select
to authenticated
using (auth.uid() = user_id);
