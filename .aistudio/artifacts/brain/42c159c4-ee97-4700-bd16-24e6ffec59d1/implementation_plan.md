# CareerPath AI — Next-Gen Regional Career Command Center

CareerPath AI is a personalized career acceleration platform tailored for tech, product, and data professionals. It empowers job seekers to ingest their resume, define granular role hierarchies and target tech hubs (e.g., Bangalore, Hyderabad, Dubai, London, US/Global), analyze any external job description (from LinkedIn, Naukri, or career portals), generate regionally calibrated ATS-optimized resumes and recruiter outreach emails, practice localized interview rounds, and negotiate market-specific compensation packages.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following revisions have been incorporated based on your specific requirements:

- **External JD Parser & Match Engine (LinkedIn, Naukri, Portals)**: A dedicated "Analyze External Job Description" workbench. Users can paste any JD text or link from LinkedIn, Naukri, or company careers pages to instantly generate a 0–100% profile compatibility score, pinpoint keyword gaps, generate a tailored ATS resume, and draft a high-converting recruiter direct outreach message.
- **Granular Role Hierarchy & Track Filtering**: Dynamic intake allowing users to select target role families and titles. For example, selecting **Product Management** surfaces relevant tiered titles (Associate PM, PM, Senior PM, Lead PM, Staff PM, Principal PM, Product Director, VP Product); selecting **Software Engineering** spans (SDE I/II/III, Lead, Staff, Principal, Engineering Manager); selecting **Data & AI** spans (Data Analyst, Analytics Engineer, ML Engineer, Applied AI Scientist, AI Tech Lead).
- **Regional Market Localization (Geographic Intelligence)**:
  - **Bangalore & Hyderabad (India Tech Hubs)**: Calibrated for Indian CTC structures (Fixed Base vs Variable/Performance Bonus, PF/Gratuity), notice period dynamics (30/60/90-day buyout strategies), Indian ATS formatting, machine coding/system design interview expectations, and recruiter WhatsApp/direct email norms.
  - **Dubai & UAE (Middle East / GCC Tech Hub)**: Calibrated for UAE tax-free compensation packages (Basic Salary + Housing Allowance + Transport Allowance + Family Health/Education + End of Service Gratuity), UAE labor laws, multinational leadership expectations, and cross-border relocation/visa processes.
  - **London & UK / European Tech**: Calibrated for UK GBP compensation (£ Base + Pension Match + Discretionary Bonus + RSUs), UK 2-page CV structure, competency-based interviews (Civil Service/STAR rubrics), and visa sponsorship (Skilled Worker Visa) considerations.
  - **US / North America & Remote Global**: Calibrated for US USD Total Compensation (Base + Equity RSU/ISO + Signing Bonus), strict 1-page single-column ATS format without personal/demographic details, and behavioral/system design bar-raiser interviews.

---

## 1. Overview & Core Concept

### What It Does
CareerPath AI acts as a localized, AI-powered career strategist and job application engine. It connects:
1. **Resume & Career Intake**: Parses user CV/resume, extracts verified competencies, and captures role preferences (e.g., Product Management, Software Engineering, AI/Data) and target geographies (Bangalore, Hyderabad, Dubai, London, US, Remote).
2. **Preference-Driven Job Matchmaking**: Recommends curated openings matching the candidate's exact role hierarchy and location, with clear match ratings, missing qualifications, and hiring manager contacts.
3. **External Job Description Ingestion**: Ingests raw job descriptions from LinkedIn, Naukri, Indeed, or career portals, producing instant gap analysis and ATS tailoring.
4. **Location-Specific ATS Resume Tailor**: Renders an ATS-friendly, keyword-dense resume formatted according to regional standards (e.g. Dubai multi-currency package context, UK CV brevity, India CTC & tech stack clarity, US strict 1-page structure).
5. **Direct Recruiter Outreach Engine**: Generates personalized, high-converting recruiter cold emails, LinkedIn InMail messages, and WhatsApp introductions based on regional business etiquette.
6. **Localized Interview Planner & Coach**: Generates behavioral, technical, case study, and market-specific questions (e.g. Dubai market expansion cases, Bangalore machine-coding rounds, UK competency criteria).
7. **Compensation Radar & Offer Negotiation**: Provides market-benchmarked salary percentiles (INR Lakhs, AED/month, GBP, USD) and simulates negotiations factoring in regional benefits, allowances, and taxes.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Intake & Regional Calibration**:
   - User uploads their CV (or clicks an instant demo profile: *Product Leader targeting Dubai/London*, *Staff Engineer targeting Bangalore/Hyderabad*, or *AI Specialist targeting US/Remote*).
   - User configures their **Career Track & Seniority** (e.g., *Product Management: Senior PM / Lead PM / Staff PM*) and **Target Market** (*Hyderabad*, *Bangalore*, *Dubai*, *London*, or *US/Global*).
