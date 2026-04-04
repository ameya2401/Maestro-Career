# Replace JSON/Mobile OTP Auth with Supabase Auth + Brevo Email OTP

## Summary

- Move auth off the local JSON/terminal OTP prototype and onto **Supabase Auth** for users, sessions, password login, and email OTP verification.
- Use **Brevo as Supabase Auth's SMTP provider**, so OTP/reset emails are delivered by Brevo but the app does not send OTP emails directly itself.
- Remove **all mobile OTP behavior**. Keep **mobile required** in registration as profile/contact data only, not as an auth identifier and not as a verification step.
- Launch as a **fresh production auth system** with no migration from `data/auth-prototype.json`.

## Key Changes

- Add Supabase helpers and session plumbing:
  - Add `@supabase/supabase-js` and `@supabase/ssr`.
  - Add server/client/admin helpers under a new `src/lib/supabase/` area.
  - Add `middleware.ts` to refresh Supabase auth cookies and protect authenticated routes like `/dashboard`.
- Replace the current custom auth core:
  - Retire the JSON-backed OTP/session logic in `src/lib/auth.ts` and the provider switcher in `src/lib/otp-delivery.ts`.
  - Keep only reusable validation/util pieces that still matter locally: name/email/mobile/password/date-of-birth validation and dashboard shaping.
- Create Supabase tables for app-specific profile data:
  - `public.profiles`: `id uuid pk -> auth.users.id`, `full_name`, `mobile`, `date_of_birth`, `terms_accepted_at`, `onboarding_completed`, `preferred_services text[]`, `user_type`, `study_field`, `domain`, `company_role`, `city`, `last_login_at`, `last_login_method`, `login_count`, timestamps.
  - `public.auth_activity`: `id`, `user_id`, `type`, `message`, `created_at`.
  - RLS: users can read/update only their own profile and own activity; server routes may use the service role for admin checks/upserts tied to auth events.
- Rebuild auth route behavior around Supabase:
  - Register request: validate input, reject already-confirmed email, `signUp` with email/password and metadata, or treat an unconfirmed existing signup as resend/update.
  - Register verify OTP: `verifyOtp`, upsert initial `profiles` row from signup metadata, log registration activity, leave user signed in.
  - Password login: `signInWithPassword` by **email only**.
  - Email OTP login request: `signInWithOtp({ email, options: { shouldCreateUser: false } })`.
  - Email OTP login verify: `verifyOtp`, update `last_login_at`, `last_login_method="otp"`, increment `login_count`, log activity.
  - Forgot password: replace OTP recovery with Supabase reset-email flow through Brevo SMTP.
  - Logout/me/profile setup: move to Supabase session lookup + `profiles`/`auth_activity` reads and writes.
- Update the auth UI:
  - In `src/app/auth/page.tsx`, change login choices to **Email + Password** and **Email + OTP**.
  - Registration step 1 still collects mobile, but step 2 says OTP was sent to email only and no longer asks for mobile/country code during verification.
  - Forgot-password UI becomes a single email entry + "check your email" confirmation instead of OTP entry/reset-token screens.
  - Remove all debug/mobile-OTP copy from the auth hero, forms, placeholders, and success messages.
- Keep the current dashboard/header contracts working:
  - Preserve `/api/auth/me` as the single place that combines Supabase user data with `profiles` and recent `auth_activity`, so `src/app/dashboard/page.tsx` and `src/components/Header.tsx` need only targeted auth-state adjustments, not a full rewrite.

## Public APIs / Interfaces

- Replace generic `identifier` auth payloads with explicit `email` fields for:
  - login password
  - login request OTP
  - login verify OTP
  - forgot password request
- Registration contracts become:
  - `POST /api/auth/register/request-otp`: `fullName`, `email`, `mobile`, `password`, `dateOfBirth`, `acceptedTerms`
  - `POST /api/auth/register/verify-otp`: `email`, `otp`
- `POST /api/auth/profile/setup` continues to save onboarding/profile fields, but now writes to Supabase `public.profiles`.
- New env surface in `.env.example`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL`
- Supabase dashboard config required:
  - email auth enabled
  - phone auth disabled
  - confirm-email enabled
  - custom SMTP configured with Brevo
  - auth email templates changed to OTP-based content for signup/login and reset-link content for password recovery

## Test Plan

- Register a brand-new user with email/password/mobile/profile data; confirm only the email OTP is required; verify dashboard session is created.
- Log out and log back in with email/password.
- Log out and log back in with email OTP; confirm no new user is auto-created.
- Re-request signup OTP for an unconfirmed email and verify resend behavior still works.
- Attempt signup with an already confirmed email and confirm the user gets a clear duplicate-account error.
- Trigger forgot password, receive Brevo-delivered reset email, set a new password, and log in with it.
- Refresh `/dashboard`, open header profile menu, and log out to confirm session persistence/clearing works through Supabase cookies.
- Run `npm run lint` and `npm run build`.

## Assumptions

- Use **Supabase Auth + Brevo SMTP**, not a custom Brevo API mailer inside the app.
- Mobile stays **required** at registration but is **not used for login, OTP, or account verification**.
- Mobile is stored as profile data only and is **not enforced as a unique auth identifier**.
- No import is performed from the prototype JSON auth store for this production launch.

## References

- [Supabase Next.js server-side auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase password auth](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)
- [Supabase email OTP auth](https://supabase.com/docs/reference/javascript/auth-signinwithotp)
- [Supabase custom SMTP for auth emails](https://supabase.com/docs/guides/auth/auth-smtp)
- [Supabase auth email templates](https://supabase.com/docs/guides/auth/auth-email-templates)
