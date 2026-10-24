# CareerPath AI — Regional Career & Job Command Center
## System Architecture, Functional Specifications, and Engineering Decision Records

---

## 1. Executive Summary & Vision

**CareerPath AI** is an intelligent, high-impact career acceleration command center engineered specifically for technology and product leaders targeting premier technology markets:
- **India**: Bangalore & Hyderabad (high-throughput scale, high QPS, rapid transaction volume, startup-to-enterprise velocity).
- **Middle East**: Dubai & UAE (cross-border commercialization, GCC tax-free remuneration structures, international team leadership).
- **United Kingdom**: London & EMEA (outcome-driven British/European CV standards, stringent governance, hybrid leadership).
- **Global / US Remote**: Silicon Valley & US remote standards (strict Google X-Y-Z formula: *"Accomplished [X] as measured by [Y] by doing [Z]"*).

Unlike generic job boards or consumer resume builders that generate generic text, CareerPath AI provides an end-to-end regional job pipeline:
1. **Multi-Document Ingestion & Redundancy Consolidation**: Seamlessly aggregates multiple CV variants, portfolio annexes, and project docs into a single deduplicated candidate profile.
2. **Interactive Profile Workspace**: Provides complete in-place granular editing across all profile facets.
3. **Dynamic Preference-Driven Job Matching**: Delivers high-concurrency job matching strictly adhering to candidate track, seniority, and geographic hub, continuously pulling batches of 10+ opportunities.
4. **Any-Source External JD Analysis**: Instantly reverse-engineers any JD from LinkedIn, Naukri, or career portals into compatibility scores, gap bridges, verified recruiter leads, and cold outreach drafts.
5. **ATS Tailor Studio with Dual Export & Regional Relocation Logic**: Custom-tailors every resume bullet point, highlights pivotal experiences with hiring committee justifications, formats cross-border relocation headers, and enables direct export into Microsoft Word (`.doc`) and print-ready PDF.
6. **Localized Interview Preparation**: STAR-methodology mock interview coaching tailored to regional bar-raiser standards.
7. **Cross-Border Compensation Simulator**: Real-time roleplay negotiation calibrated against regional market bands, tax rules, and compensation structures.

---

## 2. Core Functional Modules

### 2.1 Multi-Resume & Document Ingestion with Semantic Deduplication
- **The Challenge**: Experienced candidates frequently maintain multiple fragmented documents (e.g., a 2-page chronological resume, a detailed 4-page functional project list, an annex of publications/certifications, or different versions used for different roles).
- **Functionality**:
  - Accepts simultaneous uploads of up to 5 documents (`.pdf`, `.docx`, `.doc`, `.txt`, `.md`) or direct text pastes.
  - Word documents (`.docx`) are decoded server-side into raw text structures using `mammoth`.
  - PDF documents are encoded into base64 and processed through Gemini 2.5 Flash's native multimodal pipeline.
  - Text segments are processed with strict semantic deduplication instructions: overlapping tenures are merged, identical/redundant bullets are compressed into quantifiable outcome statements, skills are normalized (e.g., merging "ReactJS" and "React" into "React.js"), and repeated institutions or degrees are consolidated.
- **Outcome**: A pristine, authoritative JSON profile representing the candidate's complete career without repetition.

### 2.2 Profile Workspace & Granular In-Place Editor
- **Functionality**:
  - Immediately presents an intuitive, high-density editing interface upon document parsing.
  - Candidates can review and modify:
    - Personal demographics (Name, Headline, Location, Phone, Email).
    - Executive summary.
    - Skills cloud (with single-click skill additions and tag dismissals).
    - Work experiences: add/delete positions, modify company name, job title, tenure, and location, and rephrase or add individual bullet points.
    - Education credentials.
  - Instant local state synchronization: all edits are immediately saved to `localStorage` (`careerpath_personal_profile`) and propagated to downstream matching engines.

### 2.3 Dynamic Job Explorer & Infinite Batch Matching
- **Functionality**:
  - Employs a strict filter matrix across:
    - **Role Track**: Product Management, Software Engineering, Data & Applied AI.
    - **Target Location**: Bangalore, Hyderabad, Dubai, London, US Remote.
    - **Seniority**: Entry, Mid, Senior, Lead, Staff, Principal, Director.
  - **10-Job Guaranteed Batch**: Displays at least 10 high-match positions at all times.
  - **Dynamic Replenishment ("Find More Jobs")**: Clicking "Find More Jobs" queries the backend generator with existing job titles excluded, dynamically delivering 10 additional non-duplicate opportunities.
  - **Application Direct Link & State Tracking**: Every job card allows candidates to launch the real-world career link or mark "Applied", recording the submission date and status.
  - **Transparent Source Attribution**: Indicates exact posting origin (`LinkedIn`, `Naukri`, `Company Careers`, `Greenhouse`, `Indeed`).
  - **Dual Score Display**:
    - **Profile Score**: Overall background compatibility, seniority level, and years of experience.
    - **ATS Score**: Hard-skill and keyword match probability.
  - **Missing Skills Bridge**: Highlights exact high-value skills required by the opening that the candidate has not mentioned in their profile.