2. **Job Discovery & External JD Analyzer**:
   - *Curated Stream*: Browse roles pre-filtered by selected role family and location.
   - *External Scanner*: Switch to the "Analyze Any External JD" tab to paste a JD from LinkedIn or Naukri. The AI detects the role level, required skills, and matches against the user's profile in real time.
3. **Localized ATS Resume Studio**:
   - Side-by-side view of the original vs tailored resume.
   - Regional compliance toggle automatically adjusts headers, layout norms, and keyword density.
   - 1-click export to ATS-Clean Markdown, formatted Text, or printable PDF.
4. **Recruiter Direct Connect & Outreach**:
   - Surfaces recruiter/hiring manager details (Name, Title, Email, LinkedIn, Region).
   - Generates customized outreach messages tailored for LinkedIn InMail, Email (`mailto:`), or direct professional message, with regional tone calibration (e.g., formal UK tone vs confident Silicon Valley tone vs respectful GCC executive tone).
5. **Targeted Interview Prep**:
   - Practice role-specific question sets (e.g., Product Execution, System Design, Product Strategy, Metric Defense) with STAR framework evaluation and region-aware interview cultural tips.
6. **Compensation & Offer Strategy**:
   - Visual salary bands based on exact role and location (e.g. Dubai AED 35k–55k/month tax-free vs Bangalore ₹45L–₹75L CTC vs London £95k–£140k).
   - Counter-offer generator and conversational negotiation practice with an AI recruiter.

### Visual Identity & Theme
- **Aesthetic Direction**: High-trust, executive SaaS command center with crisp typographic hierarchy and zero-pill discipline.
- **Color Distribution (60-30-10)**:
  - 60% Clean Neutral Canvas: Slate-50 background (`#F8FAFC`) with pure white card surfaces (`#FFFFFF`).
  - 30% Structural Surfaces: Hairline slate borders (`border-slate-200 dark:border-slate-800`), muted typography (`text-slate-600 dark:text-slate-400`).
  - 10% Purposeful Accents: Deep Indigo (`#4338CA`) for primary actions, Emerald (`#059669`) for high compatibility & verified recruiter badges, and Amber (`#D97706`) for keyword gap alerts.
- **Typography**: `Plus Jakarta Sans` / `Outfit` for confident display headings; `DM Sans` / `Plus Jakarta Sans` for body copy; tabular figures (`tabular-nums font-mono`) for all match percentages, compensation numbers, and dates.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Deep Regional Customization Engine
- **Approach**: All AI prompts and templates (resume styling, recruiter emails, interview coaching, salary benchmarks) dynamically ingest the user's selected location parameter (`Bangalore`, `Hyderabad`, `Dubai`, `London`, `US/Global`).
- **Why**: Standard generic career tools fail because hiring practices differ fundamentally between regions (e.g. Dubai compensation is framed in monthly AED with housing/gratuity, Indian tech hiring heavily scrutinizes notice periods and fixed vs variable CTC, and UK applications require strict compliance with British CV formats).

### Decision 2: Dual Intake Architecture (Internal Matched Database + Any External JD)
- **Approach**: The app provides a curated database of 16+ benchmark opportunities across Bangalore, Hyderabad, Dubai, and London, plus an instant parser for any external job text from LinkedIn, Naukri, or career portals.
- **Why**: Allows users to test and explore immediately without manual input, while delivering complete flexibility to analyze any real-world opportunity they discover online.

