# 🎯 Maestro Career

[![Framework](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel)](https://maestro-career.vercel.app)

> *An AI-enhanced career counseling platform featuring application-based assessments, custom PDF report generation, and interactive data visualization.*

Maestro Career provides candidates with structured career guidance tools—including global benchmarking, 5-circle career fit Venn analysis, and automated PDF performance reports generated via headless Chromium.

---

## 🌐 Live Application

🔗 **[Launch Maestro Career](https://maestro-career.vercel.app)**

---

## 🌟 Key Features

* **Career Compatibility Engine**: Visualizes multi-dimensional profile alignments using dynamic radar charts and a custom 5-circle Venn diagram architecture.
* **Assessment & Automated Reporting**: Runs evaluation modules with headless Puppeteer (`@sparticuz/chromium`) to generate client-side downloadable PDF diagnostic reports.
* **Dual-Mode Feedback Pipeline**: Flexible review architecture supporting static 5-star local text extraction alongside dynamic Google Places API integration (`/api/google-reviews`).
* **Supabase Authentication & Persistence**: Secured user sessions, role management, schema migrations, and candidate profile tracking.
* **Mock Assessment Mode**: Simulated testing environments with benchmarking metrics to rate skill readiness against target roles.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Geist Font |
| **Backend & API** | Next.js Route Handlers, Node.js scripts |
| **Database & Auth** | Supabase (PostgreSQL), Row Level Security (RLS) |
| **PDF Processing** | Puppeteer Core, `@sparticuz/chromium` |
| **Deployment** | Vercel |

---

## 📁 Repository Structure

```text
Maestro-Career/
├── data/                 # Raw dataset configurations
├── docs/                 # Review logs and core application specs
├── documentation/        # Feature blueprints and diagram schemas
├── plans/                # UI execution plans and wireframe docs
├── public/               # Static icons, vector assets, and brand media
├── scripts/              # Build utilities (PDF compilation, review extractors)
├── src/                  # Application source
│   ├── app/              # Next.js App Router pages and API endpoints
│   ├── components/       # UI component library & interactive widgets
│   └── data/             # Generated JSON datasets
├── supabase/             # Database migrations and configuration schemas
├── .env.example          # Environment variable template
├── PLAN.md               # Milestones & UI execution tracking
├── SYNOPSIS.md           # System synopsis & technical roadmap
└── SYSTEM_OVERVIEW.md    # Core platform architecture details
