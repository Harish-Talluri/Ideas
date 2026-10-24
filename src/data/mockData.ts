import { LocationHub, LocationHubConfig, UserProfile, JobOpportunity, SalaryBenchmark, InterviewQuestion } from '../types';

export const LOCATION_HUBS: Record<LocationHub, LocationHubConfig> = {
  bangalore: {
    id: 'bangalore',
    name: 'Bangalore / Bengaluru',
    country: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    marketHighlights: [
      'Silicon Valley of India with top tier SaaS, Fintech & Unicorns',
      'Heavy focus on fixed CTC vs performance variable bonus (typically 80:20 or 85:15)',
      'Notice period negotiation (30 to 90 days) is a major hiring factor'
    ],
    compStructure: 'Annual CTC (Fixed Base + Variable Performance Bonus + Retirals PF/Gratuity + ESOPs/RSUs)',
    hiringCulture: 'Fast-paced technical screens, machine coding rounds, and deep architectural system design',
    resumeStandards: '2 pages standard, clear tech stack breakdown, quantifiable business scale and revenue metrics'
  },
  hyderabad: {
    id: 'hyderabad',
    name: 'Hyderabad',
    country: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    marketHighlights: [
      'Major global tech center (Microsoft, Amazon, Google, Apple tech hubs)',
      'High growth in enterprise cloud, cybersecurity, and global capability centers (GCCs)',
      'Competitive compensation with favorable cost-of-living relative to Bangalore'
    ],
    compStructure: 'Annual CTC (Fixed + Annual Incentive + Long-Term Equity/RSU)',
    hiringCulture: 'Structured behavioral and scalable systems engineering rounds with global team alignment',
    resumeStandards: 'Clean 2-page format highlighting enterprise-grade delivery, SLA ownership, and scale'
  },
  dubai: {
    id: 'dubai',
    name: 'Dubai & UAE',
    country: 'United Arab Emirates',
    currency: 'AED',
    currencySymbol: 'AED',
    marketHighlights: [
      '100% Tax-Free Income environment in the GCC innovation corridor',
      'Relocation packages, family visa sponsorship, and private healthcare commonly included',
      'End of Service Gratuity (mandatory UAE labor law terminal benefit)'
    ],
    compStructure: 'Monthly Total Package (Basic Salary 60% + Housing Allowance 30% + Transport Allowance 10%)',
    hiringCulture: 'Global executive presence, cross-border team leadership, and regional market expansion acumen',
    resumeStandards: '2 pages, clean executive summary, visa status or relocation readiness, multi-market achievements'
  },
  london: {
    id: 'london',
    name: 'London & UK',
    country: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    marketHighlights: [
      'Fintech capital of Europe, strong Web3, AI labs, and mature tech sector',
      'Skilled Worker Visa sponsorship or existing UK right-to-work is pivotal',
      'Generous statutory annual leave (25-30 days) + Workplace Pension Match (5-10%)'
    ],
    compStructure: 'Annual Base Salary + Discretionary Annual Bonus + Pension Contribution + Equity',
    hiringCulture: 'Competency-based interviews (STAR framework), collaboration culture, and structured case studies',
    resumeStandards: '2-page concise CV, strictly no photos or personal marital details, crisp outcome-oriented bullets'
  },
  us_remote: {
    id: 'us_remote',
    name: 'US & Global Remote',
    country: 'United States / Global',
    currency: 'USD',
    currencySymbol: '$',
    marketHighlights: [
      'Industry-leading total compensation packages with high liquid equity (RSUs/Options)',
      'At-will employment standard with rapid hiring cycles',
      'Strict ATS scanner compliance (single column, parseable headers, zero tables/graphics)'
    ],
    compStructure: 'Annual Base Salary + Sign-on Bonus + Annual Target Bonus + 4-Year Equity Vesting Schedule',
    hiringCulture: 'Rigorous bar raiser loops, behavioral leadership principles, and distributed team asynchronous skills',
    resumeStandards: 'Strict 1-page format (under 10 years experience), metrics-first Google X-Y-Z bullet format'
  }
};

export const EMPTY_USER_PROFILE: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  headline: '',
  location: '',
  targetRoleTrack: 'product',
  targetSeniority: 'senior',
  targetLocations: ['bangalore', 'dubai', 'hyderabad'],
  currentSalary: '',
  noticePeriod: '',
  summary: '',
  skills: [],
  experiences: [],
  education: [],
};

export const DEMO_PROFILES: UserProfile[] = [];

