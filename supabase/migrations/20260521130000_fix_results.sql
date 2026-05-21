DROP TABLE IF EXISTS public.assessment_results CASCADE;

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
  on public.assessment_results (user_id);

ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own results" ON public.assessment_results FOR SELECT USING (auth.uid() = user_id);

-- Fix any attempts that were marked as submitted but failed to create a result
UPDATE public.assessment_attempts 
SET status = 'in_progress', submitted_at = NULL 
WHERE status = 'submitted' AND NOT EXISTS (
  SELECT 1 FROM public.assessment_results WHERE attempt_id = public.assessment_attempts.id
);
