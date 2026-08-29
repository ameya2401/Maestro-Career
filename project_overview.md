# MAESTRO CAREER — COMPLETE TECHNICAL REVERSE-ENGINEERING & INTERVIEW MASTERCLASS

> **Confidential Technical Assessment & Interview Preparation Guide**  
> **Target Project:** Maestro Career (`maestro-career`)  
> **Repository Root:** `e:/study/maestro/maestro-career`  
> **Generated:** 2026-08-26  
> **Purpose:** Deep technical audit, code-level reverse engineering, architecture explanation, live-coding prompts, debugging roadmaps, and interviewer attack paths.

---

## PART 1 — PROJECT AT A GLANCE

### 1. Project Name
**Maestro Career** (`maestro-career` in [`package.json`](file:///e:/study/maestro/maestro-career/package.json#L2))

### 2. One-Line Description
An enterprise-grade psychometric and aptitude career assessment SaaS that evaluates candidates across 20+ cognitive and behavioural dimensions to generate weighted career matchmaking dossiers, integrated with Razorpay payments, admin-controlled evaluation access, and headless Chromium PDF report generation.

### 3. Problem Being Solved
Students, graduates, and early working professionals often lack objective, data-backed clarity on their cognitive inclinations and psychological traits. Traditional career counseling is subjective, expensive, or relies on disconnected static forms. Maestro Career bridges this gap by providing an end-to-end platform: timed psychometric/aptitude assessments, algorithmic career scoring, multi-tier counseling plans, and printable intelligence dossiers.

### 4. Target Users
1. **Students (High School & College):** Seeking stream selection, degree alignment, and career discovery.
2. **Working Professionals:** Seeking career transition, role optimization, and leadership trait analysis.
3. **Counselors & Admin Teams:** Reviewing student inquiries, granting internal test access, tracking revenue (Razorpay + offline cash/UPI), and distributing specialized assessment links.

### 5. Main Features
- **Proprietary Assessment Engine (`prototype-1-v1`):** 50 timed multi-dimensional questions (25 Section A: Aptitude, 25 Section B: Psychometric) with real-time response persistence and server-side scoring.
- **Career Matching Algorithm:** Euclidean distance & weighted trait deviation algorithm matching candidates against 12 career profiles (e.g., Software Engineer, Data Scientist, Doctor, Lawyer, Entrepreneur) into compatibility buckets.
- **Dual Authentication System:** Supabase Auth (Email OTP + Password) with secure HTTP-only session cookie exchange via `@supabase/ssr` + Admin Cookie Session.
- **Monetization & Plan Selection:** 3-tier product catalog (Startup: ₹5,000, Growth: ₹8,000, Excel: ₹13,000) with Razorpay order creation and HMAC-SHA256 signature verification, plus offline cash/UPI recording.
- **Administrative Command Center:** Multi-metric analytics dashboard (visitor counts, paid conversion tracking), candidate profile editor, test link dispatcher, and access grant manager.
- **Dual PDF Dossier Generation Pipeline:** Headless Chromium (`puppeteer-core` + `@sparticuz/chromium`) generating standalone vector-rendered A4 career reports and interactive 13-page client dossier viewers.
- **Real-Time Visitor Tracking:** First-party tracking cookie with Supabase persistence for visitor analytics.

---

### 6. Technology Stack Table

| Layer | Technology | Where Used | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | Next.js 14.2.15 (App Router) | Entire app (`src/app/`, [`next.config.mjs`](file:///e:/study/maestro/maestro-career/next.config.mjs)) | Fullstack React framework with SSR, Route Handlers, and Server Actions |
| **Language** | TypeScript 5.0 | All `src/**/*.ts`, `src/**/*.tsx` | Type-safety, strict domain models, and API payload definitions |
| **Frontend UI** | React 18 + Tailwind CSS 3.4 | `src/components/`, `src/app/globals.css` | Reactive UI layout, responsive styling, and modern design tokens |
| **Motion & Animations** | Framer Motion 12.38 | `src/components/` (`Chatbot.tsx`, `Hero.tsx`, `ReportViewer.tsx`) | Kinetic micro-interactions, modal transitions, and chart reveals |
| **Icons** | Lucide React 1.7 | Throughout navigation, dashboard, and report views | Vector SVG interface iconography |
| **Theme Management** | Next Themes 0.4.6 | `src/components/ThemeProvider.tsx`, `ThemeChanger.tsx` | Dark/Light mode switching and persistent theme state |
| **Data Visualization** | Recharts 3.8.1 & Chart.js (CDN in PDF) | `src/components/charts/`, `src/app/api/generate-pdf/route.ts` | Radar charts, bar charts, comparison graphs, and cognitive breakdowns |
| **Database & Auth Backend** | Supabase (PostgreSQL 15 + Supabase Auth) | `@supabase/supabase-js`, `@supabase/ssr`, `supabase/migrations/` | Relational storage, Auth users, RLS policies, triggers, and JSONB scoring |
| **Payment Gateway** | Razorpay Node SDK 2.9.6 | `src/app/api/payments/create-order/route.ts`, `verify/route.ts` | Order creation, webhook/client payment callbacks, HMAC-SHA256 signature validation |
| **PDF Generation Engine** | Puppeteer Core 22.6 + @sparticuz/chromium 123.0 | `src/app/api/generate-pdf/route.ts`, `src/app/api/generate-report/route.ts` | Serverless headless browser rendering for downloadable career dossier PDFs |
| **OTP & SMS Providers** | Twilio SDK & Resend API (Configurable) | `src/lib/otp-delivery.ts` | Multi-channel OTP delivery for auth (Email / SMS / WhatsApp) |
| **External APIs** | Google Places Details API | `src/app/api/google-reviews/route.ts` | Dynamic 5-star Google review fetching with fallback JSON |

---

## PART 2 — COMPLETE PROJECT STRUCTURE

```text
maestro-career/
├── .env / .env.example / .env.local
├── middleware.ts                         # Global Next.js middleware (Auth route guards + Supabase session refresh)
├── next.config.mjs                       # Next.js bundler & runtime configuration
├── package.json                          # Dependencies & NPM scripts
├── tailwind.config.ts                    # Tailwind design system & color tokens
├── tsconfig.json                         # TypeScript compiler paths (@/* -> ./src/*)
├── supabase/
│   └── migrations/                       # 7 SQL schema migrations with RLS & triggers
│       ├── 20260401120000_auth_profiles.sql
│       ├── 20260405100000_add_payment_columns.sql
│       ├── 20260411120000_add_admin_manual_payments_and_visitors.sql
│       ├── 20260521000000_assessment_engine_v1.sql
│       ├── 20260521120000_internal_assessment.sql
│       ├── 20260521130000_fix_results.sql
│       └── 20260521211428_add_career_goals.sql
├── src/
│   ├── app/                              # Next.js 14 App Router
│   │   ├── layout.tsx                    # Root HTML layout with ThemeProvider & VisitorTracker
│   │   ├── page.tsx / HomeClient.tsx     # Landing page with dynamic Hero, Services, Pricing, Testimonials
│   │   ├── admin/                        # Admin portal
│   │   │   ├── page.tsx                  # Admin credential login
│   │   │   └── dashboard/page.tsx        # Admin management table (users, payments, grants, inquiries, visitors)
│   │   ├── api/                          # Backend API endpoints
│   │   │   ├── admin/                    # Admin auth & user mutations
│   │   │   ├── analytics/visitor/        # Anonymous visitor tracking
│   │   │   ├── auth/                     # Supabase auth handlers (OTP, login, password, profile setup)
│   │   │   ├── generate-pdf/             # Headless Chromium standalone PDF report generator
│   │   │   ├── generate-report/          # Live DOM screenshot PDF generator
│   │   │   ├── google-reviews/           # Google Maps Place Details review aggregator
│   │   │   ├── inquiry/submit/           # Contact form submission endpoint
│   │   │   ├── payments/                 # Razorpay order create & signature verify
│   │   │   ├── profile/                  # Career goals & plan selection updates
│   │   │   └── test/                     # Assessment engine lifecycle (access, start, response, submit, result)
│   │   ├── auth/ & login/ & register/    # Authentication views & multi-step onboarding
│   │   ├── dashboard/page.tsx            # Candidate dashboard (profile, tests, plan upgrade, career goals)
│   │   ├── report/page.tsx               # 13-page Career Dossier Report Viewer
│   │   └── test/                         # Assessment runner & results
│   │       ├── page.tsx / TestPageClient.tsx
│   │       └── result/[attemptId]/ResultPageClient.tsx
│   ├── components/                       # Reusable React components
│   │   ├── Header.tsx / Footer.tsx       # Global navigation & footer
│   │   ├── Chatbot.tsx                   # Interactive keyword-matching career guide assistant
│   │   ├── VisitorTracker.tsx            # Invisible client-side visitor analytics beacon
│   │   ├── admin/                        # Admin UI cards and data tables
│   │   ├── auth/                         # LoginAuthView, RegisterAuthView, AuthShell, AuthFormParts
│   │   ├── charts/                       # Recharts Radar, Bar, Pie, Comparison wrappers
│   │   └── report/                       # ReportViewer, ReportHeader, ProfileCard, CognitiveComponents
│   ├── data/                             # Static fixtures & catalog definitions
│   │   ├── assessment-bank.ts            # Backup / mock question definitions
│   │   ├── manualGoogleReviews.json      # Offline fallback 5-star customer reviews
│   │   └── plans.ts                      # Pricing tier definitions (Startup, Growth, Excel)
│   ├── lib/                              # Core business logic & server libraries
│   │   ├── admin-auth.ts                 # Admin session cookies & credential validation
│   │   ├── auth-config.ts                # Auth TTLs, attempt limits, and environment parsing
│   │   ├── auth-supabase.ts              # Production Supabase Auth integration layer
│   │   ├── auth.ts                       # Legacy in-memory / scrypt implementation (reference)
│   │   ├── otp-delivery.ts               # Twilio/Resend/Mock multi-provider dispatcher
│   │   ├── rate-limit.ts                 # In-memory sliding window rate limiter
│   │   ├── report-actions.ts             # Server-side report assembler for ReportViewer
│   │   ├── report-storyteller.ts         # Narrative generation algorithms for trait synergy
│   │   ├── assessment/                   # Core Assessment Engine
│   │   │   ├── bank.ts                   # Question bank loader
│   │   │   ├── banks/prototype-1-v1.ts   # 50 questions with trait contribution vectors
│   │   │   ├── scoring.ts                # Score normalization & 12-career catalog matching
│   │   │   ├── server.ts                 # Attempt lifecycle, response upserts, auto-expiry
│   │   │   └── types.ts                  # Dimension constants and TypeScript interfaces
│   │   └── supabase/                     # Supabase client factories
│   │       ├── admin.ts                  # Service Role bypass client (backend only)
│   │       ├── browser.ts                # Browser client (cookie-aware)
│   │       ├── config.ts                 # Supabase URL & Key validator
│   │       ├── middleware.ts             # Edge session refresher
│   │       ├── public.ts                 # Public server client (Anon key)
│   │       ├── route.ts                  # Route Handler client with cookie setter chaining
│   │       └── server.ts                 # Server Component client
│   └── types/
│       └── report.ts                     # Full dossier data structure definition
```

---

## PART 3 — APPLICATION ARCHITECTURE

### Architecture Diagram

```text
                               ┌────────────────────────────────────────────────────────┐
                               │                    BROWSER CLIENT                      │
                               │  (Next.js 14 Client Components / Framer Motion / SSR)  │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                         HTTP / HTTPS Requests + Cookies
                                                          │
                                                          ▼
                               ┌────────────────────────────────────────────────────────┐
                               │                  EDGE MIDDLEWARE                       │
                               │                (middleware.ts)                         │
                               │  • Refreshes Supabase Auth Cookies (@supabase/ssr)    │
                               │  • Validates Admin Session Cookie for /admin/*         │
                               │  • Protects /dashboard and /test routes                │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                                          ▼
                               ┌────────────────────────────────────────────────────────┐
                               │               NEXT.JS ROUTE HANDLERS                   │
                               │                   (src/app/api/*)                      │
                               │  • /api/auth/*        • /api/test/*                    │
                               │  • /api/payments/*    • /api/admin/*                   │
                               │  • /api/profile/*     • /api/generate-pdf              │
                               └──────────────┬───────────────────────────┬─────────────┘
                                              │                           │
                   ┌──────────────────────────┴──────────┐                │
                   ▼                                     ▼                ▼
     ┌───────────────────────────┐         ┌────────────────────────┐  ┌───────────────────────┐
     │   ASSESSMENT ENGINE       │         │   EXTERNAL SERVICES    │  │  PUPPETEER ENGINE     │
     │  (src/lib/assessment/)    │         │  • Razorpay SDK        │  │  (@sparticuz/chromium)│
     │  • Bank Loader (50 Qs)    │         │  • Twilio / Resend     │  │  • HTML-to-PDF Print  │
     │  • Scoring Normalizer     │         │  • Google Places API   │  │  • A4 Report Export   │
     │  • Career Matcher (12)    │         └────────────────────────┘  └───────────────────────┘
     └─────────────┬─────────────┘
                   │
                   ▼
     ┌───────────────────────────────────────────────────────────────────────────────────┐
     │                            SUPABASE POSTGRESQL DATABASE                           │
     │  • auth.users (Supabase Managed)       • assessment_access_grants (Admin control) │
     │  • public.profiles (User details)      • assessment_attempts (Active timers)      │
     │  • public.auth_activity (Audit log)    • assessment_responses (Answer snapshots)  │
     │  • public.website_visitors (Analytics) • assessment_results (Computed JSONB)     │
     └───────────────────────────────────────────────────────────────────────────────────┘
```

---

## PART 4 — END-TO-END DATA FLOW FOR MAJOR FEATURES

### Flow 1: User Registration & Email OTP Verification
```text
User fills Form (Name, Email, Mobile, Password, DOB, Terms) 
  → RegisterAuthView.tsx (handleRequestOtp)
  → POST /api/auth/register/request-otp 
  → auth-supabase.ts (requestRegistrationOtp)
  → Validates: Name regex, Email regex, Age >= 13, Password complexity (Upper, Lower, Number, Special)
  → Calls public Supabase client signUp({ email, password, data: userMetadata })
  → Supabase sends 6-digit confirmation OTP via Email
  → User Enters 6-digit OTP in UI
  → RegisterAuthView.tsx (handleVerifyOtp)
  → POST /api/auth/register/verify-otp
  → auth-supabase.ts (verifyRegistrationOtp)
  → supabase.auth.verifyOtp({ email, token, type: 'email' })
  → upsertProfile() creates row in public.profiles
  → insertActivity() logs "registration" in public.auth_activity
  → Sets Supabase Auth session cookies on HTTP response
  → Redirects user to /dashboard (or onboarding setup)
```

### Flow 2: Taking the Internal Assessment Test
```text
User navigates to /test 
  → middleware.ts checks Supabase session; if unauthenticated, redirects to /login?next=/test
  → TestPageClient.tsx mounts → calls GET /api/test/access
  → /api/test/access checks assessment_access_grants table:
      - If no active grant: UI shows "Access not granted" banner.
      - If active grant exists: returns grant status + any active attempt.
  → User clicks "Start Assessment" → calls POST /api/test/start
  → /api/test/start checks active grants; creates row in assessment_attempts (50 min expiry)
  → Calls publicQuestions() -> STRIPS OUT correctOptionId & trait contributions for security
  → TestPageClient renders active question (1 of 50) + calculates server clock offset (serverOffsetMsRef)
  → User selects Option → TestPageClient updates local state immediately (optimistic UI)
  → Debounced (250ms) PATCH to /api/test/response
  → /api/test/response computes question contribution snapshot & upserts row in assessment_responses
  → On Timer Expiry OR User clicks "Submit Test" → POST /api/test/submit
  → server.ts (finalizeAttempt) executes scoreAssessment():
      - Aggregates raw dimension totals from assessment_responses
      - Normalizes against max possible dimension scores (0-100 scale)
      - Computes Aptitude Index (mean of 7 aptitude dimensions) & Psychometric Index (mean of 12 dimensions)
      - Runs weighted Euclidean distance match against 12 career profiles in getCareerCatalogV1()
      - Buckets careers ("Best", "Strong", "Alternative", "Less Suitable")
      - Updates assessment_attempts (status: 'submitted')
      - Inserts record into assessment_results with JSONB scores & matches
  → Returns { success: true, attemptId, resultId }
  → TestPageClient navigates to /test/result/[attemptId]
```

### Flow 3: Plan Purchase & Razorpay Payment Verification
```text
User selects Plan on Dashboard (Startup / Growth / Excel)
  → DashboardPage calls POST /api/payments/create-order with { planId }
  → /api/payments/create-order validates user session and plan from plans.ts
  → Instantiates Razorpay client with RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
  → Calls razorpay.orders.create({ amount: plan.priceInr * 100, currency: "INR", receipt, notes })
  → Returns order details + Razorpay keyId to client
  → Dashboard initializes Razorpay Checkout Modal (new window.Razorpay(options).open())
  → User completes payment on Razorpay modal
  → Razorpay handler callback receives { razorpay_payment_id, razorpay_order_id, razorpay_signature }
  → POST /api/payments/verify with payload
  → /api/payments/verify generates expected signature using HMAC-SHA256:
      crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex")
  → Compares expectedSignature === razorpay_signature:
      - If invalid: returns 400 Bad Request
      - If valid: calls markPaymentSuccessfulFromSession()
  → Updates public.profiles (payment_status: 'paid', payment_id, transaction_id, payment_token)
  → Inserts audit log in public.auth_activity
  → Dashboard updates UI to "Paid" status & unlocks assessment access / report generation
```

---

## PART 5 — FEATURE-BY-FEATURE DEEP ANALYSIS

### Feature 1: Assessment Scoring & Career Matching Engine
- **Files Involved:**
  - [`src/lib/assessment/types.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/types.ts)
  - [`src/lib/assessment/banks/prototype-1-v1.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/banks/prototype-1-v1.ts)
  - [`src/lib/assessment/scoring.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/scoring.ts)
  - [`src/lib/assessment/server.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/server.ts)
- **7 Aptitude Dimensions:** `logical_reasoning`, `numerical_ability`, `analytical_thinking`, `pattern_recognition`, `verbal_ability`, `problem_solving`, `decision_making`.
- **12 Psychometric Dimensions:** `leadership`, `creativity`, `emotional_stability`, `communication`, `social_intelligence`, `empathy`, `adaptability`, `discipline`, `risk_taking`, `curiosity`, `attention_to_detail`, `pressure_handling`.
- **Scoring Math:**
  1. *Raw Score Calculation:* $\text{Raw}_d = \sum_{q \in Q} (\text{OptionContribution}_{q,d} \times \text{QuestionWeight}_{q,d})$
  2. *Normalization:* $\text{Normalized}_d = \min\left(100, \max\left(0, \frac{\text{Raw}_d}{\text{MaxPossible}_d} \times 100\right)\right)$
  3. *Index Calculations:*
     $$\text{AptitudeIndex} = \frac{1}{7}\sum_{d \in \text{Apt}} \text{Normalized}_d$$
     $$\text{PsychometricIndex} = \frac{1}{12}\sum_{d \in \text{Psych}} \text{Normalized}_d$$
     $$\text{OverallIndex} = \text{round}_2(0.5 \times \text{AptitudeIndex} + 0.5 \times \text{PsychometricIndex})$$
  4. *Career Fit Score Formula (Weighted Deviation):*
     $$\text{CareerScore}_c = \sum_{d} w_{c,d} \times \left(100 - |\text{UserScore}_d - \text{TargetScore}_{c,d}|\right)$$
     Where $\sum_d w_{c,d} = 1.0$.
  5. *Bucketing:*
     - Score $\ge 85$ (Top 3): "Best Career Choices"
     - Score $\ge 70$: "Strong Career Matches"
     - Score $\ge 55$: "Alternative Career Paths"
     - Score $< 55$: "Less Suitable Careers"

---

## PART 6 — FILE-BY-FILE CODEBASE MAP

| File Path | Responsibility | Key Exports / Functions | Dependents | Interview Relevance |
| :--- | :--- | :--- | :--- | :--- |
| [`middleware.ts`](file:///e:/study/maestro/maestro-career/middleware.ts) | Edge route protection & cookie session synchronization | `middleware()`, `config` | Next.js Edge Runtime | **HIGH** |
| [`src/lib/supabase/middleware.ts`](file:///e:/study/maestro/maestro-career/src/lib/supabase/middleware.ts) | Supabase token refresh & unauthenticated redirect | `updateSession()` | `middleware.ts` | **HIGH** |
| [`src/lib/auth-supabase.ts`](file:///e:/study/maestro/maestro-career/src/lib/auth-supabase.ts) | Complete Supabase Auth & Profile business logic | `requestRegistrationOtp()`, `verifyRegistrationOtp()`, `loginWithPassword()`, `getDashboardData()` | `/api/auth/*`, `/api/profile/*` | **CRITICAL** |
| [`src/lib/admin-auth.ts`](file:///e:/study/maestro/maestro-career/src/lib/admin-auth.ts) | Admin cookie session validation & cookie setting | `validateAdminCredentials()`, `withAdminSession()`, `isAdminAuthenticatedRequest()` | `middleware.ts`, `/api/admin/*` | **HIGH** |
| [`src/lib/assessment/scoring.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/scoring.ts) | Mathematical engine for normalization & career scoring | `scoreAssessment()`, `computeContributionSnapshot()`, `getCareerCatalogV1()` | `server.ts` | **CRITICAL** |
| [`src/lib/assessment/server.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/server.ts) | Database operations for attempts, responses, and finalization | `getActiveGrant()`, `getInProgressAttempt()`, `upsertResponse()`, `finalizeAttempt()` | `/api/test/*` | **CRITICAL** |
| [`src/lib/assessment/banks/prototype-1-v1.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/banks/prototype-1-v1.ts) | 50-question bank with trait contribution vectors | `PROTOTYPE_1_V1` | `bank.ts` | **HIGH** |
| [`src/app/api/generate-pdf/route.ts`](file:///e:/study/maestro/maestro-career/src/app/api/generate-pdf/route.ts) | Puppeteer-core + @sparticuz/chromium serverless PDF renderer | `POST(req)` | Report Download button | **CRITICAL** |
| [`src/app/api/payments/create-order/route.ts`](file:///e:/study/maestro/maestro-career/src/app/api/payments/create-order/route.ts) | Initiates Razorpay INR order with amount in paise | `POST(req)` | Dashboard checkout modal | **HIGH** |
| [`src/app/api/payments/verify/route.ts`](file:///e:/study/maestro/maestro-career/src/app/api/payments/verify/route.ts) | HMAC-SHA256 signature verification & payment status update | `POST(req)` | Dashboard payment handler | **CRITICAL** |
| [`src/app/test/TestPageClient.tsx`](file:///e:/study/maestro/maestro-career/src/app/test/TestPageClient.tsx) | Client state machine for assessment runner & debounced autosave | `TestPageClient()` | `/test/page.tsx` | **HIGH** |
| [`src/components/report/ReportViewer.tsx`](file:///e:/study/maestro/maestro-career/src/components/report/ReportViewer.tsx) | 13-page print-ready Career Intelligence Dossier | `ReportViewer()` | `/report/page.tsx` | **HIGH** |
| [`src/components/Chatbot.tsx`](file:///e:/study/maestro/maestro-career/src/components/Chatbot.tsx) | Kinetic floating career guide bot (keyword-matching) | `Chatbot()` | Landing page / AppShell | **MEDIUM** |
| [`src/components/VisitorTracker.tsx`](file:///e:/study/maestro/maestro-career/src/components/VisitorTracker.tsx) | Invisible beacon for recording unique visitors | `VisitorTracker()` | Root layout | **MEDIUM** |

---

## PART 7 — DATABASE DEEP DIVE & SCHEMA SPECIFICATION

### Database Engine: PostgreSQL 15 (Managed by Supabase)

```text
 ┌──────────────────────┐         ┌───────────────────────────────┐
 │     auth.users       │         │        public.profiles        │
 │  (Supabase Auth)     │         │───────────────────────────────│
 │                      │ 1 ─── 1 │ id (UUID, PK, FK->auth.users) │
 │  id (UUID, PK)       │         │ email (TEXT, UNIQUE)          │
 │  email (TEXT)        │         │ full_name (TEXT)              │
 │  raw_user_meta_data  │         │ mobile (TEXT)                 │
 └──────────┬───────────┘         │ country_code (TEXT)           │
            │                     │ date_of_birth (DATE)          │
            │ 1                   │ user_type ('student'|'work')  │
            │                     │ selected_plan_id (TEXT)       │
            ├───────────────┐     │ payment_status ('paid'|'un')  │
            │ 1             │ 1   │ payment_method ('razorpay'..) │
            ▼               ▼     │ psychometric_test_link (TEXT) │
 ┌───────────────────────┐ ┌────  │ career_goals (TEXT)           │
 │assessment_access_     │ │asse  └───────────────────────────────┘
 │grants                 │ │atte
 │───────────────────────│ │────
 │ id (UUID, PK)         │ │ id 
 │ user_id (FK->users)   │ │ use
 │ bank_version (TEXT)   │ │ ban
 │ status ('active'|'rev'│ │ sta
 └───────────────────────┘ │ tim
                           │ sta
                           │ exp
                           │ raw
                           │ nor
                           │ ove
                           └─┬──
                             │ 1
                             ├──────────────────────────┐
                             │ 1                        │ 1
                             ▼                          ▼
            ┌───────────────────────────────┐ ┌───────────────────────────────┐
            │     assessment_responses      │ │      assessment_results       │
            │───────────────────────────────│ │───────────────────────────────│
            │ id (UUID, PK)                 │ │ id (UUID, PK)                 │
            │ attempt_id (FK->attempts)     │ │ attempt_id (FK, UNIQUE)       │
            │ user_id (FK->users)           │ │ user_id (FK->users)           │
            │ question_id (TEXT)            │ │ aptitude_scores (JSONB)       │
            │ selected_option_id (TEXT)     │ │ psychometric_scores (JSONB)   │
            │ time_spent_seconds (INT)      │ │ aptitude_index (NUMERIC)      │
            │ contribution_snapshot (JSONB) │ │ psychometric_index (NUMERIC)  │
            │ UNIQUE(attempt_id, question_id│ │ overall_index (NUMERIC)       │
            └───────────────────────────────┘ │ career_matches (JSONB)        │
                                              │ summary (JSONB)               │
                                              └───────────────────────────────┘
```

---

## PART 8 — API ENDPOINT SPECIFICATION TABLE

| Method | Endpoint | Purpose | Request Body / Query | Response / Status | Auth Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/request-otp` | Initiate signup & send email OTP | `{ fullName, email, mobile, countryCode, password, dateOfBirth, acceptedTerms }` | `{ success: true, emailTarget, expiresInSeconds }` | None |
| `POST` | `/api/auth/register/verify-otp` | Verify signup OTP & create profile | `{ email, otp }` | `{ success: true, user: PublicUser }` | None |
| `POST` | `/api/auth/login/request-otp` | Send login OTP to existing email | `{ email }` | `{ success: true, target, expiresInSeconds }` | None |
| `POST` | `/api/auth/login/verify-otp` | Verify login OTP & set session | `{ email, otp }` | `{ success: true, user: PublicUser }` | None |
| `POST` | `/api/auth/login/password` | Authenticate with email + password | `{ email, password }` | `{ success: true, user: PublicUser }` | None |
| `POST` | `/api/auth/logout` | Terminate session & clear cookies | None | `{ success: true }` | Supabase User |
| `GET` | `/api/auth/me` | Fetch active user dashboard data | None | `{ success: true, data: DashboardData }` | Supabase User |
| `POST` | `/api/profile/select-plan` | Record chosen pricing tier | `{ planId: "startup" \| "growth" \| "excel" }` | `{ success: true, data: PublicUser }` | Supabase User |
| `POST` | `/api/profile/aspirations` | Save career dream & education goals | `{ career_goals: string }` | `{ success: true }` | Supabase User |
| `POST` | `/api/payments/create-order` | Create Razorpay order in INR paise | `{ planId: string }` | `{ success: true, keyId, order: RazorpayOrder }` | Supabase User |
| `POST` | `/api/payments/verify` | Verify Razorpay HMAC-SHA256 signature | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` | `{ success: true, message: string }` | Supabase User |
| `GET` | `/api/test/access` | Check test grant status & active attempt | None | `{ success: true, grant, attempt, latestResultId }` | Supabase User |
| `POST` | `/api/test/start` | Start or resume assessment attempt | None | `{ success: true, attempt, questions: PublicQuestion[], responses }` | Supabase User |
| `PATCH`| `/api/test/response` | Incrementally save selected option | `{ attemptId, questionId, optionId, timeSpentSeconds }` | `{ success: true, snapshot }` | Supabase User |
| `POST` | `/api/test/submit` | Compute final scores & generate result | `{ attemptId }` | `{ success: true, attemptId, resultId }` | Supabase User |
| `GET` | `/api/test/result/[attemptId]` | Retrieve scored result by attempt ID | Route param: `attemptId` | `{ success: true, data: ResultRow }` | Supabase User |
| `GET` | `/api/test/results/latest` | Retrieve most recent scored result | None | `{ success: true, result: ResultRow }` | Supabase User |
| `POST` | `/api/generate-pdf` | Headless Chromium PDF render of result | `{ attemptId }` | Binary `application/pdf` buffer | Supabase User |
| `GET` | `/api/generate-report` | Live DOM screenshot print of report | `?resultId=UUID&print=true` | Binary `application/pdf` buffer | Optional |
| `POST` | `/api/inquiry/submit` | Submit contact form inquiry | `{ name, email, message }` | `{ success: true }` | None |
| `GET` | `/api/google-reviews` | Fetch 5-star reviews from Google Places | None | `{ ok: true, place, reviews }` | None |
| `POST` | `/api/analytics/visitor` | Track anonymous page visitors | `{ path: string }` | `{ success: true }` (sets `maestro_visitor_id`) | None |
| `POST` | `/api/admin/login` | Admin authentication | `{ userId, password }` | `{ success: true }` (sets `maestro_admin_session`) | None |
| `GET` | `/api/admin/users` | List all registered learner profiles | None | `{ success: true, data: ProfileRow[] }` | Admin Session |
| `PATCH`| `/api/admin/users/[userId]` | Update user profile / offline payment | `{ paymentStatus, paymentMethod, manualCashAmount... }` | `{ success: true, data: ProfileRow }` | Admin Session |
| `POST` | `/api/admin/users/[userId]/grant-access` | Toggle internal test grant | `?action=grant \| revoke` | `{ success: true }` | Admin Session |
| `POST` | `/api/admin/users/[userId]/send-link` | Assign custom external test URL | `{ psychometricTestLink: string }` | `{ success: true }` | Admin Session |
| `GET` | `/api/admin/stats` | Get total unique visitor count | None | `{ success: true, data: { uniqueVisitors: number } }` | Admin Session |
| `GET` | `/api/admin/inquiries` | Fetch user contact inquiries | None | `{ success: true, data: InquiryRow[] }` | Admin Session |

---

## PART 9 — AUTHENTICATION & SECURITY REVIEW

### Authentication Architecture

```text
Client Request ──> Next.js Edge Middleware ──> @supabase/ssr createServerClient
                         │
                         ├─> Reads request.cookies.getAll()
                         ├─> Calls supabase.auth.getUser()
                         ├─> If Token Expired: Refreshes access token via refresh token
                         └─> Injects updated Set-Cookie headers on response
```

### Security Audit Findings & Defenses

1. **Answer Leakage Prevention:**
   - *Confirmed:* In [`src/app/api/test/start/route.ts`](file:///e:/study/maestro/maestro-career/src/app/api/test/start/route.ts#L20-L28), `publicQuestions()` explicitly strips out `correctOptionId`, `contributions`, and `dimensionWeights` before sending JSON to the browser.
2. **Server-Side Scoring Verification:**
   - *Confirmed:* All scoring mathematics execute exclusively inside [`src/lib/assessment/server.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/server.ts) on the server. The client cannot forge score totals.
3. **Payment Tampering Defense:**
   - *Confirmed:* In [`src/app/api/payments/verify/route.ts`](file:///e:/study/maestro/maestro-career/src/app/api/payments/verify/route.ts#L33-L39), Razorpay payment signatures are validated using cryptographic HMAC-SHA256 matching `order_id|payment_id` against `RAZORPAY_KEY_SECRET`.
4. **Row Level Security (RLS):**
   - *Confirmed:* Supabase tables (`profiles`, `assessment_attempts`, `assessment_responses`, `assessment_results`) have RLS policies strictly enforcing `auth.uid() = user_id`. Service role access is restricted to administrative backend routes.
5. **Hardcoded Admin Credentials:**
   - *Confirmed:* [`src/lib/admin-auth.ts`](file:///e:/study/maestro/maestro-career/src/lib/admin-auth.ts#L6-L7) currently uses static credentials (`maestrocareer` / `maestrocareer2026`).
   - *Production Improvement:* Move credentials to `ADMIN_USER_ID` and `ADMIN_PASSWORD_HASH` environment variables with bcrypt/scrypt comparison.

---

## PART 10 — "WHY DID YOU DO THIS?" (TECHNICAL DESIGN DECISIONS)

### Q1: Why Next.js 14 App Router instead of a separate Express backend and React SPA?
- **What they are testing:** Architectural judgment, deployment complexity, latency understanding, and fullstack mental model.
- **Strong Answer:** 
  > "Using Next.js 14 App Router unified our type definitions across client and server without needing a separate API schema sync tool like tRPC or GraphQL. It allows server-side rendering for marketing pages (SEO), Edge Middleware for cookie-based session refreshes via `@supabase/ssr`, and Serverless Route Handlers for computationally light tasks like assessment response upserts and HMAC signature verification. This eliminated the operational overhead of running a separate Express cluster."

### Q2: Why did you implement debounced answer saving (250ms) in the assessment runner?
- **What they are testing:** Frontend performance, database write pressure, and user experience tradeoffs.
- **Strong Answer:** 
  > "During an assessment, if a user rapidly clicks options, sending an immediate network request per click creates race conditions and hammers the database with concurrent upserts. By adding a 250ms debounce with `useRef` and `window.clearTimeout`, we ensure the UI updates optimistically with zero perceptible lag while batching network writes. If the attempt expires, the server immediately forces finalization regardless of pending client timers."

### Q3: Why store assessment question contributions in code instead of a database table?
- **What they are testing:** Data modeling, version control, and query optimization.
- **Strong Answer:** 
  > "Question banks in psychometric testing undergo versioned psychometric validation (`prototype-1-v1`). Hardcoding the versioned bank in TypeScript gives us compile-time type safety over all 19 trait dimensions, zero database read latency on test start, and immutable version tracking. When a candidate completes a test, their response snapshots and score versions are stored in the database, allowing us to roll out `prototype-2-v1` without breaking historic candidate dossiers."

### Q4: Why do you have both `src/app/api/generate-pdf` and `src/app/api/generate-report`?
- **What they are testing:** Understanding of serverless constraints, headless browser costs, and PDF rendering strategies.
- **Strong Answer:** 
  > "They serve two distinct operational needs:
  > 1. `/api/generate-pdf` is a self-contained, high-performance serverless endpoint using `@sparticuz/chromium` that compiles a raw HTML/Chart.js template and renders a clean 6-page PDF buffer in ~1.5s with minimal memory overhead.
  > 2. `/api/generate-report` is an automated DOM-renderer that navigates Puppeteer directly to the live `/report` URL with `isPrinting=true` to capture the complete 13-page interactive Recharts dossier with full CSS glassmorphism and multi-circle Venn diagrams."

---

## PART 11 — "CHANGE THIS CODE" (LIVE-CODING EXERCISES)

### Exercise 1: Add a 20% Student Discount Code to Razorpay Orders
- **Files to modify:** [`src/app/api/payments/create-order/route.ts`](file:///e:/study/maestro/maestro-career/src/app/api/payments/create-order/route.ts)
- **Functions involved:** `POST(req: NextRequest)`
- **Task:** Accept an optional `discountCode` in the request body. If `discountCode === "STUDENT20"`, apply a 20% discount to `amountPaise`.
- **Implementation Strategy:**
  ```typescript
  // Inside POST in src/app/api/payments/create-order/route.ts:
  const body = await req.json();
  const planId = String(body?.planId ?? "");
  const discountCode = String(body?.discountCode ?? "").trim().toUpperCase();

  const plan = getPlanById(planId);
  if (!plan) {
      return NextResponse.json({ success: false, message: "Invalid plan." }, { status: 400 });
  }

  let finalAmountInr = plan.priceInr;
  if (discountCode === "STUDENT20") {
      finalAmountInr = Math.round(plan.priceInr * 0.80);
  }
  const amountPaise = finalAmountInr * 100;
  ```

### Exercise 2: Add Negative Marking (-1) for Incorrect Section A Answers
- **Files to modify:** [`src/lib/assessment/scoring.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/scoring.ts)
- **Functions involved:** `computeContributionSnapshot(question, optionId)`
- **Task:** If an Aptitude question has a `correctOptionId` and the user chooses an option where `option.id !== question.correctOptionId`, deduct 1 point from `logical_reasoning`.
- **Implementation Strategy:**
  ```typescript
  export function computeContributionSnapshot(question: AssessmentQuestion, optionId: string | null | undefined) {
      if (!optionId) return {} as Record<string, number>;
      const option = question.options.find((opt) => opt.id === optionId);
      if (!option) return {} as Record<string, number>;

      const snapshot: Record<string, number> = {};
      const weights = question.dimensionWeights ?? {};

      // If Section A question is answered incorrectly:
      if (question.section === "A" && question.correctOptionId && optionId !== question.correctOptionId) {
          snapshot["logical_reasoning"] = -1;
          return snapshot;
      }

      for (const [dimension, base] of Object.entries(option.contributions ?? {})) {
          const w = typeof (weights as Record<string, number>)[dimension] === "number" ? weights[dimension]! : 1;
          const value = Math.max(0, Number(base) * w);
          if (value > 0) snapshot[dimension] = value;
      }
      return snapshot;
  }
  ```

---

## PART 12 — DEBUGGING PLAYBOOK

### Scenario 1: "User clicked 'Submit Assessment', but the page hangs or returns 400."
1. **Trace:** Check browser network tab for `POST /api/test/submit` payload (`{ attemptId }`).
2. **Server Inspection:** Open [`src/app/api/test/submit/route.ts`](file:///e:/study/maestro/maestro-career/src/app/api/test/submit/route.ts) and trace `finalizeAttempt()` in [`src/lib/assessment/server.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/server.ts#L195).
3. **Common Cause:** `assessment_responses` had zero answers saved or the attempt status was already marked `submitted` (race condition).
4. **Fix:** Verify if `existingResult` is returned idempotently:
   ```typescript
   const existingResult = await getResultByAttemptId(supabase, userId, attemptId);
   if (existingResult) {
       return { attempt: attemptRow, result: existingResult, alreadyFinalized: true };
   }
   ```

### Scenario 2: "PDF Download fails with `Failed to launch browser process` on production."
1. **Trace:** Open [`src/app/api/generate-pdf/route.ts`](file:///e:/study/maestro/maestro-career/src/app/api/generate-pdf/route.ts#L201-L211).
2. **Root Cause:** Serverless environments (e.g., Vercel / AWS Lambda) do not have standard Google Chrome installed in `C:\Program Files` or `/Applications/`.
3. **Fix:** Ensure `@sparticuz/chromium` is invoked in non-development environments with proper serverless flags (`--no-sandbox`, `--disable-gpu`, `--single-process`).

---

## PART 13 — 10 CODE-TRACING EXERCISES

1. **Trace User Login via Password:**
   `LoginAuthView.tsx (handlePasswordLogin)` $\rightarrow$ `POST /api/auth/login/password` $\rightarrow$ `auth-supabase.ts (loginWithPassword)` $\rightarrow$ `supabase.auth.signInWithPassword` $\rightarrow$ `recordLogin()` $\rightarrow$ `upsertProfile()` $\rightarrow$ `insertActivity()` $\rightarrow$ Sets HTTP Cookies $\rightarrow$ Client redirect to `/dashboard`.
2. **Trace Question Answer Selection:**
   `TestPageClient.tsx (handleSelect)` $\rightarrow$ `saveAnswer(debounce 250ms)` $\rightarrow$ `PATCH /api/test/response` $\rightarrow$ `server.ts (upsertResponse)` $\rightarrow$ `scoring.ts (computeContributionSnapshot)` $\rightarrow$ Supabase upsert `assessment_responses` on `(attempt_id, question_id)` $\rightarrow$ Update `last_activity_at` on `assessment_attempts`.
3. **Trace Assessment Expiry:**
   `TestPageClient.tsx (tick interval)` $\rightarrow$ `remainingSeconds === 0` $\rightarrow$ `autoSubmitFiredRef.current = true` $\rightarrow$ `POST /api/test/submit` $\rightarrow$ `server.ts (finalizeAttempt with forceExpired: true)` $\rightarrow$ Sets `status: 'expired'` $\rightarrow$ Inserts `assessment_results`.
4. **Trace Admin Manual Cash Verification:**
   `AdminDashboardPage.tsx (handleSaveUser)` $\rightarrow$ `PATCH /api/admin/users/[userId]` $\rightarrow$ Validates `manualCashAmount > 0` $\rightarrow$ Supabase update `public.profiles` (`payment_status: 'paid'`, `payment_method: 'cash'`) $\rightarrow$ Reloads admin table.
5. **Trace Admin Granting Test Access:**
   `AdminDashboardPage.tsx (handleToggleAccess)` $\rightarrow$ `POST /api/admin/users/[userId]/grant-access?action=grant` $\rightarrow$ Supabase upsert `assessment_access_grants` (`status: 'active'`) $\rightarrow$ User can now invoke `POST /api/test/start`.
6. **Trace Career Goal Submission:**
   `DashboardPage.tsx (handleSaveGoals)` $\rightarrow$ `POST /api/profile/aspirations` $\rightarrow$ Supabase update `public.profiles` (`career_goals: JSON.stringify(goals)`) $\rightarrow$ Toast alert "Aspirations updated".
7. **Trace Anonymous Visitor Beacon:**
   `RootLayout` $\rightarrow$ `VisitorTracker.tsx (useEffect)` $\rightarrow$ `POST /api/analytics/visitor` with `{ path }` $\rightarrow$ Checks `maestro_visitor_id` cookie $\rightarrow$ Upserts `public.website_visitors` (increments `visit_count`) $\rightarrow$ Sets 1-year cookie.
8. **Trace Report Dossier Data Assembly:**
   `ReportPage (report/page.tsx)` $\rightarrow$ `getReportData(resultId)` $\rightarrow$ Supabase query `assessment_results` $\rightarrow$ Maps `career_matches`, `aptitude_scores`, `psychometric_scores` to `ReportData` structure $\rightarrow$ Renders `ReportViewer.tsx`.
9. **Trace Google Review Fetch with Fallback:**
   `Testimonials.tsx` $\rightarrow$ `GET /api/google-reviews` $\rightarrow$ `google-reviews/route.ts` calls Google Places Details API $\rightarrow$ Filters `rating === 5` $\rightarrow$ If API key missing or error, frontend falls back to `manualGoogleReviews.json`.
10. **Trace Admin Logout:**
    `Header.tsx (handleAdminLogout)` $\rightarrow$ `POST /api/admin/logout` $\rightarrow$ `clearAdminSession()` sets `maestro_admin_session` `maxAge: 0` $\rightarrow$ Redirects to `/admin`.

---

## PART 14 — INTERVIEWER'S ATTACK PATHS (DEEP DRILLS)

### Drill 1: The Authentication & State Grilling
- **Interviewer:** "Where is authentication verified when a candidate navigates to `/dashboard`?"
- **Candidate:** "In [`middleware.ts`](file:///e:/study/maestro/maestro-career/middleware.ts#L31) which delegates to `updateSession()` in [`src/lib/supabase/middleware.ts`](file:///e:/study/maestro/maestro-career/src/lib/supabase/middleware.ts#L33). It creates a server client via `@supabase/ssr`, inspects cookies, calls `supabase.auth.getUser()`, and if `user` is null, issues a 307 redirect to `/login`."
- **Interviewer:** "Why use `getUser()` instead of `getSession()` in middleware?"
- **Candidate:** "`getSession()` only decodes the JWT client-side without validating token revocation with Supabase auth servers. `getUser()` re-validates the authentication claims against the Supabase authentication server, ensuring revoked tokens or deleted users cannot access protected routes."

### Drill 2: Assessment Engine & Math Grilling
- **Interviewer:** "How do you calculate the match percentage for a career like Software Engineer?"
- **Candidate:** "In [`src/lib/assessment/scoring.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/scoring.ts#L440-L448), each career profile has target scores and normalized weights summing to 1.0. For each dimension, we take $(100 - |\text{userScore} - \text{targetScore}|)$ and multiply by the dimension weight. Summing these weighted values produces a 0-100 compatibility score."
- **Interviewer:** "What if a question option gives points to multiple dimensions?"
- **Candidate:** "Each option in [`prototype-1-v1.ts`](file:///e:/study/maestro/maestro-career/src/lib/assessment/banks/prototype-1-v1.ts) defines a `contributions` dictionary. For example, Option A in question A01 gives 4 points to `logical_reasoning` and 2 points to `analytical_thinking`. When normalized, each dimension is divided by the theoretical maximum score achievable in that dimension across the entire 50-question bank."

---

## PART 15 — HONEST AI-ASSISTED DEVELOPMENT INTERVIEW SCRIPT

### How to Answer: *"Did you use AI to build this project?"*

> **Professional, High-Credibility Response:**
> "Yes, I leveraged AI coding assistants (like Gemini and Claude) as an accelerator for boilerplate generation, SQL schema drafts, and UI styling tokens. 
> 
> However, the core engineering decisions, architecture, and validation were entirely my responsibility. Specifically:
> 1. **Architecture & Security:** I architected the migration from local JSON file storage to Supabase PostgreSQL with strict RLS policies, HMAC-SHA256 signature verification for payments, and cookie-based Edge session refreshes.
> 2. **Algorithmic Modeling:** I formulated the career matchmaking formula and normalization engine, ensuring question weights, tie-breaking heuristics, and timer clock-skew compensations were mathematically sound.
> 3. **Debugging & Integration:** I resolved critical serverless edge cases, such as configuring headless Chromium binary paths for Puppeteer in serverless runtimes and implementing debounced client-side response persistence."

---

## PART 16 — FINAL INTERVIEW CHEAT SHEET (TOP 10 TAKEAWAYS)

1. **Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (Postgres 15 + SSR Auth), Razorpay SDK, Puppeteer Core + @sparticuz/chromium.
2. **Assessment Bank:** `prototype-1-v1` containing 50 questions (25 Section A Aptitude + 25 Section B Psychometric).
3. **Assessment Scoring:** 7 Aptitude Dimensions + 12 Psychometric Dimensions normalized to 0-100; Euclidean distance match against 12 career profiles.
4. **Security in Testing:** Questions sent to browser are stripped of answers and trait contributions via `publicQuestions()`.
5. **Timer Synchronization:** Client computes `serverOffsetMsRef = serverTime - Date.now()` to prevent local device clock tampering from altering test duration.
6. **Payment Security:** Razorpay webhook/callback verified with `crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex")`.
7. **Offline Payments:** Admin dashboard allows manual cash and manual UPI recording with reconciliation notes.
8. **PDF Pipelines:** `/api/generate-pdf` renders a fast 6-page HTML/Chart.js report; `/api/generate-report` captures the full 13-page live dossier.
9. **Visitor Tracking:** Cookie `maestro_visitor_id` with 1-year TTL and Supabase `website_visitors` table.
10. **Chatbot Nature:** Client-side keyword and FAQ matcher (`Chatbot.tsx`) with zero external LLM API costs.
