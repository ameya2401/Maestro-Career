# 🎓 Maestro Career

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014%20%7C%20React%2018-blue)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Next.js%20API%20Routes-black)](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
[![Database](https://img.shields.io/badge/Database-Supabase%20%7C%20PostgreSQL-3ecf8e)](https://supabase.com/)
[![Deployed on](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)

> *Know who you are. Know where you belong.*

**Maestro Career** is a full-stack, cloud-native psychometric career guidance platform that replaces expensive, one-size-fits-all counseling sessions with an affordable, data-driven digital experience. It administers a 50-question, 19-dimension psychometric and aptitude assessment, scores responses through a custom weighted normalization engine, matches the user against 12 real-world career profiles, and generates a professional multi-page **Career DNA Report** — entirely in the browser.

---

## 🌐 Live Application

🔗 **[Launch Live Demo](https://maestro-career.vercel.app)**

---

## 🌟 Key Features

* **Dual-Mode Authentication:** OTP-verified email registration alongside password-based login, with a full passwordless flow and password-reset cycle — all rate-limited by a custom sliding-window limiter (per-IP and per-email).
* **Integrated Payment Gateway:** Razorpay order creation and HMAC-SHA256 server-side signature verification locks assessment access behind a tamper-proof payment wall, with support for UPI, Cards, and Netbanking.
* **19-Dimension Scoring Engine:** A weighted normalization algorithm accumulates per-question contributions across 7 Aptitude and 12 Psychometric dimensions, normalizes them to a 0–100 scale, and runs a weighted distance formula against 12 career profiles to surface ranked **Best**, **Strong**, and **Alternative** career matches.
* **Server-Side PDF Generation:** Puppeteer Core + `@sparticuz/chromium` renders a pixel-perfect, multi-page A4 Career DNA Report with inline Recharts visualizations and returns it as a binary stream — deployable on Vercel serverless functions.
* **Admin Control Panel (CRM):** A secure, separate admin session provides full user management — grant/revoke assessment access, override payment status (Cash, UPI, Razorpay), send external test links via email, and monitor real-time visitor analytics.
* **Row-Level Security:** Supabase RLS policies ensure users can only read and write their own assessment attempts, responses, and results — zero cross-user data leakage.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript 5 |
| **Styling** | Tailwind CSS v3, Framer Motion, Lucide React, next-themes |
| **Charts** | Recharts 3 (D3-based, SVG output for print safety) |
| **Backend** | Next.js Route Handlers (36 serverless endpoints) |
| **Auth & DB** | Supabase (PostgreSQL + Supabase Auth + RLS) |
| **Payments** | Razorpay (HMAC-SHA256 verification) |
| **Email** | Brevo SMTP (transactional OTPs & notifications) |
| **PDF** | Puppeteer Core 22 + `@sparticuz/chromium` 123 |
| **Deployment** | Vercel (Edge CDN + Serverless Functions) |

---

## 📁 Repository Structure

```text
maestro-career/
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── api/               # 36 serverless route handlers
│   │   │   ├── auth/          # Register, login, OTP, password-reset, logout
│   │   │   ├── test/          # Assessment access, start, response, submit, result
│   │   │   ├── payments/      # Razorpay order creation & HMAC verification
│   │   │   ├── generate-pdf/  # Puppeteer PDF generation endpoint
│   │   │   └── admin/         # Admin session, user management, analytics
│   │   ├── (public)/          # Landing, features, services, about, contact
│   │   ├── dashboard/         # Authenticated user hub
│   │   ├── checkout/[planId]/ # Razorpay payment UI
│   │   ├── test/              # Timed 50-question assessment
│   │   ├── test/result/[id]/  # Result page with charts
│   │   ├── report/            # Printable Career DNA Report
│   │   ├── admin/             # Admin login & dashboard
│   │   └── demo-test/         # Public demo (no payment required)
│   ├── components/            # 41 reusable UI components
│   ├── lib/
│   │   ├── assessment/        # Scoring engine (scoring.ts, server.ts)
│   │   ├── supabase/          # SSR client, admin client, helpers
│   │   └── rate-limit.ts      # Custom sliding-window rate limiter
│   ├── data/                  # Question bank & career profile definitions
│   └── types/                 # Shared TypeScript type definitions
├── supabase/                  # DB migrations & RLS policy definitions
├── scripts/                   # Utility scripts (auth reset, etc.)
├── public/                    # Static assets
├── middleware.ts              # Route guard for protected pages
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## ⚙️ Scoring Engine — How It Works

The assessment engine (`src/lib/assessment/`) is the core of the platform:

```
19 Dimensions:
  ├── 7 Aptitude:      logical_reasoning, numerical_ability, analytical_thinking,
  │                    pattern_recognition, verbal_ability, problem_solving, decision_making
  └── 12 Psychometric: leadership, creativity, emotional_stability, communication,
                       social_intelligence, empathy, adaptability, discipline,
                       risk_taking, curiosity, attention_to_detail, pressure_handling
```

**Algorithm (per submission):**
1. Each question option carries a `contributions` map per dimension.
2. Each question defines `dimensionWeights` — multipliers applied to contributions.
3. `score = contribution[dimension] × weight[dimension]` — accumulated across 50 questions.
4. **Normalization:** `score = (rawTotal / maxPossibleTotal) × 100` → 0–100 scale.
5. `aptitudeIndex = mean(7 scores)` · `psychometricIndex = mean(12 scores)` · `overallIndex = 0.5 × each`
6. **Career matching:** `careerScore = Σ(weight × (100 − |userScore − targetScore|))` per relevant dimension.
7. Careers bucketed: ≥ 85 → **Best Choices**, ≥ 70 → **Strong Matches**, ≥ 55 → **Alternative Paths**.

**12 career profiles modeled:** Doctor · Psychologist · Software Engineer · Data Scientist · Lawyer · Public Policy Analyst · Chartered Accountant · Entrepreneur · Graphic Designer · Teacher · Journalist · Architect.

---

## 🗃️ Database Schema (Supabase / PostgreSQL)

| Table | Purpose |
| :--- | :--- |
| `profiles` | Extended user data (name, mobile, DOB, city, plan, payment status & IDs) |
| `assessment_access_grants` | Admin-controlled grants (`active` / `revoked`) |
| `assessment_attempts` | One row per test session (timer, status, computed indices) |
| `assessment_responses` | Per-question answers + contribution snapshot for audit |
| `assessment_results` | Final scores: all dimensions, career matches, improvement areas |
| `analytics_visitors` | Unique visitor tracking by hashed IP |
| `inquiries` | Contact form submissions |

---

## 🔐 Security

- **JWT sessions** via Supabase Auth — HTTP-only cookies managed by `@supabase/ssr`
- **RLS policies** — users can only access their own rows; service role key is server-side only
- **HMAC-SHA256** payment verification — prevents Razorpay signature replay/forgery
- **Rate limiting** — custom sliding-window limiter on all OTP endpoints (20 req/10 min per IP, 5 req/10 min per email)
- **Route guard** — `middleware.ts` redirects unauthenticated users away from protected pages

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js:** v18+
- **npm:** v9+
- **Supabase project** with the schema from `supabase/` migrations applied
- **Razorpay account** (test keys)
- **Brevo account** for SMTP credentials

### 1. Clone & Install

```bash
git clone https://github.com/your-username/maestro-career.git
cd maestro-career
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in all required values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Admin
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
ADMIN_SESSION_SECRET=a_long_random_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Apply Database Migrations

Apply the SQL files in `supabase/` to your Supabase project via the Supabase dashboard SQL editor or the Supabase CLI.

---

## 📊 Project Stats

| Metric | Value |
| :--- | :--- |
| API endpoints | 36 serverless route handlers |
| Frontend pages | 25 |
| Assessment dimensions | 19 (7 Aptitude + 12 Psychometric) |
| Questions per test | 50 |
| Time limit | 50 minutes |
| Career profiles | 12 |
| External services | 3 (Razorpay · Brevo · Supabase) |

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