export const CURATED_JOBS: JobOpportunity[] = [
  // Product Management Roles
  {
    id: 'job_pm_dubai_talabat',
    title: 'Senior Product Manager — Growth & Checkout',
    company: 'Talabat (Delivery Hero MENA)',
    companyLogoText: 'TB',
    location: 'Dubai, UAE',
    locationHub: 'dubai',
    roleTrack: 'product',
    seniorityLevel: 'senior',
    workplaceType: 'Hybrid',
    salaryRange: 'AED 38,000 – AED 48,000 / month (Tax-Free) + Bonus + Relocation',
    currency: 'AED',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/senior-product-manager-growth-checkout-at-talabat-3891024810',
    postedAgo: '1 day ago',
    description: 'We are seeking an exceptional Senior Product Manager to spearhead checkout experience, multi-currency payment routing, and customer retention across 8 GCC markets. You will own the core conversion funnel from basket to confirmation for over 15 million active food and grocery consumers.',
    fullJobDescription: `ABOUT TALABAT (DELIVERY HERO MENA):
Talabat is the leading on-demand food, grocery, and retail delivery platform in the Middle East and North Africa. Operating across the UAE, Kuwait, Saudi Arabia, Bahrain, Oman, Qatar, Jordan, and Egypt, our product and engineering hubs power millions of daily transactions with sub-second execution.

ROLE OVERVIEW:
As Senior Product Manager — Growth & Checkout, you will report directly to the Director of Product and own the mission-critical checkout, payments, and conversion funnel. Your decisions will directly affect over $4B in annual Gross Merchandise Value (GMV).

CORE RESPONSIBILITIES:
• Own the end-to-end checkout funnel from item add-to-cart through address verification, dynamic delivery slot booking, and payment processing.
• Optimize local payment gateway integrations across GCC (Apple Pay, Mada in KSA, K-Net in Kuwait, Benefit in Bahrain, Debit/Credit cards).
• Partner with Data Science and Machine Learning to design and run continuous multi-variant A/B experiments on checkout friction and cart abandonment.
• Collaborate with regional ops, legal, and finance teams across Dubai, Riyadh, and Cairo to ensure compliance with regional fiscal laws.
• Define North Star metrics (Cart-to-Order Conversion, Payment Success Rate, Repeat 30-day Retention) and report weekly to C-suite leadership.

MINIMUM REQUIREMENTS:
• 5+ years in digital product management with at least 3 years focused on e-commerce, consumer marketplace, or checkout/fintech funnels.
• Proven expertise with experiment design (A/B and multivariate testing), cohort retention analysis, and product analytics (Amplitude, Mixpanel, SQL).
• Demonstrable experience scaling high-volume consumer mobile apps (iOS & Android).
• Outstanding communication and cross-functional stakeholder leadership.

PREFERRED QUALIFICATIONS:
• Direct experience in Middle East / GCC consumer internet or food delivery.
• Familiarity with multi-currency dynamic FX conversion and payment orchestration engines.
• Experience managing API product contracts and microservices architectures.

WHAT WE OFFER:
• Competitive tax-free monthly compensation package (AED 38,000 – AED 48,000).
• Comprehensive private health and life insurance for you and direct dependents.
• Annual flight ticket home, UAE residency visa sponsorship, and generous relocation allowance.
• Mandatory UAE End of Service Gratuity in accordance with UAE Labor Law.`,
    requiredSkills: [
      'Product Strategy',
      'A/B Testing & PLG',
      'Fintech & Payments',
      'User Research & Discovery',
      'SQL & Amplitude'
    ],
    preferredSkills: [
      'GCC E-commerce Experience',
      'Cross-functional Leadership',
      'API Product Management'
    ],
    recommendedSkillsToBridge: [
      'GCC Payment Rails (Mada, K-Net, Benefit)',
      'Arabic RTL Mobile UX Localization',
      'Payment Gateway Orchestration & Fallback Routing'
    ],
    recruiter: {
      name: 'Nadia El-Sayed',
      role: 'Head of Tech & Product Talent Acquisition',
      email: 'nadia.elsayed@deliveryhero-mena.careers',
      linkedIn: 'https://linkedin.com/in/nadia-elsayed-talent',
      companyDomain: 'talabat.com',
      responseRateScore: 94
    },
    matchScore: 95,
    profileScore: 94,
    atsScore: 96,
    keyFitReasons: [
      'Matches your payment funnel and B2B/B2C checkout optimization background.',
      'Aligns with your multi-region scalability achievements.',
      'Strong fit for your Amplitude cohort analysis and experiment-driven approach.'
    ],
    missingSkills: ['Arabic Localization Context (Preferred)'],
    isApplied: false
  },
  {
    id: 'job_staff_pm_blr_razorpay',
    title: 'Staff Product Manager — Core Payment Gateway',
    company: 'Razorpay',
    companyLogoText: 'RZ',
    location: 'Bangalore, India',
    locationHub: 'bangalore',
    roleTrack: 'product',
    seniorityLevel: 'staff',
    workplaceType: 'Hybrid',
    salaryRange: '₹55,00,000 – ₹70,00,000 CTC + High Growth ESOPs',
    currency: 'INR',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/staff-product-manager-core-payment-gateway-at-razorpay-3912049182',
    postedAgo: '3 days ago',
    description: 'Razorpay is hiring a Staff PM to drive the next generation of our Core Payment Gateway, processing over $100B in annual volume. You will lead multi-rail transaction orchestration, auto-refunds, and direct bank API integrations while mentoring a cluster of associate and mid-level product managers.',
    fullJobDescription: `ABOUT RAZORPAY:
Razorpay is India's leading full-stack financial solutions company, empowering over 10 million businesses to accept, process, and disburse payments. We process over $100B in annualized Total Payment Volume (TPV) and power digital transactions for Flipkart, Swiggy, Zomato, BookMyShow, and IRCTC.

THE OPPORTUNITY:
As Staff Product Manager for Core Payment Gateway, you will be the foundational product pillar for India's digital economy. You will own the core transaction processing platform, bank integrations, smart routing algorithms, and multi-rail settlement engines.

RESPONSIBILITIES:
• Lead the architectural and commercial product roadmap for Core Gateway processing 2,500+ TPS at peak.
• Design intelligent payment routing across 50+ acquiring banks and network rails (Visa, Mastercard, RuPay, NPCI UPI 2.0).
• Drive down transaction failure rates by implementing dynamic OTP auto-read, network tokenization, and instantaneous biometric authentication flows.
• Pioneer next-generation merchant developer experiences: unified SDKs, serverless webhooks, and sandbox environments.
• Mentor 4-6 PMs across checkout pods and work directly with engineering leaders and VP of Product.

QUALIFICATIONS:
• 8+ years in product management with at least 4 years in fintech, banking gateways, or merchant acquiring.
• Deep conceptual understanding of UPI AutoPay, Recurring Mandates, Card Tokenization, and NPCI protocols.
• Exceptional quantitative ability: hands-on SQL, logging query analysis, and data modeling.
• Strong leadership track record managing complex high-stakes enterprise relationships with Tier-1 banks.

BENEFITS:
• Top 1% compensation: ₹55L – ₹70L Fixed/Variable CTC + high-liquidity ESOPs.
• Best-in-class parental insurance, OPD dental/vision coverage, and mental health consultations.
• Notice period buyout support for candidates serving 60-90 days.`,
    requiredSkills: [
      'Product Strategy',
      'Fintech & Payments',
      'API Product Management',
      'Cross-functional Leadership',
      'Stakeholder Management'
    ],
    preferredSkills: [
      'UPI 2.0 & Tokenization',
      'System Architecture Literacy',
      'Go-To-Market (GTM)'
    ],
    recommendedSkillsToBridge: [
      'NPCI UPI AutoPay 2.0 Protocol',
      'RBI Card Tokenization Compliance Guidelines',
      'Distributed High-TPS Settlement Ledger Mechanics'
    ],
    recruiter: {
      name: 'Rohan Deshmukh',
      role: 'Director of Talent Acquisition — Product & Tech',
      email: 'rohan.deshmukh@razorpay.com',
      linkedIn: 'https://linkedin.com/in/rohandeshmukh-razorpay',
      companyDomain: 'razorpay.com',
      responseRateScore: 91
    },
    matchScore: 93,
    profileScore: 95,
    atsScore: 91,
    keyFitReasons: [
      'High synergy with your payment settlement and merchant gateway experience.',
      'Matches senior product leadership and mentoring expectations.',
      'Direct relevance of your API monetization background.'
    ],
    missingSkills: ['Deep UPI Autopay Protocol knowledge'],
    isApplied: false
  },
  {
    id: 'job_pm_swiggy_blr',
    title: 'Product Manager — Consumer App & Discovery',
    company: 'Swiggy',
    companyLogoText: 'SW',
    location: 'Bangalore, India',
    locationHub: 'bangalore',
    roleTrack: 'product',
    seniorityLevel: 'mid',
    workplaceType: 'Hybrid',
    salaryRange: '₹36,00,000 – ₹48,00,000 CTC + ESOPs',
    currency: 'INR',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/job-listings-product-manager-consumer-app-swiggy-bangalore-3-to-7-years-241026001',
    postedAgo: '1 day ago',
    description: 'Own the home feed discovery algorithm and personalized recommendations for Swiggy food delivery and Instamart. Partner with data science to improve order conversion and time-to-order.',
    fullJobDescription: `ABOUT SWIGGY:
Swiggy is India's leading on-demand convenience platform with a tech-first approach to logistics and a solution-first approach to consumer challenges. Delivering millions of orders daily across 500+ Indian cities.

ROLE OVERVIEW:
You will lead the Consumer Feed & Discovery charter. Your team is responsible for the first 30 seconds of the user session — personalizing restaurant banners, cuisine recommendations, and 10-minute grocery discovery widgets.

WHAT YOU'LL DO:
• Formulate 6-month product roadmaps for the Swiggy mobile app homepage and search discovery.
• Partner closely with AI/ML teams to operationalize contextual ranking algorithms taking into account weather, time of day, prior ordering history, and kitchen prep times.
• Conduct qualitative customer interviews, rapid prototyping, and quantitative A/B testing across 50M+ monthly active users.
• Drive Key Results: Home-to-Cart Conversion, Search Drop-off reduction, and Instamart Cross-Sell GMV.

REQUIREMENTS:
• 3-6 years of consumer tech product management experience.
• Strong command of product analytics (Amplitude, Tableau, SQL).
• Proven track record launching features that directly increased retention and conversion metrics.`,
    requiredSkills: ['Product Strategy', 'SQL & Amplitude', 'A/B Testing & PLG', 'User Research & Discovery'],
    preferredSkills: ['Hyperlocal Logistics', 'Consumer Tech'],
    recommendedSkillsToBridge: [
      'Quick-Commerce Real-Time Feed Ranking Models',
      'Contextual Dynamic Pricing & Delivery Slot Scheduling',
      'Multi-Surface Cross-Sell Funnel Optimization'
    ],
    recruiter: {
      name: 'Tanvi Agarwal',
      role: 'Lead Product Recruiter',
      email: 'tanvi.agarwal@swiggy.in',
      linkedIn: 'https://linkedin.com/in/tanviagarwal-recruiter',
      companyDomain: 'swiggy.in',
      responseRateScore: 93
    },
    matchScore: 93,
    profileScore: 92,
    atsScore: 94,
    keyFitReasons: ['Strong foundation in conversion funnels and user metrics.'],
    missingSkills: ['Quick-commerce feed ranking nuances'],
    isApplied: false
  },
  {
    id: 'job_principal_pm_careem_dxb',
    title: 'Principal Product Manager — Super App Platforms',
    company: 'Careem',
    companyLogoText: 'CR',
    location: 'Dubai, UAE',
    locationHub: 'dubai',
    roleTrack: 'product',
    seniorityLevel: 'principal',
    workplaceType: 'Hybrid',
    salaryRange: 'AED 48,000 – AED 62,000 / month (Tax-Free) + Equity',
    currency: 'AED',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/principal-product-manager-careem-super-app-dubai-38829104',
    postedAgo: '2 days ago',
    description: 'Lead multi-service integration (Ride-hailing, Food, Careem Pay, Quick Delivery) across 10 Middle Eastern countries. Define platform primitives, partner APIs, and subscription loyalty mechanics.',
    fullJobDescription: `ABOUT CAREEM (AN UBER SUBSIDIARY):
Careem is the everyday Super App for the greater Middle East region. We operate in over 70 cities across 10 countries, offering ride-hailing, food delivery, grocery delivery, micro-mobility, digital payments, and third-party partner services to 50M+ registered users.

ROLE DESCRIPTION:
As Principal Product Manager for Super App Platforms, you will report to the Chief Product Officer. You will architect the horizontal platform primitives that empower all vertical business units (Rides, Food, Careem Plus, Careem Pay) to launch, scale, and cross-sell seamlessly.

CORE RESPONSIBILITIES:
• Define the strategic product vision for the Super App unified architecture and third-party developer ecosystem.
• Own Careem Plus subscription membership product, boosting multi-vertical adoption and lifetime customer value (LTV).
• Establish unified identity, global navigation, and checkout payment routing across diverse regulatory regimes in UAE, KSA, Jordan, and Pakistan.
• Represent Careem at regional tech summits and lead cross-departmental executive alignment.

EXPERIENCE REQUIRED:
• 9+ years of product management leadership with proven experience building horizontal platforms or multi-service consumer apps.
• Experience operating in cross-border emerging markets with dynamic localized nuances.
• Demonstrated ability to influence senior executive stakeholders and lead large cross-functional teams without direct authority.`,
    requiredSkills: ['Product Strategy', 'Roadmapping', 'Cross-functional Leadership', 'API Product Management', 'Stakeholder Management'],
    preferredSkills: ['Middle East Regional Scaling', 'Super-app Economics'],
    recommendedSkillsToBridge: [
      'Multi-Vertical Super-App Unified Identity Primitives',
      'Cross-Border GCC Currency Ledger Reconciliation',
      'Subscription Tier Economics (Careem Plus / Prime Model)'
    ],
    recruiter: {
      name: 'Zaid Al-Hassan',
      role: 'Head of Executive Hiring — Product',
      email: 'zaid.alhassan@careem.com',
      linkedIn: 'https://linkedin.com/in/zaid-alhassan',
      companyDomain: 'careem.com',
      responseRateScore: 96
    },
    matchScore: 94,
    profileScore: 96,
    atsScore: 92,
    keyFitReasons: ['Demonstrated multi-market expansion and API governance.'],
    missingSkills: ['Bilingual Arabic product execution'],
    isApplied: false
  },
  {
    id: 'job_manager_pm_noon_dxb',
    title: 'Manager — Product Management (Fintech & Credit)',
    company: 'Noon.com',
    companyLogoText: 'NN',
    location: 'Dubai, UAE',
    locationHub: 'dubai',
    roleTrack: 'product',
    seniorityLevel: 'lead',
    workplaceType: 'On-site',
    salaryRange: 'AED 42,000 – AED 54,000 / month + Annual Bonus',
    currency: 'AED',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/manager-product-management-fintech-noon-dubai-389920194',
    postedAgo: '3 days ago',
    description: 'Lead a team of 4 Product Managers building Noon Pay, Buy-Now-Pay-Later (BNPL) credit rails, and merchant checkout integrations across Saudi Arabia, UAE, and Egypt.',
    fullJobDescription: `ABOUT NOON:
Noon is the Middle East's homegrown digital marketplace and consumer ecosystem backed by the Public Investment Fund (PIF) of Saudi Arabia. We operate noon e-commerce, noon Daily, NowNow, and noon Pay across UAE, KSA, and Egypt.

ROLE OVERVIEW:
We are seeking an experienced Product Management Leader to steer Noon Pay and our embedded financial services. You will supervise 4 PMs, collaborating with risk underwriters, compliance teams, and central banks across Riyadh and Abu Dhabi.

RESPONSIBILITIES:
• Lead development of Buy-Now-Pay-Later (BNPL) checkout flows and credit risk scoring engines.
• Expand Noon Pay digital wallet acceptance across external online merchants and offline POS terminals.
• Ensure adherence to Saudi Central Bank (SAMA) and Central Bank of UAE (CBUAE) regulatory mandates.
• Own the P&L and transaction unit economics of the fintech division.

REQUIREMENTS:
• 7+ years product experience with at least 3 years in credit, BNPL, or fintech payment solutions.
• Proven people management track record mentoring senior PMs.`,
    requiredSkills: ['Product Strategy', 'Fintech & Payments', 'Cross-functional Leadership', 'People Management'],
    preferredSkills: ['GCC Regulatory Compliance', 'Credit Risk Engine Knowledge'],
    recommendedSkillsToBridge: [
      'SAMA (Saudi Central Bank) Fintech Regulatory Framework',
      'Sharia-Compliant Financing & Murabaha Principles',
      'Real-Time Alternate Credit Risk Underwriting Algorithms'
    ],
    recruiter: {
      name: 'Rana Mansoor',
      role: 'Senior Talent Partner — FinTech',
      email: 'rana.mansoor@noon.com',
      linkedIn: 'https://linkedin.com/in/rana-mansoor-talent',
      companyDomain: 'noon.com',
      responseRateScore: 91
    },
    matchScore: 90,
    profileScore: 91,
    atsScore: 89,
    keyFitReasons: ['Direct payment gateway and checkout leadership.'],
    missingSkills: ['Sharia-compliant financing rules'],
    isApplied: false
  },
  {
    id: 'job_pm_hyd_microsoft',
    title: 'Principal Product Manager — Azure Developer Tools',
    company: 'Microsoft India Development Center (IDC)',
    companyLogoText: 'MS',
    location: 'Hyderabad, India',
    locationHub: 'hyderabad',
    roleTrack: 'product',
    seniorityLevel: 'principal',
    workplaceType: 'Hybrid',
    salaryRange: '₹75,00,000 – ₹95,00,000 CTC + US Stock Awards (RSUs)',
    currency: 'INR',
    source: 'Company Careers',
    sourceUrl: 'https://careers.microsoft.com/us/en/job/1749201/Principal-Product-Manager-Azure-Developer-Tools-Hyderabad',
    postedAgo: '2 days ago',
    description: 'Lead developer experience and cloud SDK tooling for Azure Cloud. Collaborate with engineers in Redmond and Hyderabad to build zero-friction developer portals, telemetry, and automated container deployment workflows used by millions of enterprise developers.',
    fullJobDescription: `ABOUT MICROSOFT INDIA DEVELOPMENT CENTER (IDC):
Microsoft IDC in Hyderabad is one of Microsoft's premier global innovation hubs outside Redmond, driving critical contributions across Azure Cloud, Windows, Office, and Developer Tools.

THE ROLE:
As Principal Product Manager in the Azure Developer Division, you will lead the global strategy for cloud developer experience. You will collaborate with engineering teams in Hyderabad and Redmond to build developer portals, CLI utilities, and SDKs utilized by Fortune 500 engineering departments.

KEY RESPONSIBILITIES:
• Own the product roadmap for Azure developer CLI, cloud container deployment templates, and VS Code cloud extensions.
• Conduct in-depth developer user studies to eliminate onboarding latency and telemetry friction.
• Define enterprise governance, zero-trust role-based access control (RBAC), and compliance controls.
• Represent Azure at global developer conferences (Microsoft Build, KubeCon).

QUALIFICATIONS:
• 8+ years product management experience delivering developer platforms, cloud infra, or developer APIs.
• Strong technical background with hands-on architectural literacy (Kubernetes, Docker, REST/gRPC, GitHub Actions).
• Proven track record partnering with global teams across US and India time zones.`,
    requiredSkills: [
      'Product Strategy',
      'Roadmapping',
      'API Product Management',
      'Cross-functional Leadership',
      'Go-To-Market (GTM)'
    ],
    preferredSkills: [
      'Developer Tooling / Cloud Native',
      'Enterprise SaaS Experience',
      'Global Stakeholder Alignment'
    ],
    recommendedSkillsToBridge: [
      'Azure Resource Manager (ARM) & Bicep IaC Templates',
      'Zero-Trust Enterprise Identity & RBAC Federation',
      'Developer Relations & Open Source Community Engagement'
    ],
    recruiter: {
      name: 'Vikram Chawla',
      role: 'Executive Recruiter — Cloud & AI Org',
      email: 'v-chawla@microsoft.com',
      linkedIn: 'https://linkedin.com/in/vikramchawla-talent',
      companyDomain: 'microsoft.com',
      responseRateScore: 88
    },
    matchScore: 88,
    profileScore: 90,
    atsScore: 86,
    keyFitReasons: [
      'Direct fit for API-first architecture leadership.',
      'Strong match for high-scale enterprise product roadmapping.'
    ],
    missingSkills: ['Azure ecosystem specifics', 'Developer tooling specialized PLG'],
    isApplied: false
  },
  {
    id: 'job_pm_lon_monzo',
    title: 'Lead Product Manager — Business Banking',
    company: 'Monzo Bank',
    companyLogoText: 'MZ',
    location: 'London, UK',
    locationHub: 'london',
    roleTrack: 'product',
    seniorityLevel: 'lead',
    workplaceType: 'Hybrid',
    salaryRange: '£105,000 – £125,000 Base + Bonus + Share Options',
    currency: 'GBP',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/lead-product-manager-business-banking-at-monzo-bank-39201948',
    postedAgo: '4 days ago',
    description: 'Monzo is looking for a Lead Product Manager to redefine modern banking for UK small businesses and entrepreneurs. You will oversee loan underwriting APIs, cashflow forecasting, and automated accounting syncs within the award-winning Monzo app.',
    fullJobDescription: `ABOUT MONZO:
Monzo is the UK's leading digital bank with over 9 million customers. We exist to make money work for everyone. Our Business Banking division is rapidly transforming how UK SMEs, sole traders, and startups manage finances, tax, and invoices.

WHAT YOU'LL DO:
• Lead a cross-functional squad of 10 engineers, designers, data scientists, and risk underwriters.
• Own the roadmap for SME lending, automated invoicing, and accounting integrations (Xero, QuickBooks, FreeAgent).
• Ensure all product rollouts comply with UK Financial Conduct Authority (FCA) and Prudential Regulation Authority (PRA) standards.
• Scale Monzo Business active accounts by 40% year-on-year.

WHO YOU ARE:
• 6+ years in product management with experience in digital banking, fintech, or B2B SaaS.
• High regulatory awareness in European / UK financial frameworks.
• Deep empathy for small business owners and an obsession with clean user experience.`,
    requiredSkills: [
      'Product Strategy',
      'Fintech & Payments',
      'User Research & Discovery',
      'A/B Testing & PLG',
      'Roadmapping'
    ],
    preferredSkills: [
      'UK Financial Regulations (FCA)',
      'Open Banking APIs',
      'SaaS Accounting Integrations'
    ],
    recommendedSkillsToBridge: [
      'UK FCA & PRA Regulatory Lending Compliance',
      'Open Banking Read/Write API Standards (OBIE)',
      'SME Cloud Accounting Sync Pipelines (Xero, FreeAgent)'
    ],
    recruiter: {
      name: 'Eleanor Vance',
      role: 'Principal Talent Partner — Product & Growth',
      email: 'eleanor.vance@monzo.com',
      linkedIn: 'https://linkedin.com/in/eleanor-vance-talent',
      companyDomain: 'monzo.com',
      responseRateScore: 93
    },
    matchScore: 89,
    profileScore: 91,
    atsScore: 87,
    keyFitReasons: [
      'Proven background in merchant and payments workflows.',
      'Experienced in agile sprint management and quantitative experimentation.'
    ],
    missingSkills: ['FCA compliance familiarity (can be onboarded)'],
    isApplied: false
  },
  {
    id: 'job_sr_pm_wise_lon',
    title: 'Senior Product Manager — Cross-Border Treasury',
    company: 'Wise (TransferWise)',
    companyLogoText: 'WS',
    location: 'London, UK',
    locationHub: 'london',
    roleTrack: 'product',
    seniorityLevel: 'senior',
    workplaceType: 'Hybrid',
    salaryRange: '£95,000 – £115,000 Base + Equity Package',
    currency: 'GBP',
    source: 'Greenhouse',
    sourceUrl: 'https://boards.greenhouse.io/wise/jobs/5920194002',
    postedAgo: '3 days ago',
    description: 'Own instant FX payment routing algorithms, liquidity management, and direct central bank rails across Europe and Asia. Build mission-critical APIs that power money transfers for 16M+ users globally.',
    fullJobDescription: `ABOUT WISE:
Wise is a global technology company building the best way to move money around the world. Over 16 million people and businesses use Wise to send, spend, and manage money internationally with complete transparency and real mid-market exchange rates.

THE MISSION:
Our mission is money without borders: instant, convenient, transparent, and eventually free. In this role, you will lead the Cross-Border Treasury and Liquidity Automation product pod in our Shoreditch, London headquarters.

YOUR IMPACT:
• Lead product initiatives that automate multi-currency treasury rebalancing across 50+ banking partners globally.
• Connect Wise directly with central bank real-time gross settlement (RTGS) payment schemes (Bank of England CHAPS/Faster Payments, SEPA Instant in EU).
• Minimize currency spread costs and eliminate manual currency desk intervention through machine learning FX forecast models.

QUALIFICATIONS:
• 5+ years product management experience in global FX, payments, treasury, or investment banking platforms.
• Strong mathematical mindset and data proficiency (Python, SQL, Looker).
• Proven background delivering mission-critical financial systems with zero margin for operational error.`,
    requiredSkills: ['Product Strategy', 'Fintech & Payments', 'API Product Management', 'SQL & Amplitude'],
    preferredSkills: ['Treasury Management Systems', 'Automated Clearing House (ACH)'],
    recommendedSkillsToBridge: [
      'Central Bank RTGS Direct Clearing Rails (CHAPS, SEPA Instant)',
      'Automated FX Mid-Market Algorithmic Rebalancing',
      'SWIFT ISO 20022 Financial Messaging Standards'
    ],
    recruiter: {
      name: 'Liam Gallagher',
      role: 'Senior Product Hiring Lead',
      email: 'liam.gallagher@wise.com',
      linkedIn: 'https://linkedin.com/in/liam-gallagher-wise',
      companyDomain: 'wise.com',
      responseRateScore: 95
    },
    matchScore: 92,
    profileScore: 93,
    atsScore: 91,
    keyFitReasons: ['High synergy with your payment routing and API monetization background.'],
    missingSkills: ['European central bank direct connectivity'],
    isApplied: false
  },
  {
    id: 'job_vp_pm_phonepe_blr',
    title: 'VP of Product Management — Merchant & Commercialization',
    company: 'PhonePe',
    companyLogoText: 'PP',
    location: 'Bangalore, India',
    locationHub: 'bangalore',
    roleTrack: 'product',
    seniorityLevel: 'principal',
    workplaceType: 'On-site',
    salaryRange: '₹1,10,00,000 – ₹1,45,00,000 CTC + Stock Options',
    currency: 'INR',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/job-listings-vp-product-management-phonepe-bangalore-10-to-18-years-241026002',
    postedAgo: '4 days ago',
    description: 'Lead 25+ product managers across offline QR merchant acceptance, POS smart speakers, merchant lending, and enterprise payment gateways processing ₹7 lakh crore monthly volume.',
    fullJobDescription: `ABOUT PHONEPE:
PhonePe is India's leading fintech platform with over 500 million registered users and a merchant network spanning 37 million offline stores. We process over 48% of all UPI transactions in India.

ROLE SPECIFICATION:
As Vice President of Product Management for Merchant & Commercialization, you will hold full P&L accountability for the merchant ecosystem. You will steer a group of Directors, Group PMs, and Lead PMs designing hardware and software merchant solutions.

CORE FOCUS AREAS:
• Drive innovation in smart soundbox hardware, dynamic QR terminals, and EDC smart devices deployed across 30M+ Indian kiranas and retailers.
• Expand merchant credit line underwriting, insurance distribution, and merchant mutual fund investments.
• Interface directly with the Founder / CEO and Reserve Bank of India leadership on regulatory alignments.
• Scale enterprise payment gateway revenue for India's top 1,000 online brands.

PROFILE REQUIREMENTS:
• 12+ years experience in product management with significant tenure at VP or Director level in consumer internet or fintech.
• Demonstrated track record managing massive offline-to-online merchant scale.
• Extraordinary executive presence, team mentorship capability, and strategic vision.`,
    requiredSkills: ['Product Strategy', 'Roadmapping', 'Cross-functional Leadership', 'Stakeholder Management', 'P&L Ownership'],
    preferredSkills: ['Indian Merchant Tech Scale', 'Executive Team Leadership'],
    recommendedSkillsToBridge: [
      'IoT Smart Soundbox Firmware & Embedded Hardware Lifecycle',
      'Merchant Alternate Credit Underwriting using Daily Settlement Velocity',
      'Reserve Bank of India (RBI) Payment Aggregator Licensing Mandates'
    ],
    recruiter: {
      name: 'Sunil Rao',
      role: 'Head of Executive Search',
      email: 'sunil.rao@phonepe.com',
      linkedIn: 'https://linkedin.com/in/sunilrao-phonepe',
      companyDomain: 'phonepe.com',
      responseRateScore: 94
    },
    matchScore: 89,
    profileScore: 93,
    atsScore: 85,
    keyFitReasons: ['Proven multi-million dollar GMV scaling track record.'],
    missingSkills: ['Massive hardware/POS terminal product experience'],
    isApplied: false
  },

  // Software Engineering Roles
  {
    id: 'job_eng_hyd_uber',
    title: 'Staff Software Engineer — Maps & Distributed Dispatch',
    company: 'Uber Technologies',
    companyLogoText: 'UB',
    location: 'Hyderabad, India',
    locationHub: 'hyderabad',
    roleTrack: 'engineering',
    seniorityLevel: 'staff',
    workplaceType: 'Hybrid',
    salaryRange: '₹75,00,000 – ₹92,00,000 CTC + Uber RSUs',
    currency: 'INR',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/staff-software-engineer-maps-dispatch-at-uber-hyderabad-391481902',
    postedAgo: '1 day ago',
    description: 'Join Uber Hyderabad Core Mobility team. Architect high-concurrency geospatial indexing and distributed trip assignment engines that orchestrate billions of rides annually with strict sub-10ms latency SLAs.',
    fullJobDescription: `ABOUT UBER CORE MOBILITY:
Uber's Hyderabad Tech Center is one of our largest engineering hubs globally. The Maps & Dispatch team builds the distributed real-time systems that connect millions of drivers and riders every second across 70+ countries.

THE ROLE:
As Staff Software Engineer in Distributed Dispatch, you will be the technical lead for our real-time geospatial search and matching engine. You will design distributed algorithms that calculate optimal driver-rider matches while balancing surge pricing, traffic latency, and route efficiency.

KEY RESPONSIBILITIES:
• Architect Go-based microservices capable of sustaining 100,000+ requests per second at p99 latency < 8ms.
• Optimize Uber's open-source H3 hexagonal geospatial indexing grid across global memory caches.
• Design fault-tolerant stateful streaming consumers on Apache Kafka and Apache Flink with exactly-once delivery guarantees.
• Set engineering standards across system design, high-availability chaos testing, and distributed tracing.

WHAT WE LOOK FOR:
• 8+ years hands-on experience building mission-critical distributed systems.
• Mastery of Go (Golang) or Java, with deep understanding of memory allocation, goroutines, and concurrency primitives.
• Proven expertise with distributed data stores (Cassandra, Redis Cluster, PostgreSQL) and event streaming (Kafka).`,
    requiredSkills: [
      'Distributed Systems Architecture',
      'Go (Golang)',
      'Apache Kafka & Event Streaming',
      'System Design & Microservices',
      'PostgreSQL & DynamoDB'
    ],
    preferredSkills: [
      'H3 Geospatial Indexing',
      'gRPC & Protocol Buffers',
      'Distributed Tracing at scale'
    ],
    recommendedSkillsToBridge: [
      'Uber H3 Hexagonal Hierarchical Spatial Indexing',
      'Apache Flink Real-Time Event-Time Streaming Pipelines',
      'Chaos Engineering & Fault-Tolerance Injection at Scale'
    ],
    recruiter: {
      name: 'Sneha Reddy',
      role: 'Senior Staff Technical Recruiter',
      email: 'sneha.reddy@uber.com',
      linkedIn: 'https://linkedin.com/in/snehareddy-techrecruiter',
      companyDomain: 'uber.com',
      responseRateScore: 96
    },
    matchScore: 97,
    profileScore: 96,
    atsScore: 98,
    keyFitReasons: [
      'Exceptional alignment with your Go, Kafka, and low-latency streaming expertise.',
      'Matches your proven track record scaling past 50,000 QPS.',
      'Direct experience with geospatial ride-matching architecture.'
    ],
    missingSkills: ['H3 library internals (quick pickup)'],
    isApplied: false
  },
  {
    id: 'job_eng_blr_swiggy',
    title: 'Principal Architect — High Scale Fulfillment',
    company: 'Swiggy',
    companyLogoText: 'SW',
    location: 'Bangalore, India',
    locationHub: 'bangalore',
    roleTrack: 'engineering',
    seniorityLevel: 'principal',
    workplaceType: 'Hybrid',
    salaryRange: '₹80,00,000 – ₹1,05,00,000 CTC + ESOPs',
    currency: 'INR',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/principal-architect-high-scale-fulfillment-swiggy-bangalore-38910482',
    postedAgo: '2 days ago',
    description: 'Looking for a Principal Engineer to lead architectural transformation across Swiggy and Instamart logistics infrastructure. You will define multi-cloud resilience, event-driven backbones, and zero-downtime database shard migrations.',
    fullJobDescription: `ABOUT SWIGGY ENGINEERING:
Swiggy's tech stack processes millions of daily food and grocery deliveries across 500+ cities. During Indian festival spikes (IPL, New Year's Eve), our systems scale to handle over 150,000 orders per minute with zero downtime.

YOUR ROLE:
As Principal Architect for Logistics & Fulfillment, you will serve as the chief technical authority for our order dispatch and fleet routing engines. You will lead technical direction across 8 squads totaling 60+ engineers.

KEY RESPONSIBILITIES:
• Architect resilient multi-region disaster recovery systems with zero data loss (RPO=0, RTO < 30s).
• Design scalable distributed lock managers, rate limiters, and idempotency layers for millions of concurrent riders.
• Drive company-wide architectural review boards (ARBs) and mentor staff and principal engineers.
• Lead migrations to cloud-native Kubernetes service meshes and automated canary deployment pipelines.

QUALIFICATIONS:
• 10+ years architecting and operating planetary-scale distributed web systems.
• Proven mastery in Go, Java, or C++, and deep experience with Kafka, Redis, and multi-tenant databases.`,
    requiredSkills: [
      'Distributed Systems Architecture',
      'System Design & Microservices',
      'Kubernetes & Docker',
      'Apache Kafka & Event Streaming',
      'Observability & Distributed Tracing'
    ],
    preferredSkills: [
      'Multi-region Disaster Recovery',
      'Go or Java ecosystem',
      'High QPS Caching strategies'
    ],
    recommendedSkillsToBridge: [
      'Multi-Region Active-Active Database Shard Shuffling',
      'eBPF-Based Kubernetes Network Observability',
      'Dynamic Fleet Allocation Optimization Algorithms'
    ],
    recruiter: {
      name: 'Aditya Mathur',
      role: 'Head of Engineering Talent Acquisition',
      email: 'aditya.mathur@swiggy.in',
      linkedIn: 'https://linkedin.com/in/adityamathur-talent',
      companyDomain: 'swiggy.in',
      responseRateScore: 90
    },
    matchScore: 93,
    profileScore: 95,
    atsScore: 91,
    keyFitReasons: [
      'Outstanding synergy with your distributed caching and latency reduction wins.',
      'Demonstrated leadership across cross-functional engineering review boards.'
    ],
    missingSkills: ['Multi-cloud active-active failover'],
    isApplied: false
  },
  {
    id: 'job_eng_dxb_careem',
    title: 'Lead Backend Engineer — Everything App Infrastructure',
    company: 'Careem (Uber subsidiary)',
    companyLogoText: 'CR',
    location: 'Dubai, UAE',
    locationHub: 'dubai',
    roleTrack: 'engineering',
    seniorityLevel: 'lead',
    workplaceType: 'On-site',
    salaryRange: 'AED 36,00,0 – AED 46,000 / month (Tax-Free) + Benefits + Relocation',
    currency: 'AED',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/lead-backend-engineer-careem-dubai-389104921',
    postedAgo: '3 days ago',
    description: 'Careem is the pioneer of the Super App in the Middle East. We need a Lead Backend Engineer to build unified payment ledgers, real-time dispatch services, and localized vendor integrations across 10 Middle Eastern countries.',
    fullJobDescription: `ABOUT CAREEM TECH DUBAI:
Based in Dubai Internet City, Careem's engineering team designs high-availability services operating across 10 countries and multiple regional cloud data centers.

THE OPPORTUNITY:
As Lead Backend Engineer, you will steer the team delivering unified ledger services and dispatch APIs. You will balance low latency execution against multi-datacenter consistency across the GCC.

RESPONSIBILITIES:
• Lead development of Go-based microservices with gRPC communication layers.
• Implement double-entry accounting ledgers capable of handling millions of real-time transactions with strict ACID guarantees.
• Spearhead automated infrastructure provisioning on AWS and Kubernetes.
• Conduct code reviews and mentor engineers in modern distributed systems paradigms.`,
    requiredSkills: [
      'Go (Golang)',
      'Distributed Systems Architecture',
      'PostgreSQL & DynamoDB',
      'Kubernetes & Docker',
      'gRPC & REST APIs'
    ],
    preferredSkills: [
      'High-throughput FinTech ledgers',
      'Redis cluster clustering',
      'Cross-border telemetry'
    ],
    recommendedSkillsToBridge: [
      'Double-Entry Financial Ledger Immutable Storage Mechanics',
      'AWS Multi-Region DynamoDB Global Tables Replication',
      'FinTech ISO 8583 Card Processing Message Protocols'
    ],
    recruiter: {
      name: 'Tariq Mansour',
      role: 'Talent Acquisition Lead — Engineering',
      email: 'tariq.mansour@careem.com',
      linkedIn: 'https://linkedin.com/in/tariq-mansour-tech',
      companyDomain: 'careem.com',
      responseRateScore: 89
    },
    matchScore: 91,
    profileScore: 92,
    atsScore: 90,
    keyFitReasons: [
      'Proven Go and microservices experience.',
      'Strong match for high availability super-app traffic patterns.'
    ],
    missingSkills: ['Double-entry ledger accounting fundamentals'],
    isApplied: false
  },
  {
    id: 'job_eng_lon_revolut',
    title: 'Staff Software Engineer — Global Core Ledger',
    company: 'Revolut',
    companyLogoText: 'RV',
    location: 'London, UK',
    locationHub: 'london',
    roleTrack: 'engineering',
    seniorityLevel: 'staff',
    workplaceType: 'Remote',
    salaryRange: '£120,000 – £145,000 Base + Revolut Equity Shares',
    currency: 'GBP',
    source: 'Indeed',
    sourceUrl: 'https://uk.indeed.com/viewjob?jk=89a712f84b123891&q=staff+software+engineer+revolut+london',
    postedAgo: 'Just now',
    description: 'Join Revolut Core Ledger engineering. Build transactional engines processing billions of Euros in real-time multi-currency FX exchanges with strict ACID compliance and 99.999% availability.',
    fullJobDescription: `ABOUT REVOLUT:
Revolut is building the world's first global financial superapp. Over 40 million customers worldwide use Revolut to transfer money, invest in stocks and crypto, buy insurance, and manage company expenses.

THE ROLE:
As Staff Software Engineer in our Core Ledger squad, you will write the software that guards billions in global client assets. You will work on ultra-low latency transaction clearing, distributed consensus, and fault-tolerant audit trails.

WHAT YOU'LL DO:
• Design and code ultra-reliable distributed ledger software with 99.999% availability.
• Ensure sub-15ms transaction confirmation across multi-region PostgreSQL and distributed cache layers.
• Eliminate concurrency race conditions through strict deterministic state machines.
• Work in a fast-paced, high-autonomy engineering culture with top global talent.`,
    requiredSkills: [
      'Distributed Systems Architecture',
      'System Design & Microservices',
      'PostgreSQL & DynamoDB',
      'Apache Kafka & Event Streaming',
      'Go (Golang)'
    ],
    preferredSkills: [
      'Financial Ledger Design',
      'Zero-downtime schema evolution',
      'High-performance JVM or Go'
    ],
    recommendedSkillsToBridge: [
      'Raft / Paxos Distributed Consensus Protocol Implementations',
      'Zero-Downtime PostgreSQL Logical Replication & Online Partitioning',
      'Formal Verification of Distributed Financial State Machines'
    ],
    recruiter: {
      name: 'Charlotte Wood',
      role: 'Staff Tech Recruiter — Infrastructure',
      email: 'charlotte.wood@revolut.com',
      linkedIn: 'https://linkedin.com/in/charlotte-wood-revolut',
      companyDomain: 'revolut.com',
      responseRateScore: 92
    },
    matchScore: 90,
    profileScore: 92,
    atsScore: 88,
    keyFitReasons: [
      'Extensive experience with high-volume transaction routing and microservices.',
      'Strong architectural focus on p99 latency optimization.'
    ],
    missingSkills: ['Revolut proprietary in-house framework'],
    isApplied: false
  },

  // Data & AI Roles
  {
    id: 'job_ai_dxb_tii',
    title: 'Senior Applied AI / LLM Systems Scientist',
    company: 'Technology Innovation Institute (TII / Falcon)',
    companyLogoText: 'TI',
    location: 'Abu Dhabi / Dubai, UAE',
    locationHub: 'dubai',
    roleTrack: 'data_ai',
    seniorityLevel: 'senior',
    workplaceType: 'Hybrid',
    salaryRange: 'AED 42,000 – AED 55,000 / month (Tax-Free) + Housing + Family Visa',
    currency: 'AED',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/senior-applied-ai-llm-scientist-at-tii-falcon-389129038',
    postedAgo: '1 day ago',
    description: 'Home of the open-source Falcon LLMs. We are expanding our applied generative AI division to pioneer multi-agent reasoning, bilingual Arabic-English fine-tuning, and enterprise RAG deployments across sovereign cloud infrastructures.',
    fullJobDescription: `ABOUT TECHNOLOGY INNOVATION INSTITUTE (TII):
TII is the applied research arm of the Advanced Technology Research Council (ATRC) in the UAE. We created Falcon, one of the world's most renowned open-source Large Language Models.

ROLE OVERVIEW:
As Senior Applied AI / LLM Systems Scientist, you will build foundation model applications and fine-tuning pipelines for sovereign government, enterprise, and educational deployment.

WHAT YOU'LL DO:
• Lead training and alignment pipelines (RLHF, DPO, LoRA/QLoRA) for Arabic-English bilingual models.
• Architect low-latency distributed inference clusters using vLLM, TensorRT-LLM, and Triton Inference Server.
• Design agentic workflows and tool-calling execution engines for complex enterprise automation.
• Publish breakthroughs and open-source models benefiting the global AI research community.`,
    requiredSkills: [
      'Generative AI & LLMs',
      'Python & PyTorch',
      'RAG & Vector Databases',
      'Fine-tuning & LoRA',
      'Model Evaluation & Guardrails'
    ],
    preferredSkills: [
      'Arabic Natural Language Processing',
      'vLLM / TensorRT-LLM inference optimization',
      'Multi-agent frameworks (AutoGen / CrewAI)'
    ],
    recommendedSkillsToBridge: [
      'Direct Preference Optimization (DPO) & RLHF Training Pipelines',
      'NVIDIA TensorRT-LLM Custom Kernel Compilation',
      'Bilingual Arabic Tokenization & Morphology Alignment'
    ],
    recruiter: {
      name: 'Fatima Al-Hashemi',
      role: 'Head of Scientific & Research Recruitment',
      email: 'fatima.alhashemi@tii.ae',
      linkedIn: 'https://linkedin.com/in/fatima-alhashemi-tii',
      companyDomain: 'tii.ae',
      responseRateScore: 95
    },
    matchScore: 98,
    profileScore: 97,
    atsScore: 99,
    keyFitReasons: [
      'Perfect match for your bilingual Arabic/English RAG research achievements.',
      'Direct experience fine-tuning LLMs with LoRA adapters.',
      'Strong alignment with sovereign enterprise AI requirements in UAE.'
    ],
    missingSkills: ['TensorRT-LLM custom kernel compilation'],
    isApplied: false
  },
  {
    id: 'job_ai_lon_deepmind',
    title: 'Research Engineer — Frontier AI Applications',
    company: 'Google DeepMind',
    companyLogoText: 'DM',
    location: 'London, UK',
    locationHub: 'london',
    roleTrack: 'data_ai',
    seniorityLevel: 'lead',
    workplaceType: 'Hybrid',
    salaryRange: '£135,000 – £165,000 Base + Alphabet GSUs + Annual Bonus',
    currency: 'GBP',
    source: 'Company Careers',
    sourceUrl: 'https://deepmind.google/careers/jobs/frontier-ai-research-engineer-london-5819024',
    postedAgo: '2 days ago',
    description: 'Collaborate with world-class research scientists to translate breakthroughs in foundation models, tool-augmented reasoning, and multimodal evaluation into scalable production environments.',
    fullJobDescription: `ABOUT GOOGLE DEEPMIND:
Google DeepMind is a team of scientists, engineers, and ethicists committed to solving intelligence to advance science and benefit humanity. Based in King's Cross, London, our research spans Gemini models, AlphaFold, and frontier agentic intelligence.

THE ROLE:
As Research Engineer in Frontier Applications, you will bridge the gap between pure AI research and planetary-scale deployment. You will collaborate with research scientists to prototype, benchmark, and evaluate advanced reasoning, planning, and multi-modal models.

RESPONSIBILITIES:
• Implement distributed training and evaluation loops in JAX/Flax and PyTorch.
• Build automated evaluation harnesses to test reasoning, tool invocation, and safety guardrails.
• Collaborate with Google product teams to land generative AI capabilities in Google Workspace and Search.
• Contribute to scientific publications and open research benchmarks.`,
    requiredSkills: [
      'Generative AI & LLMs',
      'Python & PyTorch',
      'MLOps & LangChain / LlamaIndex',
      'Cloud ML (GCP Vertex / AWS SageMaker)',
      'Model Evaluation & Guardrails'
    ],
    preferredSkills: [
      'JAX / Flax familiarity',
      'RLHF and alignment pipelines',
      'Scientific publications'
    ],
    recommendedSkillsToBridge: [
      'JAX & Flax Functional Model Parallelism',
      'Tool-Use Synthetic Evaluation Benchmark Harnesses',
      'Multimodal Latent Space Cross-Attention Optimization'
    ],
    recruiter: {
      name: 'Oliver King',
      role: 'Senior Staff Research Recruiter',
      email: 'oliverking@deepmind.com',
      linkedIn: 'https://linkedin.com/in/oliver-king-deepmind',
      companyDomain: 'deepmind.google',
      responseRateScore: 97
    },
    matchScore: 91,
    profileScore: 94,
    atsScore: 88,
    keyFitReasons: [
      'Strong research and production deployment combination.',
      'Demonstrated expertise in multimodal model evaluation and guardrail engineering.'
    ],
    missingSkills: ['Deep familiarity with JAX (PyTorch native candidate)'],
    isApplied: false
  },
  {
    id: 'job_ai_blr_fractal',
    title: 'Lead AI Engineer — Enterprise RAG & Agents',
    company: 'Fractal Analytics',
    companyLogoText: 'FA',
    location: 'Bangalore, India',
    locationHub: 'bangalore',
    roleTrack: 'data_ai',
    seniorityLevel: 'lead',
    workplaceType: 'Hybrid',
    salaryRange: '₹48,00,000 – ₹65,00,000 CTC + Bonus',
    currency: 'INR',
    source: 'Naukri',
    sourceUrl: 'https://www.naukri.com/job-listings-lead-ai-engineer-rag-agents-fractal-bangalore-5-to-10-years-241026003',
    postedAgo: '3 days ago',
    description: 'Lead client-facing AI transformation for Fortune 500 enterprises. Build scalable RAG platforms, vector search pipelines, and agentic workflows that securely interface with legacy databases and enterprise ERPs.',
    fullJobDescription: `ABOUT FRACTAL:
Fractal is one of the most prominent global providers of artificial intelligence and analytics to Fortune 500 companies. We empower major enterprises across CPG, retail, healthcare, and financial services.

WHAT YOU'LL DO:
• Lead a dedicated engineering pod delivering production Retrieval-Augmented Generation (RAG) architectures.
• Implement semantic chunking, vector indexing (Qdrant, Pinecone, Milvus), and hybrid BM25 re-ranking algorithms.
• Deploy scalable containerized microservices using FastAPI, Celery, and Docker on Kubernetes.
• Ensure rigorous data privacy, PII masking, and enterprise role-based security.`,
    requiredSkills: [
      'Generative AI & LLMs',
      'RAG & Vector Databases',
      'Python & PyTorch',
      'FastAPI & Microservices',
      'Cloud ML (GCP Vertex / AWS SageMaker)'
    ],
    preferredSkills: [
      'Milvus / Qdrant vector database scaling',
      'Enterprise Data Governance',
      'Consulting & Client Discovery'
    ],
    recommendedSkillsToBridge: [
      'Milvus Distributed Vector Cluster Auto-Sharding',
      'Enterprise PII Redaction & Guardrail Gateways',
      'Hybrid Dense-Sparse Re-ranking (ColBERT / Cohere)'
    ],
    recruiter: {
      name: 'Deepak Nair',
      role: 'Talent Acquisition Partner — AI & Analytics',
      email: 'deepak.nair@fractal.ai',
      linkedIn: 'https://linkedin.com/in/deepaknair-fractal',
      companyDomain: 'fractal.ai',
      responseRateScore: 89
    },
    matchScore: 94,
    profileScore: 93,
    atsScore: 95,
    keyFitReasons: [
      'Extensive hands-on RAG implementation expertise.',
      'Production FastAPI and microservice deployment track record.'
    ],
    missingSkills: ['Milvus cluster administration'],
    isApplied: false
  },
  {
    id: 'job_ai_us_anthropic',
    title: 'Applied AI & Alignment Systems Engineer',
    company: 'Anthropic Systems Partner',
    companyLogoText: 'AN',
    location: 'Remote (US / Global)',
    locationHub: 'us_remote',
    roleTrack: 'data_ai',
    seniorityLevel: 'senior',
    workplaceType: 'Remote',
    salaryRange: '$190,000 – $240,000 USD + High-Value Equity',
    currency: 'USD',
    source: 'LinkedIn',
    sourceUrl: 'https://www.linkedin.com/jobs/view/applied-ai-alignment-engineer-anthropic-partner-391204819',
    postedAgo: '4 days ago',
    description: 'Work with cutting-edge frontier language models on automated red-teaming, safety evaluations, tool-use grounding, and benchmark telemetry for enterprise customer rollouts.',
    fullJobDescription: `ROLE OVERVIEW:
As an Applied AI & Alignment Systems Engineer working on frontier AI deployments, you will design automated evaluation loops, red-teaming harnesses, and tool-use verification layers for next-generation frontier intelligence.

RESPONSIBILITIES:
• Build automated adversarial probe suites to evaluate hallucination risk and safety bounds.
• Engineer resilient function-calling parsers and asynchronous execution bridges.
• Implement telemetry pipelines tracking model confidence, token drift, and latency.
• Collaborate with enterprise security architects to harden AI deployments against prompt injection attacks.`,
    requiredSkills: [
      'Generative AI & LLMs',
      'Model Evaluation & Guardrails',
      'Python & PyTorch',
      'RAG & Vector Databases',
      'FastAPI & Microservices'
    ],
    preferredSkills: [
      'Constitutional AI principles',
      'Synthetic data generation',
      'Distributed inference'
    ],
    recommendedSkillsToBridge: [
      'Constitutional AI Automated Red-Teaming Probing Suites',
      'Indirect Prompt Injection Defense Enclaves',
      'Distributed LLM Asynchronous Speculative Decoding'
    ],
    recruiter: {
      name: 'Marcus Bell',
      role: 'Head of Engineering Talent',
      email: 'marcus.bell@frontier-ai-careers.com',
      linkedIn: 'https://linkedin.com/in/marcusbell-talent',
      companyDomain: 'anthropic.com',
      responseRateScore: 92
    },
    matchScore: 88,
    profileScore: 91,
    atsScore: 85,
    keyFitReasons: [
      'Demonstrated expertise in automated hallucination detection and model drift.',
      'Strong distributed system foundation.'
    ],
    missingSkills: ['Constitutional AI framework specifics'],
    isApplied: false
  }
];