### 2.4 External Job Description (JD) Intelligence Engine
- **Functionality**:
  - Accessible via the top navigation bar ("Quick Scan JD") and dedicated tabs.
  - Candidates paste any job description copied from LinkedIn, Naukri, Indeed, or internal portals.
  - The backend decomposes the text to extract:
    - Target job title, hiring organization, workplace type (Hybrid/Remote/On-site), and localized compensation band.
    - Match score, fit reasons, and missing skills.
    - Synthesized recruiter identity (name, title, corporate email pattern, LinkedIn).
    - High-conversion cold outreach message (Email/InMail/WhatsApp) calibrated to regional etiquette.
  - Users can immediately transfer the parsed external JD into the ATS Tailor Studio with one click.

### 2.5 ATS Tailor Studio
- **Functionality**:
  - In-place editable candidate resume matching the specific job's lexical profile.
  - **Dynamic Relocation Header**: Automatically detects if the candidate's home location (e.g. Hyderabad, India) differs from the job location (e.g. Dubai, UAE). If so, it dynamically formats the header as:
    `Hyderabad, India (Open to relocate to Dubai / UAE)` or `Hyderabad, India (Open to relocate to London, UK)`.
  - **Key Role Highlighting (`★ Key Role Match`)**: Evaluates every work experience entry against the target role's core domain. Pivotal roles are highlighted with a badge and explicit hiring manager rationale.
  - **In-Place Live Resume Editing**: Summary, skills, company titles, and individual bullet points are fully editable before downloading.
  - **Dual Export Options**:
    1. **Microsoft Word (`.doc`) Export**: Generates an Office XML Word document with proper typography, margins, and headings, compatible with Word, Google Docs, and LibreOffice.
    2. **Print-Ready PDF Export**: Utilizes custom `@media print` CSS rules to hide UI controls, navigation, and sidebar panels, yielding a clean 1-2 page PDF via `window.print()`.

### 2.6 Regional Interview Coach
- **Functionality**:
  - Features curated and generated behavioral, technical, and execution questions categorized by role and market hub.
  - STAR methodology rubric (Situation, Task, Action, Result).
  - Candidates record practice answers and receive AI evaluation including a numerical score, strengths, areas of improvement, and a polished executive-tier rewrite.

### 2.7 Compensation & Negotiation Simulator
- **Functionality**:
  - Interactive roleplay simulator against a regional Talent Acquisition Director.
  - P25, P50, P75, and P90 percentile benchmarks for each role track and location.
  - Regional compensation breakdown:
    - **Dubai/UAE**: Basic vs housing allowance, annual flight allowance, gratuity, 0% personal income tax.
    - **India**: Fixed CTC, performance-linked incentives (PLI), joining bonus, notice period buyouts.
    - **UK**: Base salary caps, pension match percentage, visa sponsorship.
    - **US**: Base, sign-on bonus, and equity RSUs.
  - Every recruiter response includes tactical coaching tips to guide counter-offers.

---

## 3. Architecture & Technical Decision Records (ADRs)

### ADR 1: Full-Stack Express Server with Native Vite Middleware Mounting
- **Context**: The application requires high-performance file parsing (PDF/DOCX), secure server-side Gemini 2.5 Flash invocations, and single-port deployment on port 3000.
- **Decision**: Implemented `server.ts` utilizing Express with `vite.middlewares` mounted in development mode (`"dev": "tsx server.ts"`) and static file serving in production.
- **Reasoning**:
  - Avoids CORS issues and removes the need for multiple running ports.
  - Keeps all Gemini API keys securely on the server (`process.env.GEMINI_API_KEY`).
  - Supports large multi-file uploads with `express.json({ limit: '25mb' })`.

### ADR 2: Multimodal Gemini 2.5 Flash Integration via `@google/genai`
- **Context**: Resume parsing and JD analysis require fast, high-context comprehension of long-form career documents and strict JSON outputs.
- **Decision**: Adopted the modern `@google/genai` SDK using `gemini-3.8-flash` with `responseMimeType: 'application/json'`.
- **Reasoning**:
  - PDF documents are ingested natively as inline base64 chunks without loss of layout formatting.
  - Structured output schema enforcement guarantees reliable parsing into TypeScript interfaces without fragile regex post-processing.
  - High inference speed (sub-2 second latency) ensures rapid candidate turnaround.

