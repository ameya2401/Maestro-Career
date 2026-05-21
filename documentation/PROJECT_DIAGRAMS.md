# Maestro Career - List of Figures & Diagrams

This document translates your requested figure list into the **Maestro Career** architecture context. It contains standard **Mermaid.js** code blocks that you can copy into any Markdown viewer (like GitHub or Notion), or paste into [Mermaid Live Editor](https://mermaid.live/) to instantly generate high-quality images for your project report.

---

## 3. System Analysis Diagrams

### 3.1 Gantt Chart for Maestro Career Project
*Shows the agile development life cycle of the platform.*
```mermaid
gantt
    title Gantt Chart for Maestro Career Project
    dateFormat  YYYY-MM-DD
    section Phase 1: Research
    Cognitive Mapping       :done,    des1, 2026-03-05, 5d
    Question Bank Curation  :done,    des2, 2026-03-10, 5d
    section Phase 2: MVP
    Core Test Engine        :done,    des3, 2026-03-15, 5d
    Scoring Logic           :done,    des4, 2026-03-20, 5d
    section Phase 3: Integration
    Auth & DB (Supabase)    :done,    des5, 2026-03-25, 5d
    Payment Gateway Setup   :done,  des6, 2026-03-30, 5d
    PDF Export (Puppeteer)  :done,    des7, 2026-04-05, 5d
    section Phase 4: UI/UX           
    Explore Hub Redesign    :done,    des8, 2026-04-10, 5d
    Intelligence Dossier    :done,    des9, 2026-04-15, 5d
    section Phase 5: Deploy
    Vercel Edge Deployment  :done,    des10, 2026-04-20, 3d
```

### 3.2 DFD Level 0 – Maestro Career System
*High-level context diagram showing major external entities.*
```mermaid
graph TD
    User([User / Student]) -- "Takes Assessment, Selects Plan" --> System[Maestro Career System]
    Admin([Sys Admin]) -- "Manages Users, Grants Access, Views Reports" --> System
    System -- "Provides Intelligence Dossier PDF" --> User
    System -- "Sends Auth/Notification Emails" --> Email[Brevo SMTP]
    System -- "Processes Payments" --> PG[Razorpay Gateway]
    System -- "Stores Auth & Result Data" --> DB[(Supabase PostgreSQL)]
```

### 3.3 DFD Level 1 – Maestro Career System
*Detailed data flow between subsystems.*
```mermaid
graph TD
    User([User]) -->|1. Login / Register| AuthM[Authentication Module]
    AuthM -->|Read/Write User Data| DB[(Supabase DB)]
    User -->|2. Initiates Payment| PayM[Payment Module]
    PayM -->|Verify Transaction| PG[Razorpay]
    PG -->|Callback Success| PayM
    PayM -->|Update Payment Status| DB
    Admin([Admin]) -->|3. Grant Access| TestM[Test Engine Module]
    TestM <-->|Check Grants| DB
    User -->|4. Submit 50 Questions| TestM
    TestM -->|Calculate Scores & Percentile| TestM
    TestM -->|Store Results| DB
    User -->|5. Request Intelligence Report| RepM[Reporting Module]
    RepM <-->|Fetch Latest Result| DB
    RepM -->|Generate PDF via Puppeteer| RepM
    RepM -->|Return PDF Dossier| User
```

### 3.4 Maestro Career Use Case Diagram
*System interactions based on actor roles.*
```mermaid
graph LR
    User([Subject / User])
    Admin([Administrator])

    Reg(Register/Login)
    Pay(Purchase Plan)
    TakeTest(Take 12-Factor Test)
    ViewDash(View Progress Dashboard)
    GetPDF(Download Intelligence Dossier)
    
    GrantAccess(Grant Test Access)
    ViewUser(View Analysis Hub & Lead Data)
    
    User --> Reg
    User --> Pay
    User --> TakeTest
    User --> ViewDash
    User --> GetPDF

    Admin --> Reg
    Admin --> GrantAccess
    Admin --> ViewUser
```

---

## 4. Architectural Design

### 4.1 ER Structure of the Maestro Career System
*Core entity-relationship mapping for the assessment database.*
```mermaid
erDiagram
    PROFILES {
        uuid id PK
        string full_name
        string email
        string user_type "(student/professional)"
        string payment_status "(paid/unpaid)"
    }
    ASSESSMENT_ATTEMPTS {
        uuid id PK
        uuid user_id FK
        string status "(active/completed)"
        jsonb raw_responses
        timestamp completed_at
    }
    ASSESSMENT_RESULTS {
        uuid id PK
        uuid user_id FK
        uuid attempt_id FK
        jsonb aptitude_scores
        jsonb psychometric_scores
        jsonb career_dna
        jsonb archetype
    }
    
    PROFILES ||--o{ ASSESSMENT_ATTEMPTS : "initiates"
    ASSESSMENT_ATTEMPTS ||--|| ASSESSMENT_RESULTS : "yields"
    PROFILES ||--o{ ASSESSMENT_RESULTS : "owns"
```

### 4.2 Application Component Structure
*React/Next.js frontend architectural relationship.*
```mermaid
classDiagram
    class DashboardPage {
        +loadData()
        +renderIntelligenceCard()
    }
    class TestEngine {
        -timeLeft: int
        -currentIndex: int
        +checkAccess()
        +submitResponses()
    }
    class ReportViewer {
        +data: ReportData
        +isPrinting: boolean
        +renderCognitiveVenn()
        +renderCareerGenome()
    }
    class SupabaseServerClient {
        +auth.getUser()
        +from('tables').select()
    }
    
    DashboardPage ..> SupabaseServerClient : fetches latest result
    TestEngine ..> SupabaseServerClient : posts user responses
    DashboardPage --> ReportViewer : routes to /report
```

### 4.3 End-to-End User Workflow
*State diagram of the user journey from landing page to PDF generation.*
```mermaid
stateDiagram-v2
    [*] --> LandingPage
    LandingPage --> ExplorationHub : Explores Archetypes
    LandingPage --> Auth : Login/Register
    Auth --> Dashboard : Authenticated
    Dashboard --> PlanSelection : If Unpaid
    PlanSelection --> Razorpay : Process Payment
    Razorpay --> Dashboard: Payment Success
    Dashboard --> AdminVerification : Await Clearance
    AdminVerification --> Dashboard : Access Granted
    Dashboard --> AssessmentEngine : Start 60m Timer
    AssessmentEngine --> ScoringAPI : Submit MCQ Answers
    ScoringAPI --> Dashboard : Result Saved
    Dashboard --> IntelligenceDossier : View Web Report
    IntelligenceDossier --> PuppeteerAPI : Request Print
    PuppeteerAPI --> [*] : Download High-DPI PDF
```

---

## 6. Implementation User Interfaces (Screenshots Checklist)

*Because these must be actual screenshots of the application running, here is the tailored list of 8 screenshots you should capture directly from your `localhost:3001` or Vercel deployment to place in your project report document.*

* **Figure 6.1**: **Landing Page of Maestro Career** showing the Hero section and 3D UI aesthetics.
* **Figure 6.2**: **Intelligence Discovery Engine (`/explore`)** showing the Archetype Matrix and Cognitive Dial in dark mode.
* **Figure 6.3**: **Secure Authentication Interface (`/login`)** showing the email/password and Google login panel.
* **Figure 6.4**: **User Data & Progress Dashboard (`/dashboard`)** showing the "Active Plan" and the green "Intelligence Analysis Ready" card.
* **Figure 6.5**: **Timed Assessment Engine Interface (`/test`)** showing the 60-minute countdown timer and the interactive MCQ selection layout.
* **Figure 6.6**: **Admin Analysis Hub (`/admin/dashboard`)** showing the internal lead management table, "Grant Test Access", and "Fetch PDF" controls.
* **Figure 6.7**: **Intelligence Dossier Web View (`/report`)** focusing on the Global Percentile Rank, pure SVG Cognitive Venn, and Radar Charts.
* **Figure 6.8**: **Final Downloaded Print-Ready PDF output** of the Intelligence Dossier (showing A4 formatting).
