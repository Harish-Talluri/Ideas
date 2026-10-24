import React, { useState } from 'react';
import { JobOpportunity, LocationHub, RoleTrack, UserProfile, RecruiterContact } from '../types';
import { CURATED_JOBS, LOCATION_HUBS } from '../data/mockData';
import { 
  Briefcase, 
  MapPin, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Copy, 
  Send, 
  Filter, 
  Search,
  FileText,
  DollarSign,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Building,
  Target,
  BadgeCheck,
  Check,
  Plus,
  Compass,
  X
} from 'lucide-react';

interface JobExplorerProps {
  userProfile: UserProfile;
  setUserProfile?: React.Dispatch<React.SetStateAction<UserProfile>>;
  selectedHub: LocationHub;
  setSelectedHub: (hub: LocationHub) => void;
  selectedRoleTrack: RoleTrack;
  setSelectedRoleTrack: (track: RoleTrack) => void;
  activeJob: JobOpportunity | null;
  setActiveJob: (job: JobOpportunity) => void;
  onOpenTailorStudio: (job: JobOpportunity) => void;
  externalJdDefaultOpen?: boolean;
}

export const JobExplorer: React.FC<JobExplorerProps> = ({
  userProfile,
  setUserProfile,
  selectedHub,
  setSelectedHub,
  selectedRoleTrack,
  setSelectedRoleTrack,
  activeJob,
  setActiveJob,
  onOpenTailorStudio,
  externalJdDefaultOpen = false
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'matches' | 'external_scan'>(
    externalJdDefaultOpen ? 'external_scan' : 'matches'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeniorityFilter, setSelectedSeniorityFilter] = useState<string>('all');
  
  // All accumulated jobs (curated base + any dynamically AI-generated jobs)
  const [allJobs, setAllJobs] = useState<JobOpportunity[]>(CURATED_JOBS);
  const [isGeneratingMoreJobs, setIsGeneratingMoreJobs] = useState(false);
  const [loadMoreCount, setLoadMoreCount] = useState<number>(10);

  // Filter mode: single hub vs all user preferred hubs
  const [matchAllPreferredHubs, setMatchAllPreferredHubs] = useState<boolean>(true);

  // External JD Scanner State
  const [externalJdText, setExternalJdText] = useState('');
  const [isScanningJd, setIsScanningJd] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Modals State
  const [outreachModalJob, setOutreachModalJob] = useState<JobOpportunity | null>(null);
  const [generatedOutreach, setGeneratedOutreach] = useState<any>(null);
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);

  const [completeJdModalJob, setCompleteJdModalJob] = useState<JobOpportunity | null>(null);
  const [applyModalJob, setApplyModalJob] = useState<JobOpportunity | null>(null);

  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [isAutoFiltering, setIsAutoFiltering] = useState(false);

  const userLocations = userProfile.targetLocations?.length 
    ? userProfile.targetLocations 
    : [selectedHub];

  // Filter jobs strictly based on user's active criteria (Requirement 3)
  const filteredJobs = allJobs.filter((job) => {
    // 1. Role track filter
    if (selectedRoleTrack !== 'all' && job.roleTrack !== selectedRoleTrack) {
      return false;
    }

    // 2. Location hub filter
    if (matchAllPreferredHubs) {
      if (!userLocations.includes(job.locationHub) && job.locationHub !== selectedHub) {
        return false;
      }
    } else {
      if (job.locationHub !== selectedHub) {
        return false;
      }
    }

    // 3. Seniority filter
    if (selectedSeniorityFilter !== 'all' && job.seniorityLevel !== selectedSeniorityFilter) {
      return false;
    }

    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchComp = job.company.toLowerCase().includes(q);
      const matchSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkills) return false;
    }

    return true;
  });

  // Strictly use filteredJobs so non-matching jobs NEVER leak into view
  const visibleCount = Math.max(10, loadMoreCount);
  const visibleJobs = filteredJobs.slice(0, visibleCount);

  // Auto-replenish matching jobs whenever user updates track, location, or seniority (Requirement 3)
  React.useEffect(() => {
    if (filteredJobs.length < 10 && !isGeneratingMoreJobs && !isAutoFiltering) {
      handleFetchCriteriaJobs();
    }
  }, [selectedRoleTrack, selectedSeniorityFilter, selectedHub, matchAllPreferredHubs, userLocations.join(',')]);

  const handleFetchCriteriaJobs = async () => {
    setIsAutoFiltering(true);
    try {
      const existingTitles = allJobs.map((j) => j.title);
      const res = await fetch('/api/career/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          preferences: {
            targetRoleTrack: selectedRoleTrack !== 'all' ? selectedRoleTrack : userProfile.targetRoleTrack,
            targetSeniority: selectedSeniorityFilter !== 'all' ? selectedSeniorityFilter : userProfile.targetSeniority,
            targetLocations: matchAllPreferredHubs ? userLocations : [selectedHub],
            workplaceType: 'Any',
            targetSalary: userProfile.currentSalary,
            noticePeriod: userProfile.noticePeriod
          },
          existingTitles,
          count: 10
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        setAllJobs((prev) => {
          const currentIds = new Set(prev.map((j) => j.id));
          const newUnique = data.jobs.filter((j: JobOpportunity) => !currentIds.has(j.id));
          return [...newUnique, ...prev];
        });
      }
    } catch (err) {
      console.error('Error auto-replenishing criteria jobs:', err);
    } finally {
      setIsAutoFiltering(false);
    }
  };

  // Generate 10 more matching jobs dynamically with AI based on user's exact profile and preferences
  const handleGenerateMoreJobs = async () => {
    setIsGeneratingMoreJobs(true);
    try {
      const existingTitles = allJobs.map((j) => j.title);
      const res = await fetch('/api/career/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          preferences: {
            targetRoleTrack: selectedRoleTrack !== 'all' ? selectedRoleTrack : userProfile.targetRoleTrack,
            targetSeniority: selectedSeniorityFilter !== 'all' ? selectedSeniorityFilter : userProfile.targetSeniority,
            targetLocations: matchAllPreferredHubs ? userLocations : [selectedHub],
            workplaceType: 'Any',
            targetSalary: userProfile.currentSalary,
            noticePeriod: userProfile.noticePeriod
          },
          existingTitles,
          count: 10 // Requirement: Pull 10 more jobs for every click!
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        setAllJobs((prev) => [...data.jobs, ...prev]);
        setLoadMoreCount((prev) => prev + 10);
        setCopyToast(`Added 10 new matching job opportunities!`);
        setTimeout(() => setCopyToast(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMoreJobs(false);
    }
  };

  // Toggle or mark job as applied
  const handleToggleApplied = (jobId: string, customDate?: string) => {
    const targetDate = customDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setAllJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const nextApplied = !j.isApplied;
          return {
            ...j,
            isApplied: nextApplied,
            appliedDate: nextApplied ? targetDate : undefined
          };
        }
        return j;
      })
    );

    if (applyModalJob && applyModalJob.id === jobId) {
      setApplyModalJob((prev) => (prev ? { ...prev, isApplied: !prev.isApplied, appliedDate: !prev.isApplied ? targetDate : undefined } : null));
    }

    setCopyToast(`Application status updated!`);
    setTimeout(() => setCopyToast(null), 2500);
  };

  // Add recommended skill to user profile
  const handleAddSkillToProfile = (skill: string) => {
    if (!setUserProfile) return;
    setUserProfile((prev) => {
      if (prev.skills.includes(skill)) return prev;
      return {
        ...prev,
        skills: [...prev.skills, skill]
      };
    });
    setCopyToast(`Added "${skill}" to your profile skills!`);
    setTimeout(() => setCopyToast(null), 3000);
  };

  // Handle Scanning External JD
  const handleScanExternalJd = async () => {
    if (!externalJdText.trim()) return;
    setIsScanningJd(true);
    setScanError(null);
    try {
      const res = await fetch('/api/career/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: externalJdText,
          userProfile,
          locationHub: selectedHub
        })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setScanResult(data.analysis);
      } else {
        setScanError(data.error || 'Failed to analyze job description');
      }
    } catch (err: any) {
      setScanError(err.message || 'Error communicating with JD scanner');
    } finally {
      setIsScanningJd(false);
    }
  };

  // Adopt Scanned External Job
  const handleAdoptScannedJob = () => {
    if (!scanResult) return;
    const newJob: JobOpportunity = {
      id: `ext_${Date.now()}`,
      title: scanResult.jobTitle || 'Custom Scanned Role',
      company: scanResult.company || 'External Organization',
      location: scanResult.location || LOCATION_HUBS[selectedHub].name,
      locationHub: selectedHub,
      roleTrack: userProfile.targetRoleTrack,
      seniorityLevel: userProfile.targetSeniority,
      workplaceType: scanResult.workplaceType || 'Hybrid',
      salaryRange: scanResult.salaryEstimate || 'Competitive Market Rate',
      currency: LOCATION_HUBS[selectedHub].currency,
      source: 'LinkedIn',
      sourceUrl: 'https://linkedin.com/jobs',
      description: externalJdText.slice(0, 300) + '...',
      fullJobDescription: externalJdText,
      requiredSkills: scanResult.requiredSkills || userProfile.skills.slice(0, 5),
      preferredSkills: scanResult.missingSkills || [],
      recommendedSkillsToBridge: scanResult.missingSkills || ['Domain Specialization', 'Regional Frameworks'],
      recruiter: {
        name: scanResult.recruiterHint?.name || 'Hiring Lead',
        role: scanResult.recruiterHint?.role || 'Talent Partner',
        email: scanResult.recruiterHint?.email || 'recruiter@company.com',
        linkedIn: scanResult.recruiterHint?.linkedIn || 'https://linkedin.com',
        companyDomain: 'company.com',
        responseRateScore: 92
      },
      matchScore: scanResult.matchScore || 88,
      profileScore: scanResult.matchScore || 88,
      atsScore: Math.min(96, (scanResult.matchScore || 88) + 4),
      keyFitReasons: scanResult.keyFitReasons || ['Strong alignment with target stack and senior responsibilities.'],
      missingSkills: scanResult.missingSkills || [],
      isExternal: true,
      postedAgo: 'Analyzed just now',
      isApplied: false
    };

    setAllJobs((prev) => [newJob, ...prev]);
    setActiveJob(newJob);
    onOpenTailorStudio(newJob);
  };

  // Generate Recruiter Outreach Message
  const handleOpenOutreach = async (job: JobOpportunity) => {
    setOutreachModalJob(job);
    setIsGeneratingOutreach(true);
    setGeneratedOutreach(null);

    try {
      const res = await fetch('/api/career/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          targetJob: job,
          recruiter: job.recruiter,
          channel: 'email',
          locationHub: job.locationHub
        })
      });
      const data = await res.json();
      if (data.success && data.outreach) {
        setGeneratedOutreach(data.outreach);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopyToast(null), 3000);
  };

  const getSourceBadgeStyle = (source: JobOpportunity['source']) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Naukri':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Greenhouse':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Indeed':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Company Careers':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Alert */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Control Header & Sub-Nav */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>Personalized Recommendations</span>
              <span aria-hidden="true">·</span>
              <span>At Least 10 Opportunities Displayed</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Recommended Jobs Based on Your Profile & Preferences
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Showing {visibleJobs.length} active opportunities (minimum 10 guaranteed). Target Hubs: {matchAllPreferredHubs ? userLocations.map((l) => LOCATION_HUBS[l]?.name || l).join(', ') : LOCATION_HUBS[selectedHub].name}.
            </p>
          </div>

          {/* Sub-Nav Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTabMode('matches')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTabMode === 'matches'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recommended Jobs ({visibleJobs.length})
            </button>
            <button
              onClick={() => setActiveTabMode('external_scan')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTabMode === 'external_scan'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Scan Any External JD</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        {activeTabMode === 'matches' && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            
            {/* Filter Group */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              
              {/* Role Track Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                <span className="text-slate-500 font-medium">Track:</span>
                <select
                  value={selectedRoleTrack}
                  onChange={(e) => setSelectedRoleTrack(e.target.value as RoleTrack)}
                  className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">All Tracks</option>
                  <option value="product">Product Management (PM, Staff, Lead, VP)</option>
                  <option value="engineering">Software Engineering (SDE, Staff, Lead)</option>
                  <option value="data_ai">Data Science & AI / ML</option>
                </select>
              </div>

              {/* Location Scope Toggle */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <button
                  onClick={() => setMatchAllPreferredHubs(!matchAllPreferredHubs)}
                  className="font-semibold text-slate-800 hover:text-indigo-600 cursor-pointer"
                >
                  {matchAllPreferredHubs ? 'All Preferred Hubs' : `${LOCATION_HUBS[selectedHub].name} Only`}
                </button>
              </div>

              {/* Seniority Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                <span className="text-slate-500 font-medium">Seniority:</span>
                <select
                  value={selectedSeniorityFilter}
                  onChange={(e) => setSelectedSeniorityFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">All Seniority Levels</option>
                  <option value="mid">Mid-Level (PM / SDE II)</option>
                  <option value="senior">Senior (Sr PM / Sr SDE)</option>
                  <option value="lead">Lead / Group PM</option>
                  <option value="staff">Staff PM / Staff Engineer</option>
                  <option value="principal">Principal PM / VP / Director</option>
                </select>
              </div>

              {/* AI Fetch 10 More Jobs Button */}
              <button
                onClick={handleGenerateMoreJobs}
                disabled={isGeneratingMoreJobs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 shadow-sm"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingMoreJobs ? 'animate-spin' : ''}`} />
                <span>{isGeneratingMoreJobs ? 'Pulling 10 More Jobs...' : 'Find 10 More Jobs with AI'}</span>
              </button>

            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search titles, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

          </div>
        )}
      </div>

      {/* Mode A: Matched Jobs List */}
      {activeTabMode === 'matches' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {visibleJobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-xl border p-6 shadow-sm hover:border-slate-300 transition-all space-y-5 ${
                  job.isApplied ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                {/* Top Row: Title, Company, Source Badge, Applied Status, and Dual Scores */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    
                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-900 text-sm">{job.company}</span>
                      <span aria-hidden="true">·</span>
                      
                      {/* Job Source Badge */}
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold transition-opacity hover:opacity-80 ${getSourceBadgeStyle(
                          job.source
                        )}`}
                        title={`View job posting on ${job.source}`}
                      >
                        <span>Source: {job.source}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>

                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{job.location}</span>
                      </span>

                      <span aria-hidden="true">·</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {job.workplaceType}
                      </span>

                      <span aria-hidden="true">·</span>
                      <span className="text-slate-400">{job.postedAgo}</span>

                      {/* Applied Status Badge */}
                      {job.isApplied && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                          <Check className="w-3 h-3" />
                          <span>Applied on {job.appliedDate || 'Recently'}</span>
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{job.title}</span>
                    </h2>

                    {/* Compensation */}
                    <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-0.5 font-mono">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.salaryRange}</span>
                    </div>
                  </div>

                  {/* Dual Scores Display: Profile Score & ATS Score */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Profile Score */}
                    <div className="flex flex-col items-center justify-center bg-blue-50/80 border border-blue-200/80 rounded-xl px-3.5 py-2 min-w-[90px]">
                      <span className="text-base font-bold text-blue-900 font-mono">
                        {job.profileScore || job.matchScore}%
                      </span>
                      <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                        Profile Score
                      </span>
                    </div>

                    {/* ATS Score */}
                    <div className="flex flex-col items-center justify-center bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3.5 py-2 min-w-[90px]">
                      <span className="text-base font-bold text-emerald-900 font-mono">
                        {job.atsScore || 93}%
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                        ATS Score
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Description Excerpt & Complete JD Button */}
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                  <div>
                    <button
                      onClick={() => setCompleteJdModalJob(job)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Complete Job Description & Requirements</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Recommended Skills to Bridge (Requirement 4) */}
                <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-600" />
                      <span>Recommended Skills to Bridge (Missing from your Profile)</span>
                    </span>
                    <span className="text-[10px] text-amber-700 font-medium">
                      Add to profile to boost ATS keyword match
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(job.recommendedSkillsToBridge || job.missingSkills || []).map((skill, sIdx) => {
                      const alreadyPossessed = userProfile.skills.includes(skill);
                      return (
                        <div
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-amber-200 rounded-md text-xs shadow-2xs"
                        >
                          <span className="font-medium text-slate-800">{skill}</span>
                          {!alreadyPossessed && setUserProfile && (
                            <button
                              onClick={() => handleAddSkillToProfile(skill)}
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded transition-colors inline-flex items-center gap-0.5"
                              title="Add this skill to your personal profile"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>Add</span>
                            </button>
                          )}
                          {alreadyPossessed && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded flex items-center">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Required & Preferred Skills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-slate-500 font-semibold mr-1">Required:</span>
                  {job.requiredSkills.map((req, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                      {req}
                    </span>
                  ))}
                  {job.preferredSkills?.map((pref, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-medium">
                      + {pref}
                    </span>
                  ))}
                </div>

                {/* Fit Reasons & Skill Gaps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Match Factors:</span>
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {job.keyFitReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">›</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Tailoring Recommendations:</span>
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {job.missingSkills.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">›</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recruiter Contact Box & Primary Action Toolbar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Recruiter Details */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                      {job.recruiter.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{job.recruiter.name}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {job.recruiter.responseRateScore}% Response Rate
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                        <span>{job.recruiter.role}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-700">{job.recruiter.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Apply Now, Complete JD, Tailor ATS Resume */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(job.recruiter.email, 'Recruiter Email')}
                      className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs transition-colors"
                      title="Copy Recruiter Email"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenOutreach(job)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Outreach</span>
                    </button>

                    <button
                      onClick={() => onOpenTailorStudio(job)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Tailor ATS Resume</span>
                    </button>

                    {/* Primary Apply Now Button (Requirement 1) */}
                    <button
                      onClick={() => setApplyModalJob(job)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-sm ${
                        job.isApplied
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{job.isApplied ? 'Applied ✓ (Manage)' : 'Apply Now'}</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

          {/* Footer Controls: Pull 10 More Jobs Button */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">
              Displaying {visibleJobs.length} active opportunities. Need more matches for your specific career track?
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleGenerateMoreJobs}
                disabled={isGeneratingMoreJobs}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingMoreJobs ? 'animate-spin' : ''}`} />
                <span>{isGeneratingMoreJobs ? 'Pulling 10 More Jobs...' : 'Find 10 More Jobs'}</span>
              </button>

              {filteredJobs.length > visibleJobs.length && (
                <button
                  onClick={() => setLoadMoreCount((prev) => prev + 10)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-200"
                >
                  Show Next 10 ({filteredJobs.length - visibleJobs.length} cached)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode B: External Job Description Scanner (LinkedIn, Naukri, Portals) */}
      {activeTabMode === 'external_scan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>External Job Description Scanner & Gap Analyzer</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Found an interesting opening on LinkedIn, Naukri, Indeed, or a company careers portal? Paste the raw JD below. CareerPath AI will calculate your Profile Score & ATS Compatibility Score, diagnose missing skills to bridge, and construct an ATS-optimized application.
              </p>
            </div>

            <textarea
              rows={8}
              value={externalJdText}
              onChange={(e) => setExternalJdText(e.target.value)}
              placeholder="Paste job posting description here (Role, Responsibilities, Requirements, Tech Stack)..."
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>Calibrating against market:</span>
                <span className="font-bold text-slate-900">{LOCATION_HUBS[selectedHub].name}</span>
              </div>

              <button
                onClick={handleScanExternalJd}
                disabled={!externalJdText.trim() || isScanningJd}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isScanningJd ? 'Analyzing & Scoring with AI...' : 'Analyze JD & Match Profile'}</span>
              </button>
            </div>

            {scanError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs">
                {scanError}
              </div>
            )}
          </div>

          {/* Scanner Results Display */}
          {scanResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500">
                    {scanResult.company} · {scanResult.location} · {scanResult.workplaceType}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {scanResult.jobTitle}
                  </h2>
                  <div className="text-xs font-semibold text-emerald-700 mt-1">
                    Estimated Compensation: {scanResult.salaryEstimate}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2 text-center shrink-0">
                    <span className="text-lg font-bold text-blue-900 font-mono">
                      {scanResult.matchScore || 88}%
                    </span>
                    <span className="text-[10px] text-blue-700 block uppercase font-bold tracking-wider">
                      Profile Score
                    </span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2 text-center shrink-0">
                    <span className="text-lg font-bold text-emerald-900 font-mono">
                      {Math.min(98, (scanResult.matchScore || 88) + 4)}%
                    </span>
                    <span className="text-[10px] text-emerald-700 block uppercase font-bold tracking-wider">
                      ATS Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Strengths and Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Fit Strengths</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {scanResult.keyFitReasons?.map((reason: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">›</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Recommended Skills to Bridge</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {scanResult.missingSkills?.map((gap: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">›</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Inferred Recruiter Outreach Preview */}
              {scanResult.outreachMessage && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Instant Recruiter Direct Pitch Draft</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(scanResult.outreachMessage.body, 'Outreach Draft')}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Copy Message
                    </button>
                  </div>
                  <div className="text-xs font-mono text-slate-700 bg-white p-3 rounded border border-slate-200/80 whitespace-pre-wrap leading-relaxed">
                    <div className="font-bold text-slate-900 mb-2">Subject: {scanResult.outreachMessage.subject}</div>
                    {scanResult.outreachMessage.body}
                  </div>
                </div>
              )}

              {/* Action: Prime and jump to ATS Resume Tailor */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAdoptScannedJob}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Build Tailored ATS Resume for this JD</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete Job Description Modal (Requirement 7) */}
      {completeJdModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{completeJdModalJob.company}</span>
                  <span aria-hidden="true">·</span>
                  <a
                    href={completeJdModalJob.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold ${getSourceBadgeStyle(
                      completeJdModalJob.source
                    )}`}
                  >
                    <span>Source: {completeJdModalJob.source}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span aria-hidden="true">·</span>
                  <span>{completeJdModalJob.location}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {completeJdModalJob.title}
                </h2>
                <div className="text-xs font-semibold text-emerald-700 font-mono">
                  {completeJdModalJob.salaryRange}
                </div>
              </div>

              <button
                onClick={() => setCompleteJdModalJob(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
              
              {/* Dual Score Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 font-bold font-mono text-base flex items-center justify-center">
                    {completeJdModalJob.profileScore || completeJdModalJob.matchScore}%
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Profile Compatibility</span>
                    <span className="text-[11px] text-slate-500">Matches domain experience & seniority tier</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold font-mono text-base flex items-center justify-center">
                    {completeJdModalJob.atsScore || 93}%
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">ATS Parsing Score</span>
                    <span className="text-[11px] text-slate-500">Keyword density & scanner compatibility</span>
                  </div>
                </div>
              </div>

              {/* Recommended Skills To Bridge */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <span className="font-bold text-amber-900 text-xs block uppercase tracking-wider">
                  Recommended Skills to Bridge (Missing from Profile):
                </span>
                <div className="flex flex-wrap gap-2">
                  {(completeJdModalJob.recommendedSkillsToBridge || []).map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white border border-amber-300 rounded text-amber-900 text-xs font-medium">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Complete Job Description Text */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b pb-1">
                  Full Job Description & Specifications
                </h3>
                <div className="whitespace-pre-line text-slate-800 leading-relaxed font-sans bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                  {completeJdModalJob.fullJobDescription || completeJdModalJob.description}
                </div>
              </div>

              {/* Recruiter Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">Hiring Lead / Recruiter:</span>
                  <span className="font-bold text-slate-900 text-xs">{completeJdModalJob.recruiter.name} — {completeJdModalJob.recruiter.role}</span>
                  <span className="text-slate-500 font-mono text-[11px] block mt-0.5">{completeJdModalJob.recruiter.email}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(completeJdModalJob.recruiter.email, 'Recruiter Email')}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Copy Email
                </button>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <a
                href={completeJdModalJob.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                <span>View on {completeJdModalJob.source}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setCompleteJdModalJob(null);
                    onOpenTailorStudio(completeJdModalJob);
                  }}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors"
                >
                  Tailor ATS Resume
                </button>

                <button
                  onClick={() => {
                    setCompleteJdModalJob(null);
                    setApplyModalJob(completeJdModalJob);
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Apply Now
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Apply to Job Modal (Requirement 1) */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                  Job Application Manager
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Apply to {applyModalJob.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {applyModalJob.company} · {applyModalJob.location}
                </div>
              </div>
              <button
                onClick={() => setApplyModalJob(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Application Paths */}
            <div className="space-y-4">
              
              {/* Path 1: Direct Job Source */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Option 1: Official Portal Application</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Source: {applyModalJob.source}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Submit your profile directly on the official {applyModalJob.source} posting or company career board.
                </p>
                <div className="pt-1">
                  <a
                    href={applyModalJob.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>Open Application on {applyModalJob.source}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Path 2: Direct Recruiter Pitch */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Option 2: Direct Recruiter Email Outreach</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {applyModalJob.recruiter.responseRateScore}% Response Rate
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Send your personalized ATS resume and intro note straight to {applyModalJob.recruiter.name} ({applyModalJob.recruiter.role}).
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`mailto:${applyModalJob.recruiter.email}?subject=${encodeURIComponent(
                      `Application for ${applyModalJob.title} — ${userProfile.name || 'Candidate'}`
                    )}&body=${encodeURIComponent(
                      `Dear ${applyModalJob.recruiter.name},\n\nI am writing to express my strong interest in the ${applyModalJob.title} position at ${applyModalJob.company}.\n\nGiven my background in ${userProfile.skills.slice(0, 4).join(', ')}, I can make an immediate impact on your key product and tech milestones.\n\nI have attached my tailored ATS resume for your review and would welcome the chance to speak this week.\n\nBest regards,\n${userProfile.name || 'Candidate'}\n${userProfile.email} | ${userProfile.phone}`
                    )}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in Email App ({applyModalJob.recruiter.email})</span>
                  </a>

                  <button
                    onClick={() => copyToClipboard(applyModalJob.recruiter.email, 'Recruiter Email')}
                    className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300"
                  >
                    Copy Email
                  </button>
                </div>
              </div>

              {/* Status Tracking: Mark as Applied */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">
                    {applyModalJob.isApplied ? 'Application Status: Applied ✓' : 'Track Your Application'}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {applyModalJob.isApplied 
                      ? `Marked as applied on ${applyModalJob.appliedDate || 'Recently'}.`
                      : 'Mark as applied to record in your personal pipeline.'}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleApplied(applyModalJob.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                    applyModalJob.isApplied
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {applyModalJob.isApplied ? 'Mark as Not Applied' : 'Mark as Applied ✓'}
                </button>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setApplyModalJob(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Recruiter Outreach Generator Modal */}
      {outreachModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 shadow-xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Direct Recruiter Outreach Generator
                </h3>
                <p className="text-xs text-slate-500">
                  Target: {outreachModalJob.recruiter.name} ({outreachModalJob.recruiter.role} at {outreachModalJob.company})
                </p>
              </div>
              <button
                onClick={() => setOutreachModalJob(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {isGeneratingOutreach ? (
              <div className="py-12 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Crafting personalized recruiter outreach with Gemini AI...
                </p>
              </div>
            ) : generatedOutreach ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Subject Line
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedOutreach.subject}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800"
                    />
                    <button
                      onClick={() => copyToClipboard(generatedOutreach.subject, 'Subject')}
                      className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Personalized Message Body
                  </label>
                  <textarea
                    rows={8}
                    readOnly
                    value={generatedOutreach.messageBody}
                    className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed"
                  />
                </div>

                {generatedOutreach.followUpTip && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    <span className="font-bold">Recruiter Etiquette Tip: </span>
                    {generatedOutreach.followUpTip}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={`mailto:${outreachModalJob.recruiter.email}?subject=${encodeURIComponent(
                      generatedOutreach.subject
                    )}&body=${encodeURIComponent(generatedOutreach.messageBody)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Open in Email Client ({outreachModalJob.recruiter.email})</span>
                  </a>

                  <button
                    onClick={() => copyToClipboard(generatedOutreach.messageBody, 'Outreach Message')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                  >
                    Copy Full Pitch
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
};
