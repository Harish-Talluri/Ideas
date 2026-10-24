export type RoleTrack = 'product' | 'engineering' | 'data_ai' | 'all';

export type SeniorityLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'staff' | 'principal' | 'director';

export type LocationHub = 'bangalore' | 'hyderabad' | 'dubai' | 'london' | 'us_remote';

export interface LocationHubConfig {
  id: LocationHub;
  name: string;
  country: string;
  currency: string;
  currencySymbol: string;
  marketHighlights: string[];
  compStructure: string;
  hiringCulture: string;
  resumeStandards: string;
}

export interface UserExperience {
  company: string;
  role: string;
  duration: string;
  location: string;
  bulletPoints: string[];
  isKeyRoleMatch?: boolean;
  keyMatchReason?: string;
}

export interface UserEducation {
  institution: string;
  degree: string;
  year: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  targetRoleTrack: RoleTrack;
  targetSeniority: SeniorityLevel;
  targetLocations: LocationHub[];
  currentSalary: string;
  noticePeriod: string;
  summary: string;
  skills: string[];
  experiences: UserExperience[];
  education: UserEducation[];
}

export interface UserPreferences {
  targetRoleTrack: RoleTrack;
  targetTitles: string[];
  targetSeniority: SeniorityLevel;
  targetLocations: LocationHub[];
  workplaceType: 'Any' | 'Remote' | 'Hybrid' | 'On-site';
  targetSalary?: string;
  noticePeriod?: string;
}

export interface RecruiterContact {
  name: string;
  role: string;
  email: string;
  linkedIn: string;
  companyDomain: string;
  responseRateScore: number;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogoText?: string;
  location: string;
  locationHub: LocationHub;
  roleTrack: RoleTrack;
  seniorityLevel: SeniorityLevel;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  salaryRange: string;
  currency: string;
  description: string;
  fullJobDescription?: string;
  source: 'LinkedIn' | 'Naukri' | 'Company Careers' | 'Greenhouse' | 'Indeed';
  sourceUrl: string;
  requiredSkills: string[];
  preferredSkills: string[];
  recommendedSkillsToBridge: string[];
  recruiter: RecruiterContact;
  matchScore: number;
  profileScore: number;
  atsScore: number;
  keyFitReasons: string[];
  missingSkills: string[];
  isExternal?: boolean;
  postedAgo: string;
  isApplied?: boolean;
  appliedDate?: string;
}

export interface ATSResume {
  profileId: string;
  targetJobId: string;
  targetJobTitle: string;
  targetCompany: string;
  locationHub: LocationHub;
  candidateLocationHeader?: string;
  atsScore: number;
  tailoredSummary: string;
  targetedSkills: string[];
  experiences: UserExperience[];
  education: UserEducation[];
  matchedKeywords: string[];
  missingKeywords: string[];
  impactImprovements: string[];
}

export interface OutreachMessage {
  recipientName: string;
  recipientRole: string;
  recipientEmail: string;
  channel: 'email' | 'inmail' | 'whatsapp';
  subject: string;
  messageBody: string;
  keyHighlights: string[];
  followUpTip: string;
}

export interface STARAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'product_execution' | 'system_design' | 'case_study';
  question: string;
  contextWhy: string;
  regionalTip: string;
  sampleAnswerFramework: string;
  sampleSTAR: STARAnswer;
  userPracticeAnswer?: string;
  aiFeedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    refinedVersion: string;
  };
}

export interface SalaryBenchmark {
  roleTrack: RoleTrack;
  roleTitle: string;
  seniorityLevel: SeniorityLevel;
  locationHub: LocationHub;
  currency: string;
  currencySymbol: string;
  p25: string;
  p50: string;
  p75: string;
  p90: string;
  compBreakdown: {
    fixedOrBase: string;
    variableOrBonus: string;
    equityOrAllowances: string;
  };
  taxAndBenefitsSummary: string;
  regionalNegotiationTips: string[];
  counterOfferScript: string;
}

export interface NegotiationChatMessage {
  id: string;
  sender: 'recruiter' | 'user' | 'ai_coach';
  text: string;
  timestamp: string;
  feedback?: string;
}