### Decision 3: Express Backend Proxy with Server-Side Gemini 3.8 Flash
- **Approach**: Secure server-side routes handle resume parsing, JD comparison, ATS bullet rewriting, and negotiation simulations using `@google/genai` and `gemini-3.8-flash`.
- **Why**: Ensures zero exposure of user secrets, provides resilient error handling and JSON schema enforcement, and maintains snappy sub-second client interactions.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CAREERPATH REGIONAL COMMAND CENTER                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       ┌────────────────────────┐      ┌─────────────────────────┐
       │   Top Bar Contract     │      │   Regional Context      │
       │  Wordmark · Breadcrumbs│      │  Location: BLR/HYD/DXB/ │
       │    Primary Action CTA  │      │  LON · Role Hierarchy   │
       └────────────────────────┘      └────────────┬────────────┘
                                                    │
       ┌────────────────────────────────────────────┼────────────────────────────────────────┐
       ▼                                            ▼                                        ▼
┌───────────────────────┐              ┌────────────────────────┐               ┌────────────────────────┐
│  Profile & Preferences│              │  Job Explorer &        │               │  ATS Resume Studio     │
│  - CV Upload / Paste  │              │  External JD Scanner   │               │  - Location-Calibrated │
│  - Role Track (PM, SDE│              │  - LinkedIn / Naukri   │               │  - Keyword Density     │
│    Data, AI Specialist│              │  - Match Rating (0-100)│               │  - Impact Rewriter     │
│  - Location Hub Picker│              │  - Recruiter Contacts  │               │  - PDF & Clean Export  │
└───────────────────────┘              └────────────────────────┘               └────────────────────────┘
       ▲                                            ▲                                        ▲
       │                                            │                                        │
       └────────────────────────┬───────────────────┴───────────┬────────────────────────────┘
                                │                               │
       ┌────────────────────────▼──────────────┐  ┌─────────────▼────────────────────────────┐
       │  Interview Planner & Coach            │  │  Salary & Negotiation Radar              │
       │  - Regional Question Focus            │  │  - Localized Currency Bands (INR/AED/GBP)│
       │  - STAR Answer Evaluator              │  │  - CTC vs Allowance vs Total Comp        │
       │  - Cultural Interview Tips            │  │  - Interactive Recruiter Negotiation    │
       └───────────────────────────────────────┘  └──────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND SERVER (Node.js)                    │
│                                                                        │
│  POST /api/career/parse-resume       -> Extract skills, roles, history │
│  POST /api/career/analyze-jd         -> Compare CV to external JD      │
│  POST /api/career/tailor-resume      -> Regional ATS-compliant rewrite │
│  POST /api/career/generate-outreach  -> Recruiter email / InMail draft │
│  POST /api/career/interview-coach    -> STAR questions & critique      │
│  POST /api/career/salary-benchmark   -> Role/Location comp percentiles │
│                                                                        │
│                       @google/genai (gemini-3.8-flash)                 │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Core Entities
- **UserProfile**: `id`, `name`, `email`, `targetRoleTrack` (e.g., `Product Management`), `targetSeniority` (e.g., `Staff / Principal PM`), `targetLocations` (e.g., `Dubai`, `Bangalore`), `currentCTC`, `noticePeriod`, `skills[]`, `experiences[]`.
- **TargetLocation**: `id` (`blr` | `hyd` | `dxb` | `lon` | `us`), `name`, `currency` (`INR` | `AED` | `GBP` | `USD`), `marketTraits` (e.g. tax-free packages, fixed vs variable CTC, visa sponsorship rules, interview round styles).
- **JobOpportunity**: `id`, `title`, `company`, `location`, `roleTrack`, `salaryRange`, `description`, `recruiter`: `{ name, role, email, linkedIn, companyDomain }`, `matchScore`, `keyFitReasons[]`, `missingSkills[]`, `isExternal`.
- **ATSResume**: `profileId`, `jobId`, `location`, `tailoredSummary`, `optimizedExperiences[]`, `targetedSkills[]`, `atsScore`, `matchedKeywords[]`, `suggestedChanges[]`.
- **OutreachMessage**: `recipientName`, `recipientRole`, `recipientEmail`, `subject`, `body`, `channel` (`email` | `inmail` | `whatsapp`), `localizedNotes`.