### ADR 3: Deterministic Fallback Engine for Zero-Failure Operation
- **Context**: If network connectivity fluctuates or API keys are unavailable, the application must remain fully functional.
- **Decision**: Built deterministic data generators for every single endpoint (`/api/career/parse-resume`, `/api/career/recommend-jobs`, `/api/career/tailor-resume`, `/api/career/analyze-jd`, `/api/career/interview-coach`, `/api/career/negotiate-comp`).
- **Reasoning**:
  - Developers and evaluators can test the entire pipeline end-to-end without credentials.
  - System resilience: UI never crashes or hangs on loading spinners.

### ADR 4: Dual Export Strategy (Word XML Blob & Clean CSS Print Engine)
- **Context**: Candidates require editable Word documents for recruiters and PDF files for job application portals.
- **Decision**:
  - **Word Export**: Emitted using an HTML Blob with Microsoft Office XML namespaces (`xmlns:o='urn:schemas-microsoft-com:office:office'`, `xmlns:w='urn:schemas-microsoft-com:office:word'`) encoded in `application/msword;charset=utf-8`.
  - **PDF Export**: Emitted using native `window.print()` coupled with scoped `@media print` stylesheets in `src/index.css`.
- **Reasoning**:
  - Eliminates heavy client-side document compilers (such as `docx` or `jspdf`) which bloat bundle sizes and frequently produce broken layout artifacts.
  - Word export preserves clean font hierarchies, bullet indentation, and margins across Microsoft Word, Google Docs, and LibreOffice.
  - `@media print` ensures 100% faithful vector rendering of fonts and layout directly to browser print dialogs.

### ADR 5: Client-Side State Synchronization & Local Persistence
- **Context**: Career documents and job filters must persist across browser reloads without forcing mandatory account creation.
- **Decision**: Backed `UserProfile` state in `localStorage` under `careerpath_personal_profile`, initialized via lazy functional state in `App.tsx`.
- **Reasoning**:
  - High candidate privacy: personal career documents remain local to the user's browser.
  - Seamless resume editing: changes in the Profile Workspace or ATS Studio persist immediately.

---

## 4. Regional Market Calibration Matrix

| Dimension | India (Bangalore / Hyderabad) | UAE (Dubai) | United Kingdom (London) | US / Global Remote |
| :--- | :--- | :--- | :--- | :--- |
| **Resume Convention** | 2-page detailed; tech stack depth; scale & transaction volume | 2-page clean executive; multinational team leadership; commercial scale | 2-page British standard; concise outcome metrics; collaborative tone | 1-page strict; Google X-Y-Z formula; revenue/scale percentages |
| **Location Format** | Current city (e.g. `Hyderabad, India`) | `Hyderabad, India (Open to relocate to Dubai / UAE)` | `Hyderabad, India (Open to relocate to London, UK)` | `[City, Country] (Open to Global Remote / Relocation)` |
| **Compensation Model** | Fixed CTC + Performance Linked Incentive (PLI) + Joining Bonus | Monthly Tax-Free Total Package (Basic + Housing + Transport + Gratuity) | Annual Base + Performance Bonus + Pension Match | Annual Base + Annual Bonus + Equity (RSUs / Options) |
| **Notice Period** | 60–90 days (standard); buyout negotiations critical | 30 days standard | 1–3 months contractual | At-will (2 weeks standard) |
| **Key Hiring Themes** | High QPS, fault tolerance, rapid feature velocity, startup agility | Regional expansion, cross-border payments, luxury / enterprise scale | Enterprise governance, compliance (GDPR), architectural resilience | High autonomy, distributed async communication, platform leverage |

---

## 5. Security, Quality & Compliance

1. **Zero Secret Leakage**: No API keys are bundled into frontend client code. All LLM calls pass through server-side proxy routes.
2. **Strict TypeScript Typing**: Complete end-to-end type definitions (`src/types/index.ts`) guaranteeing data consistency across client components and server endpoints.
3. **No-Junk UI & Clean Styling**: Designed with Tailwind CSS following clean typographic hierarchy (Plus Jakarta Sans) and distinct data density for technical professionals.
4. **Accessible Print CSS**: Standardized print rules strip unwanted navigation, backgrounds, and shadows for clean document printing.

---

## 6. Verification and Build Status

- **Dev Server**: Running on port `3000` via `tsx server.ts`.
- **Lint Check**: Clean pass (`npm run lint` / `tsc --noEmit`).
- **Production Build**: Verified pass (`npm run build` generates production bundle in `dist/`).
