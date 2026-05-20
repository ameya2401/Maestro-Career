# Secure Internal Assessment Plan

## Summary
- Replace the current public `demo-test` prototype flow with a real internal `/test` flow that requires Supabase login plus an admin-issued access grant.
- Build a versioned 50-question assessment from the document’s Section A and Section B only. Ignore the cluster taxonomy in the UI and scoring model.
- Keep the existing external `psychometric_test_link` flow supported, but add a separate protected internal test grant so the new test cannot be opened just by typing `/test`.
- Move all scoring, timer enforcement, result generation, and result storage to the server/Supabase. The browser should only render questions and submit answers.

## Key Changes
- Routing and access:
  - Add a protected `/test` route family and extend `middleware.ts` to include `/test/:path*` and `/api/test/:path*`.
  - `/test` must redirect anonymous users to `/login?next=/test`.
  - Logged-in users without an active internal grant must see an access-pending/forbidden state, not the questions.
  - Add admin controls in the existing admin dashboard to `Grant Access`, `Revoke Access`, and view attempt status for the internal test.
  - Keep the current pasted `psychometric_test_link` field visible and working as a parallel legacy/manual option.
- Question bank:
  - Replace `src/data/mockQuestions.ts` for the real flow with a versioned bank such as `prototype-1-v1`.
  - Complete the bank to 25 aptitude questions and 25 psychometric questions using the document’s written questions plus authored completions for the placeholder ranges.
  - Use only Section A and Section B content. Do not render or score the cluster section.
  - Keep question order fixed in v1 to preserve document alignment and reporting consistency.
- Trait mapping and scoring:
  - Aptitude dimensions: `logical_reasoning`, `numerical_ability`, `analytical_thinking`, `pattern_recognition`, `verbal_ability`, `problem_solving`, `decision_making`.
  - Psychometric dimensions: `leadership`, `creativity`, `emotional_stability`, `communication`, `social_intelligence`, `empathy`, `adaptability`, `discipline`, `risk_taking`, `curiosity`, `attention_to_detail`, `pressure_handling`.
  - Every option must carry explicit contribution weights so every selection changes the final result.
  - Aptitude questions should still store a `correctOptionId`, but wrong answers must still produce smaller diagnostic contributions instead of being ignored.
  - Use no negative scoring in v1; keep the outcome constructive.
  - Normalize aptitude and psychometric dimensions independently to `0-100`.
  - Compute `aptitudeIndex = mean(aptitude dimensions)`.
  - Compute `psychometricIndex = mean(psychometric dimensions)`.
  - Compute `overallIndex = aptitudeIndex * 0.5 + psychometricIndex * 0.5`.
- Dynamic direct-career mapping:
  - Ignore cluster grouping and flatten recommendations into direct career profiles.
  - V1 career catalog: `Doctor`, `Psychologist`, `Software Engineer`, `Data Scientist`, `Lawyer`, `Public Policy Analyst`, `Chartered Accountant`, `Entrepreneur`, `Graphic Designer`, `Teacher`, `Journalist`, `Architect`.
  - Each career profile should define target dimension scores plus per-dimension weights.
  - Compute compatibility with `careerCompatibility = Σ(weight_i * (100 - abs(userScore_i - target_i)))`.
  - Bucket outcomes into `Best Career Choices` (top 3 with score >= 85), `Strong Career Matches` (70-84), `Alternative Career Paths` (55-69), `Less Suitable Careers` (<55, phrased softly), and `Areas Requiring Improvement` (user dimensions <45).
  - Tie-break career scores by higher `psychometricIndex`, then higher `aptitudeIndex`, then alphabetical title.
- Timer logic:
  - Use one whole-test timer for the full assessment, not per-question timers.
  - Total duration in v1: `50 minutes`, derived from the current demo’s `60 seconds per question`.
  - Persist `started_at`, `expires_at`, and `last_activity_at` server-side.
  - On reload, restore the active attempt and recompute remaining time from `expires_at`.
  - On expiry, auto-submit saved answers and mark unanswered questions as omitted.
- Supabase storage:
  - Add `assessment_access_grants` for per-user internal test access state, bank version, admin grant metadata, and lifecycle status.
  - Add `assessment_attempts` for attempt lifecycle, timer fields, raw totals, normalized totals, and score version.
  - Add `assessment_responses` for per-question answer storage, selected option, time spent, and contribution snapshot JSON.
  - Add `assessment_results` for final aptitude scores, trait scores, career matches, summary payload, and generated timestamps.
  - Add RLS so users can access only their own grant, attempts, responses, and results; admin/service-role paths can manage grants and read all records.
- UI and reporting:
  - Build `/test` as the internal assessment experience with instructions, progress, autosave, timer, and submit flow.
  - Build `/test/result/[attemptId]` from stored Supabase results instead of browser `localStorage`.
  - Update the user dashboard to show internal test status: `Awaiting Admin Access`, `Ready to Start`, `In Progress`, `Completed`.
  - Preserve the external link card for the legacy/manual flow while adding a new internal-test card.
  - Refactor the PDF generation path so it reads stored result data and can align with the document’s 12-page report structure.

## Public APIs and Interfaces
- `AssessmentQuestion`: `id`, `section`, `category`, `prompt`, `options`, `correctOptionId?`, `dimensionWeights`, `version`.
- `AssessmentOption`: `id`, `label`, `text`, `contributions`, `isPreferred?`.
- `CareerProfile`: `id`, `title`, `targetScores`, `weights`, `summary`, `recommendedSkills`, `growthPotential`.
- `GET /api/test/access`: return auth state, grant state, latest attempt summary.
- `POST /api/test/start`: create or resume the caller’s active attempt.
- `PATCH /api/test/response`: save one response and timer heartbeat.
- `POST /api/test/submit`: finalize attempt, calculate result, persist result, return `attemptId` and `resultId`.
- `GET /api/test/result/[attemptId]`: return the caller’s stored result snapshot.

## Test Plan
- Verify `/test` redirects unauthenticated users to login and never leaks question data.
- Verify logged-in users without grants cannot access `/test` even by typing the URL directly.
- Verify admin grant/revoke changes dashboard state and API access immediately.
- Verify one active attempt resumes correctly after refresh, browser close, and login re-entry.
- Verify timer expiry auto-submits and produces the same result as a manual submit with the same saved responses.
- Verify every option in every question changes at least one stored contribution value.
- Verify normalization and the 50/50 aptitude-psychometric weighting with deterministic scorer tests.
- Verify career ranking buckets and tie-break behavior with fixed score fixtures.
- Verify Supabase RLS blocks cross-user reads/writes for attempts, responses, and results.
- Verify stored results drive both the result page and PDF generation without browser recomputation.

## Assumptions and Defaults
- Internal access grants are only exposed in admin UI for users whose `payment_status` is already `paid`, to stay consistent with the current business flow.
- The existing `psychometric_test_link` field remains supported during migration; the new internal `/test` flow is an additional controlled path.
- The missing Section A and Section B placeholder questions will be authored in the same tone, difficulty, and 4-option structure as the document.
- V1 supports one active attempt per user per question-bank version.
- V1 uses fixed ordering, no randomization, and no negative marking.
