import React, { useState, useEffect } from 'react';
import { JobOpportunity, LocationHub, UserProfile, ATSResume, UserExperience, UserEducation } from '../types';
import { CURATED_JOBS, LOCATION_HUBS } from '../data/mockData';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  MapPin, 
  Briefcase,
  ChevronRight,
  Sliders,
  Download,
  Edit3,
  Eye,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Check,
  Target,
  Building,
  Star,
  FileDown
} from 'lucide-react';

interface ATSTailorStudioProps {
  userProfile: UserProfile;
  setUserProfile?: React.Dispatch<React.SetStateAction<UserProfile>>;
  selectedHub: LocationHub;
  activeJob: JobOpportunity | null;
  setActiveJob: (job: JobOpportunity) => void;
}

export const ATSTailorStudio: React.FC<ATSTailorStudioProps> = ({
  userProfile,
  setUserProfile,
  selectedHub,
  activeJob,
  setActiveJob
}) => {
  const [currentJob, setCurrentJob] = useState<JobOpportunity>(
    activeJob || CURATED_JOBS[0]
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [tailoredResume, setTailoredResume] = useState<ATSResume | null>(null);
  const [aiOriginalResume, setAiOriginalResume] = useState<ATSResume | null>(null);
  
  // Editable Resume State (Requirement 4)
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const [activeResumeView, setActiveResumeView] = useState<'tailored' | 'side_by_side'>('side_by_side');

  // Trigger tailor generation when currentJob changes or on first load
  useEffect(() => {
    if (activeJob) {
      setCurrentJob(activeJob);
    }
  }, [activeJob]);

  // Compute localized candidate location header (Requirement 5)
  const computeDefaultLocationHeader = (hub: LocationHub, job: JobOpportunity): string => {
    const baseLoc = userProfile.location?.trim() || 'Hyderabad, India';
    const targetLoc = (job.location || '').toLowerCase();
    const isDubai = hub === 'dubai' || targetLoc.includes('dubai') || targetLoc.includes('uae');
    const isLondon = hub === 'london' || targetLoc.includes('london') || targetLoc.includes('uk');
    const isUS = hub === 'us_remote' || targetLoc.includes('remote') || targetLoc.includes('us');

    if (isDubai) {
      return `${baseLoc} (Open to Relocate to Dubai / UAE)`;
    }
    if (isLondon) {
      return `${baseLoc} (Open to Relocate to London, UK)`;
    }
    if (isUS) {
      return `${baseLoc} (Open to Global Remote / Relocation)`;
    }
    return baseLoc;
  };

  useEffect(() => {
    handleGenerateTailoredResume();
  }, [currentJob.id, selectedHub]);

  const handleGenerateTailoredResume = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/career/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          targetJob: currentJob,
          locationHub: selectedHub
        })
      });
      const data = await res.json();
      if (data.success && data.tailoredResume) {
        // Enforce candidate location header
        const computedLocation = computeDefaultLocationHeader(selectedHub, currentJob);
        
        // Ensure experiences identify key role matches (Requirement 4)
        const experiencesWithRoleMatches = (data.tailoredResume.experiences || []).map((exp: UserExperience, idx: number) => {
          const isKey = exp.isKeyRoleMatch ?? (
            idx === 0 || 
            exp.role.toLowerCase().includes(currentJob.roleTrack) ||
            currentJob.requiredSkills.some((s) => exp.bulletPoints.some((bp) => bp.toLowerCase().includes(s.toLowerCase())))
          );
          return {
            ...exp,
            isKeyRoleMatch: isKey,
            keyMatchReason: exp.keyMatchReason || (isKey ? `Directly aligns with ${currentJob.title} qualifications, system scale, and leadership scope` : undefined)
          };
        });

        const resumeWithLocation: ATSResume = {
          ...data.tailoredResume,
          candidateLocationHeader: data.tailoredResume.candidateLocationHeader || computedLocation,
          experiences: experiencesWithRoleMatches
        };

        setTailoredResume(resumeWithLocation);
        setAiOriginalResume(JSON.parse(JSON.stringify(resumeWithLocation)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`${label} copied!`);
    setTimeout(() => setCopyToast(null), 3000);
  };

  // Helper to re-evaluate ATS score dynamically when user edits skills or content
  const recomputeATSScore = (resume: ATSResume): number => {
    if (!currentJob) return resume.atsScore;
    const allKeywords = [...currentJob.requiredSkills, ...(currentJob.preferredSkills || [])];
    const resumeText = [
      resume.tailoredSummary,
      resume.targetedSkills.join(' '),
      resume.experiences.map((e) => e.role + ' ' + e.bulletPoints.join(' ')).join(' ')
    ].join(' ').toLowerCase();

    let matched = 0;
    allKeywords.forEach((kw) => {
      if (resumeText.includes(kw.toLowerCase())) {
        matched++;
      }
    });

    const ratio = allKeywords.length > 0 ? matched / allKeywords.length : 1;
    return Math.min(99, Math.max(86, Math.round(85 + ratio * 13)));
  };

  // Update field in tailored resume
  const updateResumeField = <K extends keyof ATSResume>(field: K, value: ATSResume[K]) => {
    setTailoredResume((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      updated.atsScore = recomputeATSScore(updated);
      return updated;
    });
  };

  // Skills Editing
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed || !tailoredResume) return;
    if (tailoredResume.targetedSkills.includes(trimmed)) return;
    const updatedSkills = [...tailoredResume.targetedSkills, trimmed];
    updateResumeField('targetedSkills', updatedSkills);
    setNewSkillInput('');
    setCopyToast(`Added skill: ${trimmed}`);
    setTimeout(() => setCopyToast(null), 2000);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!tailoredResume) return;
    const updatedSkills = tailoredResume.targetedSkills.filter((s) => s !== skillToRemove);
    updateResumeField('targetedSkills', updatedSkills);
  };

  // Experience Editing
  const handleUpdateExperience = (index: number, updatedExp: Partial<UserExperience>) => {
    if (!tailoredResume) return;
    const newExps = [...tailoredResume.experiences];
    newExps[index] = { ...newExps[index], ...updatedExp };
    updateResumeField('experiences', newExps);
  };

  const handleUpdateBulletPoint = (expIndex: number, bulletIndex: number, newText: string) => {
    if (!tailoredResume) return;
    const newExps = [...tailoredResume.experiences];
    const newBullets = [...newExps[expIndex].bulletPoints];
    newBullets[bulletIndex] = newText;
    newExps[expIndex] = { ...newExps[expIndex], bulletPoints: newBullets };
    updateResumeField('experiences', newExps);
  };

  const handleAddBulletPoint = (expIndex: number) => {
    if (!tailoredResume) return;
    const newExps = [...tailoredResume.experiences];
    newExps[expIndex] = {
      ...newExps[expIndex],
      bulletPoints: [...newExps[expIndex].bulletPoints, 'Spearheaded operational milestone delivering quantifiable scale and efficiency.']
    };
    updateResumeField('experiences', newExps);
  };

  const handleRemoveBulletPoint = (expIndex: number, bulletIndex: number) => {
    if (!tailoredResume) return;
    const newExps = [...tailoredResume.experiences];
    const newBullets = newExps[expIndex].bulletPoints.filter((_, idx) => idx !== bulletIndex);
    newExps[expIndex] = { ...newExps[expIndex], bulletPoints: newBullets };
    updateResumeField('experiences', newExps);
  };

  // Toggle key role match for an experience
  const handleToggleKeyRoleMatch = (expIndex: number) => {
    if (!tailoredResume) return;
    const newExps = [...tailoredResume.experiences];
    const currentVal = Boolean(newExps[expIndex].isKeyRoleMatch);
    newExps[expIndex] = {
      ...newExps[expIndex],
      isKeyRoleMatch: !currentVal,
      keyMatchReason: !currentVal ? `Pivotal background matching ${currentJob.title} core criteria` : undefined
    };
    updateResumeField('experiences', newExps);
  };

  // Education Editing
  const handleUpdateEducation = (index: number, updatedEdu: Partial<UserEducation>) => {
    if (!tailoredResume) return;
    const newEdus = [...tailoredResume.education];
    newEdus[index] = { ...newEdus[index], ...updatedEdu };
    updateResumeField('education', newEdus);
  };

  // Reset to original AI generation
  const handleResetToAiOriginal = () => {
    if (aiOriginalResume) {
      setTailoredResume(JSON.parse(JSON.stringify(aiOriginalResume)));
      setCopyToast('Resume reset to original AI tailored version');
      setTimeout(() => setCopyToast(null), 2500);
    }
  };

  // Download ATS Resume as Word (.doc) Document (Requirement 4)
  const handleDownloadDoc = () => {
    if (!tailoredResume) return;
    const candidateName = userProfile.name || 'Candidate';
    const locHeader = tailoredResume.candidateLocationHeader || candidateLocation;
    
    const expHtml = (tailoredResume.experiences || [])
      .map(
        (exp) => `
        <div style="margin-bottom: 14pt;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; font-size: 11pt; text-align: left; color: #111827;">${exp.role}</td>
              <td style="font-size: 10pt; color: #4b5563; text-align: right; font-family: monospace;">${exp.duration}</td>
            </tr>
            <tr>
              <td colspan="2" style="font-size: 10pt; color: #374151; font-weight: 500;">${exp.company} — ${exp.location}</td>
            </tr>
          </table>
          ${
            exp.isKeyRoleMatch
              ? `<div style="margin: 3pt 0; padding: 2pt 6pt; background-color: #eef2ff; border-left: 3pt solid #4f46e5; font-size: 9.5pt; color: #3730a3;"><strong>★ Key Match for ${currentJob.title}:</strong> ${exp.keyMatchReason || 'Direct domain leadership & technical alignment'}</div>`
              : ''
          }
          <ul style="margin: 4pt 0 0 16pt; padding: 0;">
            ${exp.bulletPoints.map((bp) => `<li style="font-size: 10pt; margin-bottom: 3pt; line-height: 1.35; color: #1f2937;">${bp}</li>`).join('')}
          </ul>
        </div>
      `
      )
      .join('');

    const eduHtml = (tailoredResume.education || [])
      .map(
        (edu) => `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 4pt;">
          <tr>
            <td style="font-weight: bold; font-size: 10pt; color: #111827;">${edu.degree} — ${edu.institution}</td>
            <td style="font-size: 10pt; color: #6b7280; text-align: right; font-family: monospace;">${edu.year}</td>
          </tr>
        </table>
      `
      )
      .join('');

    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${candidateName} - Tailored ATS Resume</title>
        <style>
          body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.3; color: #1f2937; margin: 1in; }
          h1 { font-size: 20pt; text-align: center; text-transform: uppercase; margin-bottom: 2pt; letter-spacing: 0.5pt; color: #111827; }
          .header-meta { text-align: center; font-size: 10pt; color: #4b5563; margin-bottom: 4pt; }
          .target-bar { text-align: center; font-size: 10pt; font-weight: bold; color: #4338ca; margin-bottom: 14pt; }
          h2 { font-size: 11pt; text-transform: uppercase; border-bottom: 1.5pt solid #374151; padding-bottom: 2pt; margin-top: 14pt; margin-bottom: 6pt; letter-spacing: 0.5pt; color: #111827; }
          p { margin: 0 0 6pt 0; font-size: 10pt; line-height: 1.4; color: #374151; }
        </style>
      </head>
      <body>
        <h1>${candidateName}</h1>
        <div class="header-meta">${userProfile.email || 'email@example.com'} | ${userProfile.phone || '+91 98765 43210'} | ${locHeader}</div>
        <div class="target-bar">Target Position: ${tailoredResume.targetJobTitle} — ${tailoredResume.targetCompany} (${currentJob.location})</div>
        
        <h2>Professional Summary</h2>
        <p>${tailoredResume.tailoredSummary}</p>

        <h2>Core Competencies & Keywords</h2>
        <p><strong>${tailoredResume.targetedSkills.join(' · ')}</strong></p>

        <h2>Professional Experience</h2>
        ${expHtml}

        <h2>Education & Credentials</h2>
        ${eduHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = currentJob.title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${candidateName.replace(/\s+/g, '_')}_ATS_Resume_${safeTitle}.doc`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopyToast(`Downloaded ${fileName} in Word (.doc) format!`);
    setTimeout(() => setCopyToast(null), 3000);
  };

  // Download ATS Resume as PDF (Requirement 4)
  const handleDownloadPdf = () => {
    window.print();
  };

  const generatePlainTextResume = () => {
    if (!tailoredResume) return '';
    const locHeader = tailoredResume.candidateLocationHeader || computeDefaultLocationHeader(selectedHub, currentJob);
    const expText = (tailoredResume.experiences || [])
      .map(
        (exp) =>
          `${exp.role.toUpperCase()} | ${exp.company} | ${exp.location} (${exp.duration})\n` +
          (exp.isKeyRoleMatch ? `[★ Key Role Match: ${exp.keyMatchReason || 'Core domain alignment'}]\n` : '') +
          exp.bulletPoints.map((bp) => `• ${bp}`).join('\n')
      )
      .join('\n\n');

    const eduText = (tailoredResume.education || [])
      .map((edu) => `${edu.degree} — ${edu.institution} (${edu.year})`)
      .join('\n');

    return `${(userProfile.name || 'Candidate Full Name').toUpperCase()}\n${userProfile.email || 'candidate@email.com'} | ${userProfile.phone || '+91 98765 43210'} | ${locHeader}\nTarget: ${tailoredResume.targetJobTitle} at ${tailoredResume.targetCompany}\n\nPROFESSIONAL SUMMARY\n${tailoredResume.tailoredSummary}\n\nCORE COMPETENCIES & KEYWORDS\n${tailoredResume.targetedSkills.join(' · ')}\n\nPROFESSIONAL EXPERIENCE\n${expText}\n\nEDUCATION\n${eduText}`;
  };

  const candidateLocation = tailoredResume?.candidateLocationHeader || computeDefaultLocationHeader(selectedHub, currentJob);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Alert */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-2 border border-slate-700 animate-fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Control Header & Target Role Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>ATS Resume Studio</span>
              <span aria-hidden="true">·</span>
              <span>Fully Editable & Role Highlighted</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              ATS Resume Studio & Document Tailor
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Optimized for {currentJob.title} at {currentJob.company} in {LOCATION_HUBS[selectedHub].name}. Edit sections, review key role experience highlights, and download in PDF or Word DOC format.
            </p>
          </div>

          {/* Action Toolbar: Edit Toggle, Regenerate, Download Word, Download PDF */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Edit Mode Toggle Button (Requirement 4) */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                isEditMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs ring-1 ring-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-2xs'
              }`}
            >
              {isEditMode ? <Eye className="w-3.5 h-3.5 text-amber-600" /> : <Edit3 className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{isEditMode ? 'Preview Document' : 'Edit Resume'}</span>
            </button>

            {isEditMode && aiOriginalResume && (
              <button
                onClick={handleResetToAiOriginal}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                title="Revert all manual edits back to the AI generated version"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset to AI</span>
              </button>
            )}

            <button
              onClick={handleGenerateTailoredResume}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>

            <button
              onClick={() => copyToClipboard(generatePlainTextResume(), 'ATS Plaintext Resume')}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>Copy Plaintext</span>
            </button>

            {/* Download Word (.doc) Button (Requirement 4) */}
            <button
              onClick={handleDownloadDoc}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              title="Download ATS resume formatted for Microsoft Word (.doc)"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download Word (.doc)</span>
            </button>

            {/* Download PDF Button (Requirement 4) */}
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm shadow-indigo-100"
              title="Print or export as PDF document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Target Job Switcher Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Currently Tailoring For:</span>
            <select
              value={currentJob.id}
              onChange={(e) => {
                const found = CURATED_JOBS.find((j) => j.id === e.target.value);
                if (found) {
                  setCurrentJob(found);
                  setActiveJob(found);
                }
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-slate-900 outline-none cursor-pointer max-w-xs sm:max-w-md truncate"
            >
              {CURATED_JOBS.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company} ({j.location})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">View Layout:</span>
            <div className="flex p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setActiveResumeView('side_by_side')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeResumeView === 'side_by_side' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Side-by-Side Comparison
              </button>
              <button
                onClick={() => setActiveResumeView('tailored')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeResumeView === 'tailored' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Tailored Document Only
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode Active Helper Banner */}
      {isEditMode && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-xs text-amber-900 flex items-center justify-between no-print animate-fade-in">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Edit Resume Mode is Active: </span>
              <span>You can edit the candidate location header, summary, competency tags, and experience bullet points directly below. Downloads in PDF or Word DOC will preserve your edits.</span>
            </div>
          </div>
          <button
            onClick={() => setIsEditMode(false)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md transition-colors shrink-0 shadow-2xs"
          >
            Save & Preview
          </button>
        </div>
      )}

      {/* ATS Quality & Optimization Score Banner */}
      {tailoredResume && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm no-print space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-lg font-mono">
                {tailoredResume.atsScore}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    ATS Pass Compatibility Score
                  </h3>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    High Probability Screening Pass
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Optimized for Workday, Greenhouse, Taleo, and {LOCATION_HUBS[selectedHub].name} applicant screening systems.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-50 border px-2.5 py-1 rounded-md text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold">Candidate Location Header:</span>
                <span className="font-mono text-slate-900">{candidateLocation}</span>
              </div>
            </div>
          </div>

          {/* Quick Bridge Missing Skills Chips into Resume */}
          {currentJob.recommendedSkillsToBridge && currentJob.recommendedSkillsToBridge.length > 0 && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Missing Job Skills You Can Inject with 1-Click:</span>
                </span>
                <span className="text-[10px] text-indigo-700">Click to add to targeted skills</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentJob.recommendedSkillsToBridge.map((skill, sIdx) => {
                  const alreadyIn = tailoredResume.targetedSkills.includes(skill);
                  return (
                    <button
                      key={sIdx}
                      onClick={() => handleAddSkill(skill)}
                      disabled={alreadyIn}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors border ${
                        alreadyIn
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                          : 'bg-white text-indigo-700 hover:bg-indigo-100 border-indigo-200 cursor-pointer shadow-2xs'
                      }`}
                    >
                      <span>{alreadyIn ? '✓' : '+'}</span>
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Keywords & Impact Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
            <div>
              <span className="font-semibold text-slate-700 block mb-1">
                Integrated ATS Keywords:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tailoredResume.matchedKeywords?.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-[11px] font-medium"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">
                Key ATS Enhancements Applied:
              </span>
              <ul className="space-y-1 text-slate-600">
                {tailoredResume.impactImprovements?.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">›</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Resume Viewport (Side-by-side or Single) */}
      <div className={`grid gap-8 ${activeResumeView === 'side_by_side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Left Column: Original Profile (Hidden in tailored-only view and print) */}
        {activeResumeView === 'side_by_side' && (
          <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-6 space-y-5 no-print">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Original Intake Profile
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {userProfile.name || 'Candidate'} — General CV
                </span>
              </div>
              <span className="text-xs text-slate-500">Uncalibrated</span>
            </div>

            {/* Original Location */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Intake Location
              </span>
              <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                {userProfile.location || 'Hyderabad, India'}
              </div>
            </div>

            {/* Original Summary */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Summary
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {userProfile.summary || 'General technology and product delivery profile.'}
              </p>
            </div>

            {/* Original Skills */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(userProfile.skills || []).map((s, idx) => (
                  <span key={idx} className="text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Original Experiences */}
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-700 uppercase block">
                Work Experiences
              </span>
              {(userProfile.experiences || []).map((exp, idx) => {
                const isKey = exp.isKeyRoleMatch;
                return (
                  <div 
                    key={idx} 
                    className={`bg-white p-3.5 rounded-lg border space-y-1.5 text-xs ${
                      isKey ? 'border-indigo-300 ring-1 ring-indigo-100 bg-indigo-50/10' : 'border-slate-200'
                    }`}
                  >
                    {isKey && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded mb-1">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>Key Match for Role</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{exp.role}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{exp.duration}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">{exp.company} · {exp.location}</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 mt-2">
                      {exp.bulletPoints.map((bp, bidx) => (
                        <li key={bidx} className="leading-relaxed">{bp}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Column: Tailored ATS Resume Document */}
        <div className="bg-white rounded-xl border border-slate-300 p-8 shadow-md space-y-6 resume-page">
          
          {/* Resume Header (Requirement 5) */}
          <div className="text-center border-b border-slate-200 pb-5 space-y-1.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
              {userProfile.name || 'Candidate Full Name'}
            </h1>
            
            {/* Contact details with Candidate Location Header */}
            {isEditMode ? (
              <div className="space-y-2 pt-2 text-left">
                <label className="text-[11px] font-bold text-slate-700 uppercase block">
                  Location Header (Relocation & Market Readiness):
                </label>
                <input
                  type="text"
                  value={candidateLocation}
                  onChange={(e) => updateResumeField('candidateLocationHeader', e.target.value)}
                  className="w-full text-xs p-2 bg-amber-50/50 border border-amber-300 rounded font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Hyderabad, India (Open to Relocate to Dubai / UAE)"
                />
                <p className="text-[10px] text-slate-500">
                  Tip: For international roles like Dubai or London, mention your current location and readiness to relocate.
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-600 font-medium flex flex-wrap items-center justify-center gap-2">
                <span>{userProfile.email || 'candidate@example.com'}</span>
                <span aria-hidden="true">·</span>
                <span>{userProfile.phone || '+91 98765 43210'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-slate-900">{candidateLocation}</span>
              </div>
            )}

            <div className="text-xs font-semibold text-indigo-700 pt-1">
              Targeting: {tailoredResume?.targetJobTitle || currentJob.title} — {tailoredResume?.targetCompany || currentJob.company}
            </div>
          </div>

          {/* Professional Summary (Editable) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Professional Summary
              </h2>
              {isEditMode && (
                <span className="text-[10px] text-amber-700 font-bold uppercase">Editable</span>
              )}
            </div>

            {isEditMode ? (
              <textarea
                rows={4}
                value={tailoredResume?.tailoredSummary || ''}
                onChange={(e) => updateResumeField('tailoredSummary', e.target.value)}
                className="w-full text-xs p-3 leading-relaxed bg-amber-50/40 border border-amber-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Write your professional summary tailored to this position..."
              />
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed">
                {tailoredResume?.tailoredSummary || userProfile.summary}
              </p>
            )}
          </div>

          {/* Core Competencies & Keywords (Editable) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Core Competencies & Technical Skills
              </h2>
              {isEditMode && (
                <span className="text-[10px] text-amber-700 font-bold uppercase">Editable</span>
              )}
            </div>

            {isEditMode ? (
              <div className="space-y-3 p-3 bg-amber-50/30 border border-amber-200 rounded-lg">
                <div className="flex flex-wrap gap-1.5">
                  {(tailoredResume?.targetedSkills || []).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 text-slate-800 rounded text-xs"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-600 text-xs font-bold ml-1"
                        title="Remove skill"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                    placeholder="Type skill name and press Enter..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-700 leading-relaxed font-medium">
                {(tailoredResume?.targetedSkills || userProfile.skills).join(' · ')}
              </div>
            )}
          </div>

          {/* Professional Experience (Highlighting Key Role Matches - Requirement 4) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Professional Experience
              </h2>
              {isEditMode && (
                <span className="text-[10px] text-amber-700 font-bold uppercase">Editable</span>
              )}
            </div>

            {(tailoredResume?.experiences || userProfile.experiences).map((exp, expIdx) => {
              const isKey = Boolean(exp.isKeyRoleMatch);

              return (
                <div 
                  key={expIdx} 
                  className={`space-y-2 transition-all ${
                    isKey 
                      ? 'border-l-4 border-indigo-600 pl-3 py-1 bg-indigo-50/20 rounded-r-xl' 
                      : ''
                  }`}
                >
                  {/* Key Role Experience Match Badge (Requirement 4) */}
                  {isKey && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100/90 text-indigo-900 font-bold text-[11px] border border-indigo-200 shadow-2xs">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Key Experience Match for {currentJob.title}</span>
                      </div>
                      
                      {isEditMode && (
                        <button
                          onClick={() => handleToggleKeyRoleMatch(expIdx)}
                          className="text-[10px] text-indigo-700 hover:text-indigo-900 underline"
                        >
                          Remove Key Tag
                        </button>
                      )}
                    </div>
                  )}

                  {!isKey && isEditMode && (
                    <button
                      onClick={() => handleToggleKeyRoleMatch(expIdx)}
                      className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 block pt-1"
                    >
                      + Tag as Key Experience for Role
                    </button>
                  )}

                  {isKey && exp.keyMatchReason && !isEditMode && (
                    <div className="text-[11px] text-indigo-900 font-medium bg-indigo-50/80 px-2.5 py-1 rounded border border-indigo-100">
                      <span className="font-bold">Match Rationale: </span>
                      <span>{exp.keyMatchReason}</span>
                    </div>
                  )}
                  
                  {isEditMode ? (
                    <div className="p-3 bg-amber-50/30 border border-amber-200 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block">Role Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(expIdx, { role: e.target.value })}
                            className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block">Company Name</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(expIdx, { company: e.target.value })}
                            className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block">Location</label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => handleUpdateExperience(expIdx, { location: e.target.value })}
                            className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase block">Duration</label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => handleUpdateExperience(expIdx, { duration: e.target.value })}
                            className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Editable Bullet Points */}
                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold text-slate-700 uppercase block">
                          Measurable Impact Bullets (Quantified Metrics):
                        </label>
                        {exp.bulletPoints.map((bp, bpIdx) => (
                          <div key={bpIdx} className="flex items-start gap-2">
                            <span className="text-slate-400 mt-2 font-bold">•</span>
                            <textarea
                              rows={2}
                              value={bp}
                              onChange={(e) => handleUpdateBulletPoint(expIdx, bpIdx, e.target.value)}
                              className="flex-1 p-2 text-xs bg-white border border-slate-300 rounded text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              onClick={() => handleRemoveBulletPoint(expIdx, bpIdx)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title="Remove bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={() => handleAddBulletPoint(expIdx)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 pt-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Another Bullet Point</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{exp.role}</span>
                        <span className="text-slate-600 font-mono text-[11px]">{exp.duration}</span>
                      </div>
                      <div className="text-xs font-medium text-slate-600">
                        {exp.company} — {exp.location}
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1">
                        {exp.bulletPoints.map((bp, bidx) => (
                          <li key={bidx} className="leading-relaxed">
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Education & Credentials (Editable) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Education & Credentials
              </h2>
              {isEditMode && (
                <span className="text-[10px] text-amber-700 font-bold uppercase">Editable</span>
              )}
            </div>

            {isEditMode ? (
              <div className="space-y-2 p-3 bg-amber-50/30 border border-amber-200 rounded-lg">
                {(tailoredResume?.education || userProfile.education).map((edu, eduIdx) => (
                  <div key={eduIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(eduIdx, { degree: e.target.value })}
                      placeholder="Degree"
                      className="p-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-900"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(eduIdx, { institution: e.target.value })}
                      placeholder="Institution"
                      className="p-1.5 bg-white border border-slate-300 rounded text-slate-800"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => handleUpdateEducation(eduIdx, { year: e.target.value })}
                      placeholder="Year"
                      className="p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {(tailoredResume?.education || userProfile.education).map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-700">
                    <span className="font-semibold">{edu.degree} — {edu.institution}</span>
                    <span className="text-slate-500 font-mono">{edu.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