export const SALARY_BENCHMARKS: Record<string, SalaryBenchmark> = {
  'product_senior_dubai': {
    roleTrack: 'product',
    roleTitle: 'Senior Product Manager',
    seniorityLevel: 'senior',
    locationHub: 'dubai',
    currency: 'AED',
    currencySymbol: 'AED',
    p25: '32,000 / mo',
    p50: '40,000 / mo',
    p75: '48,000 / mo',
    p90: '58,000 / mo',
    compBreakdown: {
      fixedOrBase: '60% Basic Salary (AED 24,000)',
      variableOrBonus: '15-25% Annual Company Performance Bonus',
      equityOrAllowances: '30% Housing Allowance (AED 12,000) + 10% Transport Allowance'
    },
    taxAndBenefitsSummary: 'Zero personal income tax in UAE. Employers typically provide comprehensive private medical insurance for employee and dependents, annual flight tickets home, and mandatory End of Service Gratuity (21 days basic salary per year worked).',
    regionalNegotiationTips: [
      'Negotiate the Basic Salary portion upward, as End of Service Gratuity is calculated strictly on Basic Salary, not allowances.',
      'Ask for school fee allowances for children if moving with family, as international schooling in Dubai averages AED 40k–70k/child.',
      'Request full relocation coverage (airfare, 30 days initial serviced apartment, shipping allowance).'
    ],
    counterOfferScript: "Thank you for the offer to join as Senior PM. Given my direct experience scaling high-volume merchant checkout funnels and the current Dubai tech market benchmarks for senior product leadership, I am targeting an all-inclusive monthly package of AED 45,000. Additionally, I would like to confirm the family medical tier and relocation allowance structure."
  },
  'product_senior_bangalore': {
    roleTrack: 'product',
    roleTitle: 'Senior Product Manager',
    seniorityLevel: 'senior',
    locationHub: 'bangalore',
    currency: 'INR',
    currencySymbol: '₹',
    p25: '₹34,00,000',
    p50: '₹44,00,000',
    p75: '₹55,00,000',
    p90: '₹68,00,000',
    compBreakdown: {
      fixedOrBase: '80-85% Fixed Monthly Pay',
      variableOrBonus: '15-20% Annual Performance Linked Incentive (PLI)',
      equityOrAllowances: 'ESOPs / RSUs vesting over 4 years (25% cliff)'
    },
    taxAndBenefitsSummary: 'Standard Indian income tax slabs (New vs Old tax regime). Notice period buyouts are standard practice when transitioning from a 60-90 day company.',
    regionalNegotiationTips: [
      'Focus heavily on the Fixed Component rather than variable promises, as PLI realization depends on company EBITDA.',
      'If you have a 60-90 day notice period, ask the hiring company to include a formal Notice Period Buyout in the offer letter.',
      'Benchmark against Tier-1 product tech firms (Swiggy, Razorpay, Flipkart, CRED) which currently pay ₹45L–₹60L fixed for 6+ YOE.'
    ],
    counterOfferScript: "I am thrilled by the vision for the product team. Given my recent accomplishments leading payment settlements that unlocked $1.8M in revenue, I would be ready to sign immediately if we can align on a Fixed Base of ₹48,00,000 CTC with the standard 15% annual performance component and notice buyout support."
  },
  'engineering_staff_hyderabad': {
    roleTrack: 'engineering',
    roleTitle: 'Staff Software Engineer',
    seniorityLevel: 'staff',
    locationHub: 'hyderabad',
    currency: 'INR',
    currencySymbol: '₹',
    p25: '₹58,00,000',
    p50: '₹72,00,000',
    p75: '₹88,00,000',
    p90: '₹1,05,00,000',
    compBreakdown: {
      fixedOrBase: '₹50,00,000 – ₹65,00,000 Base Pay',
      variableOrBonus: '15-20% Annual Target Incentive',
      equityOrAllowances: '$30,000 – $60,000 USD Annual RSU Grant (US Parent Companies)'
    },
    taxAndBenefitsSummary: 'Multinational tech centers (Uber, Microsoft, Amazon IDC) provide globally managed RSUs, gratuity, comprehensive parental health coverage, and annual wellness stipends.',
    regionalNegotiationTips: [
      'Leverage competitive offers between Hyderabad and Bangalore; tech firms regularly match Bangalore bands for Staff tier in Hyderabad.',
      'Verify the dollar conversion rate and stock refresh cycle for US RSU grants.',
      'Negotiate joining / sign-on bonus to offset any unvested stock left at your prior company.'
    ],
    counterOfferScript: "Thank you for the detailed offer. Looking at my proven history driving 65,000 QPS distributed architectures with sub-15ms p99 latencies, I am seeking a Total Target Cash of ₹72,00,000 (Base + Annual Bonus) alongside the $45,000 annual equity grant to bridge my unvested holdings."
  },
  'engineering_staff_london': {
    roleTrack: 'engineering',
    roleTitle: 'Staff Software Engineer',
    seniorityLevel: 'staff',
    locationHub: 'london',
    currency: 'GBP',
    currencySymbol: '£',
    p25: '£105,000',
    p50: '£125,000',
    p75: '£145,000',
    p90: '£175,000',
    compBreakdown: {
      fixedOrBase: '£110,000 – £135,000 Base Salary',
      variableOrBonus: '15-25% Discretionary Annual Bonus',
      equityOrAllowances: '£30,000 – £60,000 Annual Stock / Options + 8% Pension Match'
    },
    taxAndBenefitsSummary: 'UK PAYE progressive taxation. Standard benefits include 25-30 days annual leave + bank holidays, workplace pension contribution match, and private healthcare insurance (Bupa/AXA).',
    regionalNegotiationTips: [
      'Pension match is effectively deferred tax-free cash; ask if the company matches up to 8% or 10%.',
      'If you require a Skilled Worker Visa, ensure visa application fees and NHS health surcharge are fully sponsored for your family.',
      'Fintechs (Revolut, Monzo) offer equity or liquid growth shares that can bridge base salary caps.'
    ],
    counterOfferScript: "I appreciate the offer to join as Staff Engineer. Taking into account the scope of taking ownership of the core ledger architecture and current London senior tech rates, I am requesting a Base Salary of £130,000 with the 8% employer pension contribution."
  }
};

