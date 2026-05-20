create table if not exists public.assessment_access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bank_version text not null,
  status text not null default 'active' check (status in ('active', 'revoked')),
  granted_at timestamptz not null default timezone('utc', now()),
  granted_by text not null default 'admin',
  revoked_at timestamptz,
  revoked_by text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint assessment_access_grants_user_bank_unique unique (user_id, bank_version)
);

create index if not exists assessment_access_grants_user_id_idx
  on public.assessment_access_grants (user_id);

drop trigger if exists assessment_access_grants_set_updated_at on public.assessment_access_grants;
create trigger assessment_access_grants_set_updated_at
before update on public.assessment_access_grants
for each row
execute function public.set_updated_at();

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bank_version text not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted', 'expired')),
  score_version text not null default 'v1',
  time_limit_seconds integer not null,
  started_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz not null,
  last_activity_at timestamptz not null default timezone('utc', now()),
  submitted_at timestamptz,
  raw_totals jsonb not null default '{}'::jsonb,
  normalized_totals jsonb not null default '{}'::jsonb,
  aptitude_index numeric(5,2),
  psychometric_index numeric(5,2),
  overall_index numeric(5,2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists assessment_attempts_user_id_idx
  on public.assessment_attempts (user_id, created_at desc);

-- Only one active attempt per user+bank_version
create unique index if not exists assessment_attempts_one_active_idx
  on public.assessment_attempts (user_id, bank_version)
  where (status = 'in_progress');

drop trigger if exists assessment_attempts_set_updated_at on public.assessment_attempts;
create trigger assessment_attempts_set_updated_at
before update on public.assessment_attempts
for each row
execute function public.set_updated_at();

create table if not exists public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  selected_option_id text,
  time_spent_seconds integer,
  contribution_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint assessment_responses_attempt_question_unique unique (attempt_id, question_id)
);

create index if not exists assessment_responses_attempt_id_idx
  on public.assessment_responses (attempt_id);

create index if not exists assessment_responses_user_id_idx
  on public.assessment_responses (user_id);

drop trigger if exists assessment_responses_set_updated_at on public.assessment_responses;
create trigger assessment_responses_set_updated_at
before update on public.assessment_responses
for each row
execute function public.set_updated_at();

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  bank_version text not null,
  score_version text not null,
  aptitude_scores jsonb not null default '{}'::jsonb,
  psychometric_scores jsonb not null default '{}'::jsonb,
  aptitude_index numeric(5,2) not null,
  psychometric_index numeric(5,2) not null,
  overall_index numeric(5,2) not null,
  career_matches jsonb not null default '[]'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists assessment_results_attempt_unique_idx
  on public.assessment_results (attempt_id);

create index if not exists assessment_results_user_id_idx
  on public.assessment_results (user_id, created_at desc);

alter table public.assessment_access_grants enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.assessment_results enable row level security;

-- Grants: users can read their own grant status.
drop policy if exists "assessment_access_grants_select_own" on public.assessment_access_grants;
create policy "assessment_access_grants_select_own"
on public.assessment_access_grants
for select
to authenticated
using (auth.uid() = user_id);

-- Attempts: users can manage their own.
drop policy if exists "assessment_attempts_select_own" on public.assessment_attempts;
create policy "assessment_attempts_select_own"
on public.assessment_attempts
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "assessment_attempts_insert_own" on public.assessment_attempts;
create policy "assessment_attempts_insert_own"
on public.assessment_attempts
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "assessment_attempts_update_own" on public.assessment_attempts;
create policy "assessment_attempts_update_own"
on public.assessment_attempts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Responses: users can manage their own; enforce attempt ownership.
drop policy if exists "assessment_responses_select_own" on public.assessment_responses;
create policy "assessment_responses_select_own"
on public.assessment_responses
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "assessment_responses_insert_own" on public.assessment_responses;
create policy "assessment_responses_insert_own"
on public.assessment_responses
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.assessment_attempts a
    where a.id = attempt_id and a.user_id = auth.uid()
  )
);

drop policy if exists "assessment_responses_update_own" on public.assessment_responses;
create policy "assessment_responses_update_own"
on public.assessment_responses
for update
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1 from public.assessment_attempts a
    where a.id = attempt_id and a.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.assessment_attempts a
    where a.id = attempt_id and a.user_id = auth.uid()
  )
);

-- Results: users can read their own results.
drop policy if exists "assessment_results_select_own" on public.assessment_results;
create policy "assessment_results_select_own"
on public.assessment_results
for select
to authenticated
using (auth.uid() = user_id);