export const INTERVIEW_QUESTIONS: Record<string, InterviewQuestion[]> = {
  product: [
    {
      id: 'q_pm_1',
      category: 'product_execution',
      question: 'Imagine a core checkout funnel metric drops by 14% week-over-week. Walk me through your diagnostic and triage framework.',
      contextWhy: 'Tests your analytical rigor, ability to isolate false positives (seasonality, tracking bugs) from real UX/technical regressions, and methodical root-cause decomposition.',
      regionalTip: 'In Indian and UAE tech hubs, interviewers expect you to mention payment gateway downtime, OTP/SMS delivery latency, banking partner SLA fluctuations, and regional festival cycles.',
      sampleAnswerFramework: '1. Clarify & Validate data integrity (tracking tags, logging anomaly) -> 2. Segment by dimensions (device, payment method, geo, app version) -> 3. Internal changes (recent deployments, A/B tests) -> 4. External factors (bank downtime, holiday) -> 5. Action plan & fix.',
      sampleSTAR: {
        situation: 'At PayFlow, our instant merchant settlement conversion dropped by 12% in the first week of March.',
        task: 'Identify root cause within 4 hours to minimize merchant churn and prevent revenue loss.',
        action: 'I segmented the logs by payment rail, discovered 85% of failures concentrated on a single partner bank API timeout during 3DS2 handshake, and toggled our dynamic fallback router to secondary acquirers.',
        result: 'Recovered checkout conversion back to 96.4% within 90 minutes and instituted real-time synthetic health probes with PagerDuty alerts.'
      }
    },
    {
      id: 'q_pm_2',
      category: 'behavioral',
      question: 'Tell me about a time you faced strong disagreement from an engineering lead on a product trade-off. How did you resolve it?',
      contextWhy: 'Evaluates your cross-functional empathy, respect for technical debt, and ability to influence without formal authority using user data and business clarity.',
      regionalTip: 'In UK and US interviews, emphasize psychological safety, active listening, and consensus-building without escalating prematurely.',
      sampleAnswerFramework: '1. Describe the conflict objectively -> 2. Deeply understand the engineer\'s technical constraints -> 3. Ground discussions in customer impact and data -> 4. Find phased compromise -> 5. Long-term relationship health.',
      sampleSTAR: {
        situation: 'Our engineering lead wanted a 6-week complete database rewrite before launching our UAE payment rail, whereas sales had promised early access to 5 key pilot customers.',
        task: 'Balance technical architecture scalability against vital market launch timing.',
        action: 'I sat down with the lead, mapped the critical path for the first 50 pilot transactions, and proposed an interim read-replica approach that reduced initial refactor scope to 10 days while scheduling the full migration for Q3.',
        result: 'Successfully onboarded pilot customers generating $240k initial GMV, and delivered the full architectural refactor ahead of the Q3 scaling spike.'
      }
    }
  ],
  engineering: [
    {
      id: 'q_eng_1',
      category: 'system_design',
      question: 'Design a distributed rate-limiting service capable of handling 500,000 requests per second across multi-region clusters with sub-5ms latency.',
      contextWhy: 'Probes deep knowledge of distributed state management, token bucket vs sliding window algorithms, Redis memory footprint, and network latency mitigation.',
      regionalTip: 'Staff-level rounds in Bangalore, Hyderabad, and London probe edge failure modes: what happens if the Redis cluster has a split-brain? How does local memory caching fail safe?',
      sampleAnswerFramework: '1. Functional/Non-functional requirements -> 2. Algorithm selection (Sliding Window Counter vs Token Bucket) -> 3. High-level architecture (API Gateway, Local Memory Cache, Distributed Redis) -> 4. Race condition prevention (Lua scripts / Redis Cluster) -> 5. Fault tolerance (Fail-open policy).',
      sampleSTAR: {
        situation: 'During Flash Sale events, unauthenticated scraping traffic caused severe DB connection pool exhaustion.',
        task: 'Design and implement a low-latency rate limiter safeguarding 18 internal microservices.',
        action: 'I implemented a two-tier rate limiter in Go: an in-process LRU cache for 90% of requests backed by a Redis cluster using sliding window log via Lua scripts, with a graceful fail-open circuit breaker.',
        result: 'Maintained 2.4ms p99 latency under 450,000 QPS load tests, shielding core services with zero false-positive lockouts.'
      }
    },
    {
      id: 'q_eng_2',
      category: 'technical',
      question: 'How do you guarantee exactly-once processing semantics in an event-driven Kafka architecture when downstream consumers face intermittent network failures?',
      contextWhy: 'Assesses mastery of idempotent consumers, transactional outbox patterns, unique deduplication keys, and distributed consistency.',
      regionalTip: 'Expect follow-ups on database locking mechanisms and dead-letter queue (DLQ) retry backoff strategies.',
      sampleAnswerFramework: '1. Idempotent Producer config -> 2. Consumer deduplication using unique transaction IDs in DB with unique constraint -> 3. Transactional Outbox pattern -> 4. Exponential backoff retry queue with DLQ.',
      sampleSTAR: {
        situation: 'Our payment ledger consumer occasionally processed duplicate webhook callbacks when payment gateways timed out.',
        task: 'Eliminate double-crediting of merchant wallets without compromising 25,000/sec throughput.',
        action: 'I introduced an idempotent consumer pattern using Redis distributed locks and atomic PostgreSQL `ON CONFLICT DO NOTHING` statements tied to transaction hash keys.',
        result: 'Eliminated 100% of duplicate ledger entries while maintaining sub-15ms processing speed.'
      }
    }
  ]
};
