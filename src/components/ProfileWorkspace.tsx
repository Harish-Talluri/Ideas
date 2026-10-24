import React, { useState, useRef } from 'react';
import { UserProfile, LocationHub, RoleTrack, SeniorityLevel, UserExperience, UserEducation } from '../types';
import { LOCATION_HUBS } from '../data/mockData';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Layers, 
  TrendingUp,
  ArrowRight,
  Sliders,
  Settings,
  X,
  Edit3,
  Save,
  Plus,
  Trash2,
  FileCheck,
  Check,
  RotateCcw
} from 'lucide-react';

interface ProfileWorkspaceProps {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  selectedHub: LocationHub;
  setSelectedHub: (hub: LocationHub) => void;
  onContinueToJobs: () => void;
}

export const ProfileWorkspace: React.FC<ProfileWorkspaceProps> = ({
  userProfile,
  setUserProfile,
  selectedHub,
  setSelectedHub,
  onContinueToJobs
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccessMessage, setParseSuccessMessage] = useState<string | null>(null);
  const [uploadedFilesList, setUploadedFilesList] = useState<Array<{ name: string; size: string }>>([]);

  // Profile Edit Mode (Requirement 1)
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableProfile, setEditableProfile] = useState<UserProfile>(userProfile);
  const [editSuccessToast, setEditSuccessToast] = useState<string | null>(null);

  // Modals
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [rawTextPaste, setRawTextPaste] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  
  // Local preferences form state
  const [prefTrack, setPrefTrack] = useState<RoleTrack>(userProfile.targetRoleTrack || 'product');
  const [prefSeniority, setPrefSeniority] = useState<SeniorityLevel>(userProfile.targetSeniority || 'senior');
  const [prefLocations, setPrefLocations] = useState<LocationHub[]>(
    userProfile.targetLocations?.length ? userProfile.targetLocations : ['bangalore', 'dubai']
  );
  const [prefTitles, setPrefTitles] = useState<string[]>([]);
  const [prefSalary, setPrefSalary] = useState(userProfile.currentSalary || '');
  const [prefNotice, setPrefNotice] = useState(userProfile.noticePeriod || '30 Days');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hubConfig = LOCATION_HUBS[selectedHub];

  const hasUploadedProfile = Boolean(userProfile.name && userProfile.name.trim().length > 0);

  // Sync editable profile when userProfile changes externally
  React.useEffect(() => {
    setEditableProfile(userProfile);
  }, [userProfile]);

  // Handle Multi-Document Upload (PDF, DOCX, TXT) (Requirement 2)
  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsParsing(true);
    setParseError(null);
    setParseSuccessMessage(null);

    const filesArray = Array.from(fileList);
    setUploadedFilesList(
      filesArray.map((f) => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB'
      }))
    );

    try {
      // Read all files as base64
      const filePayloads = await Promise.all(
        filesArray.map((file) => {
          return new Promise<{ name: string; mimeType: string; data: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64Content = (reader.result as string).split(',')[1];
              resolve({
                name: file.name,
                mimeType: file.type || 'application/octet-stream',
                data: base64Content
              });
            };
            reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
            reader.readAsDataURL(file);
          });
        })
      );

      const res = await fetch('/api/career/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: filePayloads
        })
      });

      const data = await res.json();
      if (data.success && data.profile) {
        applyParsedProfile(data.profile);
        setParseSuccessMessage(
          `Synthesized ${filesArray.length} document${filesArray.length > 1 ? 's' : ''} successfully with redundancy eliminated!`
        );
      } else {
        setParseError(data.error || 'Failed to parse uploaded documents');
      }
    } catch (err: any) {
      setParseError(err.message || 'Error processing uploaded documents');
    } finally {
      setIsParsing(false);
    }
  };

  // Parse Raw Text Resume
  const parseResumeFromText = async (text: string) => {
    setIsParsing(true);
    setParseError(null);
    try {
      const res = await fetch('/api/career/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text })
      });
      const data = await res.json();
      if (data.success && data.profile) {
        applyParsedProfile(data.profile);
        setPasteModalOpen(false);
        setRawTextPaste('');
      } else {
        setParseError(data.error || 'Failed to parse resume text');
      }
    } catch (err: any) {
      setParseError(err.message || 'Error parsing resume text');
    } finally {
      setIsParsing(false);
    }
  };

  // Apply parsed profile & open preferences dialog
  const applyParsedProfile = (parsed: any) => {
    const updated: UserProfile = {
      ...userProfile,
      id: `usr_${Date.now()}`,
      name: parsed.name || 'Job Aspirant',
      email: parsed.email || userProfile.email,
      phone: parsed.phone || userProfile.phone,
      headline: parsed.headline || 'Technology & Product Professional',
      location: parsed.location || userProfile.location || 'Hyderabad, India',
      summary: parsed.summary || userProfile.summary,
      skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : userProfile.skills,
      experiences: Array.isArray(parsed.experiences) && parsed.experiences.length > 0 ? parsed.experiences : userProfile.experiences,
      education: Array.isArray(parsed.education) && parsed.education.length > 0 ? parsed.education : userProfile.education
    };

    // Infer best initial role track from headline or skills
    const textLower = `${parsed.headline || ''} ${parsed.summary || ''} ${(parsed.skills || []).join(' ')}`.toLowerCase();
    if (textLower.includes('product') || textLower.includes('pm') || textLower.includes('scrum')) {
      updated.targetRoleTrack = 'product';
      setPrefTrack('product');
    } else if (textLower.includes('data') || textLower.includes('machine learning') || textLower.includes('ai') || textLower.includes('llm')) {
      updated.targetRoleTrack = 'data_ai';
      setPrefTrack('data_ai');
    } else {
      updated.targetRoleTrack = 'engineering';
      setPrefTrack('engineering');
    }

    setUserProfile(updated);
    setEditableProfile(updated);
    setPreferencesModalOpen(true);
  };

  // Save Modified Profile (Requirement 1)
  const handleSaveProfileModifications = () => {
    setUserProfile(editableProfile);
    setIsEditMode(false);
    setEditSuccessToast('Profile changes saved successfully!');
    setTimeout(() => setEditSuccessToast(null), 3000);
  };

  // Add / Remove Skill in Edit Mode
  const handleAddSkillToProfile = (skillText: string) => {
    const trimmed = skillText.trim();
    if (trimmed && !editableProfile.skills.includes(trimmed)) {
      setEditableProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
      setNewSkillInput('');
    }
  };

  const handleRemoveSkillFromProfile = (skillToRemove: string) => {
    setEditableProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  // Experience Editing in Profile
  const handleUpdateExperience = (idx: number, patch: Partial<UserExperience>) => {
    setEditableProfile((prev) => {
      const exps = [...prev.experiences];
      exps[idx] = { ...exps[idx], ...patch };
      return { ...prev, experiences: exps };
    });
  };

  const handleUpdateBullet = (expIdx: number, bulletIdx: number, text: string) => {
    setEditableProfile((prev) => {
      const exps = [...prev.experiences];
      const bullets = [...exps[expIdx].bulletPoints];
      bullets[bulletIdx] = text;
      exps[expIdx] = { ...exps[expIdx], bulletPoints: bullets };
      return { ...prev, experiences: exps };
    });
  };

  const handleAddBullet = (expIdx: number) => {
    setEditableProfile((prev) => {
      const exps = [...prev.experiences];
      exps[expIdx] = {
        ...exps[expIdx],
        bulletPoints: [...exps[expIdx].bulletPoints, 'Delivered measurable outcome increasing operational efficiency and scale.']
      };
      return { ...prev, experiences: exps };
    });
  };

  const handleRemoveBullet = (expIdx: number, bulletIdx: number) => {
    setEditableProfile((prev) => {
      const exps = [...prev.experiences];
      exps[expIdx] = {
        ...exps[expIdx],
        bulletPoints: exps[expIdx].bulletPoints.filter((_, i) => i !== bulletIdx)
      };
      return { ...prev, experiences: exps };
    });
  };

  const handleAddExperience = () => {
    const newExp: UserExperience = {
      company: 'New Enterprise / Organization',
      role: 'Senior Role Title',
      duration: '2022 – Present',
      location: 'Hyderabad, India',
      bulletPoints: ['Spearheaded cross-functional delivery delivering measurable business outcomes.']
    };
    setEditableProfile((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences]
    }));
  };

  const handleRemoveExperience = (expIdx: number) => {
    setEditableProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== expIdx)
    }));
  };

  // Education Editing
  const handleUpdateEducation = (idx: number, patch: Partial<UserEducation>) => {
    setEditableProfile((prev) => {
      const edus = [...prev.education];
      edus[idx] = { ...edus[idx], ...patch };
      return { ...prev, education: edus };
    });
  };

  const handleAddEducation = () => {
    setEditableProfile((prev) => ({
      ...prev,
      education: [...prev.education, { degree: 'Degree / Specialization', institution: 'University / Institute', year: '2020' }]
    }));
  };

  const handleRemoveEducation = (eduIdx: number) => {
    setEditableProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== eduIdx)
    }));
  };

  // Toggle Location in Preferences
  const handleTogglePrefLocation = (hubKey: LocationHub) => {
    setPrefLocations((prev) => {
      const exists = prev.includes(hubKey);
      if (exists) {
        return prev.length > 1 ? prev.filter((h) => h !== hubKey) : prev;
      }
      return [...prev, hubKey];
    });
  };

  // Save Preferences & Continue
  const handleSavePreferences = () => {
    const updated = {
      ...userProfile,
      targetRoleTrack: prefTrack,
      targetSeniority: prefSeniority,
      targetLocations: prefLocations,
      currentSalary: prefSalary || userProfile.currentSalary,
      noticePeriod: prefNotice || userProfile.noticePeriod
    };
    setUserProfile(updated);
    setEditableProfile(updated);

    if (prefLocations.length > 0) {
      setSelectedHub(prefLocations[0]);
    }

    setPreferencesModalOpen(false);
    onContinueToJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Alert */}
      {editSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{editSuccessToast}</span>
        </div>
      )}

      {/* Zero-State: When user has not uploaded a resume yet */}
      {!hasUploadedProfile ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-xs">
            <Upload className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Upload Your Resume to Discover Matching Jobs
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Upload one or more resumes, project sheets, or portfolios in PDF or Word (DOCX). Our AI unifies all documents and eliminates redundancy into a cohesive profile.
            </p>
          </div>

          {/* Upload Dropzone (Multi-Document Support) */}
          <div className="p-8 border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/60 rounded-xl space-y-4 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMultiFileUpload}
              accept=".pdf,.docx,.doc,.txt"
              multiple
              className="hidden"
            />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">
                Drag and drop one or more files here (PDF, Word DOCX, or TXT)
              </p>
              <p className="text-[11px] text-slate-400">
                You can select multiple files at once. Redundant roles and skills will be automatically synthesized and deduplicated.
              </p>
            </div>

            {uploadedFilesList.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {uploadedFilesList.map((f, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{f.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({f.size})</span>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-60"
              >
                <Upload className="w-4 h-4" />
                <span>{isParsing ? 'Synthesizing & Deduplicating Documents...' : 'Select Files (Upload Multiple)'}</span>
              </button>

              <button
                onClick={() => setPasteModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Paste Text Instead</span>
              </button>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-left">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-900 block">Multi-Doc Synthesis</span>
              <span className="text-[11px] text-slate-500 block">Combines multiple CVs & technical portfolios without redundancy.</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-900 block">Full Profile Editing</span>
              <span className="text-[11px] text-slate-500 block">Modify, refine, and save your parsed profile anytime.</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-900 block">Market Calibration</span>
              <span className="text-[11px] text-slate-500 block">Calibrated for Bangalore, Hyderabad, Dubai, London & Remote.</span>
            </div>
          </div>

          {parseError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{parseError}</span>
            </div>
          )}
        </div>
      ) : (
        /* Populated Profile View (Once Uploaded / Parsed) */
        <>
          {/* Top Status & Controls Banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resume Extracted & Synthesized</span>
                  <span aria-hidden="true">·</span>
                  <span>Personal Profile Active</span>
                </div>
                
                {isEditMode ? (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      value={editableProfile.name}
                      onChange={(e) => setEditableProfile({ ...editableProfile, name: e.target.value })}
                      placeholder="Your Full Name"
                      className="text-xl font-bold text-slate-900 border-b border-indigo-400 focus:outline-none focus:border-indigo-600 bg-transparent w-full"
                    />
                    <input
                      type="text"
                      value={editableProfile.headline}
                      onChange={(e) => setEditableProfile({ ...editableProfile, headline: e.target.value })}
                      placeholder="Professional Headline"
                      className="text-xs font-medium text-slate-700 border-b border-slate-300 focus:outline-none focus:border-indigo-600 bg-transparent w-full"
                    />
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <input
                        type="text"
                        value={editableProfile.location}
                        onChange={(e) => setEditableProfile({ ...editableProfile, location: e.target.value })}
                        placeholder="Current Location (e.g. Hyderabad, India)"
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                      />
                      <input
                        type="email"
                        value={editableProfile.email}
                        onChange={(e) => setEditableProfile({ ...editableProfile, email: e.target.value })}
                        placeholder="Email Address"
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                      />
                      <input
                        type="tel"
                        value={editableProfile.phone}
                        onChange={(e) => setEditableProfile({ ...editableProfile, phone: e.target.value })}
                        placeholder="Phone Number"
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {userProfile.name}
                    </h1>
                    <p className="text-xs text-slate-600 font-medium">
                      {userProfile.headline} · {userProfile.location || 'Hyderabad, India'} · {userProfile.email} · {userProfile.phone}
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons: Edit/Save Profile, Preferences, Re-upload, Explore */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Edit / Save Toggle (Requirement 1) */}
                {isEditMode ? (
                  <button
                    onClick={handleSaveProfileModifications}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditableProfile(userProfile);
                      setIsEditMode(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-bold transition-colors border border-slate-300 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Edit Profile</span>
                  </button>
                )}

                <button
                  onClick={() => setPreferencesModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors border border-indigo-200"
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Job Preferences</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMultiFileUpload}
                  accept=".pdf,.docx,.doc,.txt"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isParsing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isParsing ? 'Parsing...' : 'Upload More Docs'}</span>
                </button>

                <button
                  onClick={onContinueToJobs}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  <span>Explore Matched Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Preference Summary Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Target Track:</span>
                <span className="text-indigo-700 font-bold uppercase">{userProfile.targetRoleTrack}</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Target Hubs:</span>
                <span className="font-medium text-slate-800">
                  {userProfile.targetLocations.map((l) => LOCATION_HUBS[l]?.name || l).join(', ')}
                </span>
              </div>
              {userProfile.noticePeriod && (
                <>
                  <span aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Notice:</span>
                    <span>{userProfile.noticePeriod}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Profile Details & Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Summary, Skills & Work Experience */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Executive Summary (Editable) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Executive Profile Summary</span>
                  </h2>
                  {isEditMode && <span className="text-[10px] font-bold text-amber-600 uppercase">Editable</span>}
                </div>
                {isEditMode ? (
                  <textarea
                    rows={4}
                    value={editableProfile.summary}
                    onChange={(e) => setEditableProfile({ ...editableProfile, summary: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-amber-50/40 border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    placeholder="Write or edit your executive profile summary..."
                  />
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    {userProfile.summary || 'Accomplished professional with proven background in delivery, scale, and strategic execution.'}
                  </p>
                )}
              </div>

              {/* Core Competencies & Skills (Editable) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Extracted Core Competencies ({(isEditMode ? editableProfile : userProfile).skills.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Keywords matched against real-world tech job requirements.
                    </p>
                  </div>
                  {isEditMode && <span className="text-[10px] font-bold text-amber-600 uppercase">Editable</span>}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(isEditMode ? editableProfile : userProfile).skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-md transition-colors"
                    >
                      <span>{skill}</span>
                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveSkillFromProfile(skill)}
                          className="text-slate-400 hover:text-red-600 ml-0.5 text-xs font-bold"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditMode && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add a new skill and press Enter..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkillToProfile(newSkillInput))}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleAddSkillToProfile(newSkillInput)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                    >
                      + Add
                    </button>
                  </div>
                )}
              </div>

              {/* Work Experience History (Editable) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Work Experience & Accomplishments</span>
                  </h2>
                  {isEditMode && (
                    <button
                      onClick={handleAddExperience}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Position</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {(isEditMode ? editableProfile : userProfile).experiences.map((exp, expIdx) => (
                    <div key={expIdx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
                      
                      {isEditMode ? (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs flex-1">
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => handleUpdateExperience(expIdx, { role: e.target.value })}
                                placeholder="Role Title"
                                className="p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-900 text-xs"
                              />
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleUpdateExperience(expIdx, { company: e.target.value })}
                                placeholder="Company"
                                className="p-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                              />
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => handleUpdateExperience(expIdx, { duration: e.target.value })}
                                placeholder="Duration (e.g. 2021 – Present)"
                                className="p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-800 text-xs"
                              />
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => handleUpdateExperience(expIdx, { location: e.target.value })}
                                placeholder="Location (e.g. Hyderabad, India)"
                                className="p-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveExperience(expIdx)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                              title="Delete position"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Editable Bullet Points */}
                          <div className="space-y-2 pt-2 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-slate-700 uppercase block">Impact Bullets:</span>
                            {exp.bulletPoints.map((bp, bpIdx) => (
                              <div key={bpIdx} className="flex items-start gap-2">
                                <span className="text-slate-400 mt-2 text-xs font-bold">•</span>
                                <textarea
                                  rows={2}
                                  value={bp}
                                  onChange={(e) => handleUpdateBullet(expIdx, bpIdx, e.target.value)}
                                  className="flex-1 p-2 text-xs bg-white border border-slate-300 rounded text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <button
                                  onClick={() => handleRemoveBullet(expIdx, bpIdx)}
                                  className="p-1 text-slate-400 hover:text-red-600"
                                  title="Delete bullet"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => handleAddBullet(expIdx)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Bullet Point</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                            <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                            <span className="text-slate-500 font-mono text-[11px]">{exp.duration}</span>
                          </div>
                          <div className="text-xs font-medium text-indigo-600 flex items-center gap-2 mt-0.5">
                            <span>{exp.company}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-500">{exp.location}</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 mt-2.5">
                            {exp.bulletPoints.map((bp, bidx) => (
                              <li key={bidx} className="leading-relaxed">
                                {bp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* Education (Editable) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>Education & Qualifications</span>
                  </h2>
                  {isEditMode && (
                    <button
                      onClick={handleAddEducation}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Degree</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {(isEditMode ? editableProfile : userProfile).education.map((edu, eduIdx) => (
                    <div key={eduIdx} className="flex items-center justify-between text-xs p-3 rounded-lg bg-slate-50 border border-slate-200">
                      {isEditMode ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(eduIdx, { degree: e.target.value })}
                            placeholder="Degree"
                            className="p-1 bg-white border border-slate-300 rounded font-semibold text-slate-900"
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleUpdateEducation(eduIdx, { institution: e.target.value })}
                            placeholder="Institution"
                            className="p-1 bg-white border border-slate-300 rounded text-slate-800"
                          />
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => handleUpdateEducation(eduIdx, { year: e.target.value })}
                            placeholder="Year"
                            className="p-1 bg-white border border-slate-300 rounded font-mono text-slate-800"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <span className="font-bold text-slate-900">{edu.degree}</span>
                          <span className="text-slate-500 block">{edu.institution} ({edu.year})</span>
                        </div>
                      )}

                      {isEditMode && (
                        <button
                          onClick={() => handleRemoveEducation(eduIdx)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete education"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 1 Col: Market Calibration & Quick Actions */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Primary Target Market</h2>
                </div>
                
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value as LocationHub)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 outline-none cursor-pointer"
                >
                  <option value="bangalore">Bangalore / Bengaluru (INR ₹)</option>
                  <option value="hyderabad">Hyderabad (INR ₹)</option>
                  <option value="dubai">Dubai & UAE (AED)</option>
                  <option value="london">London & UK (£)</option>
                  <option value="us_remote">US & Global Remote ($)</option>
                </select>

                <div className="space-y-3 pt-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] uppercase">Compensation Norm:</span>
                    <p className="mt-0.5">{hubConfig.compStructure}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px] uppercase">Hiring Focus:</span>
                    <p className="mt-0.5">{hubConfig.hiringCulture}</p>
                  </div>
                </div>

                <button
                  onClick={onContinueToJobs}
                  className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Explore Matched Openings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Uploaded Documents List */}
              {uploadedFilesList.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider block">
                    Synthesized Documents ({uploadedFilesList.length})
                  </span>
                  <div className="space-y-1.5">
                    {uploadedFilesList.map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="font-medium text-slate-800 truncate max-w-[180px]">{f.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{f.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </>
      )}

      {/* OPTIONAL PREFERENCES MODAL */}
      {preferencesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
                  <span>Optional Step</span>
                  <span aria-hidden="true">·</span>
                  <span>Tailor Job Recommendations</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Specify Your Job Preferences
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tell us what kind of roles you are targeting. These are completely optional — save them or skip directly to explore all matched opportunities.
                </p>
              </div>
              <button
                onClick={() => setPreferencesModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Track & Hierarchical Titles */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Target Role Family
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPrefTrack('product')}
                  className={`p-2.5 text-xs font-bold rounded-lg border text-center transition-all ${
                    prefTrack === 'product'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  Product Management
                </button>

                <button
                  type="button"
                  onClick={() => setPrefTrack('engineering')}
                  className={`p-2.5 text-xs font-bold rounded-lg border text-center transition-all ${
                    prefTrack === 'engineering'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  Software Engineering
                </button>

                <button
                  type="button"
                  onClick={() => setPrefTrack('data_ai')}
                  className={`p-2.5 text-xs font-bold rounded-lg border text-center transition-all ${
                    prefTrack === 'data_ai'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-1 ring-indigo-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  Data Science & AI
                </button>
              </div>
            </div>

            {/* Target Seniority Tier */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Target Seniority Level
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
                {(['mid', 'senior', 'lead', 'staff', 'principal'] as SeniorityLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPrefSeniority(level)}
                    className={`py-2 px-2 rounded-lg font-bold border capitalize transition-all ${
                      prefSeniority === level
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Hubs Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Preferred Locations & Hubs (Select Multiple)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['bangalore', 'hyderabad', 'dubai', 'london', 'us_remote'] as LocationHub[]).map((hubKey) => {
                  const hub = LOCATION_HUBS[hubKey];
                  const selected = prefLocations.includes(hubKey);
                  return (
                    <button
                      key={hubKey}
                      type="button"
                      onClick={() => handleTogglePrefLocation(hubKey)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between text-left transition-all ${
                        selected
                          ? 'bg-indigo-50/70 border-indigo-600 text-indigo-900 ring-1 ring-indigo-500'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{hub.name}</div>
                        <div className="text-[10px] text-slate-500">{hub.currency} currency norm</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        selected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300'
                      }`}>
                        {selected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Notice & Salary Expectations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Target / Current Salary Range:
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹50L Fixed or AED 45,000"
                  value={prefSalary}
                  onChange={(e) => setPrefSalary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Notice Period / Availability:
                </label>
                <select
                  value={prefNotice}
                  onChange={(e) => setPrefNotice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Immediate Joiner / Serving Notice">Immediate Joiner / Serving Notice</option>
                  <option value="15 Days Notice">15 Days Notice</option>
                  <option value="30 Days Notice">30 Days Notice</option>
                  <option value="60 Days (Negotiable Buyout)">60 Days (Negotiable Buyout)</option>
                  <option value="90 Days Standard">90 Days Standard</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setPreferencesModalOpen(false);
                  onContinueToJobs();
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Skip for Now
              </button>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Save Preferences & View Jobs →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Raw Text Paste Modal */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Paste Your Resume Text
              </h3>
              <button
                onClick={() => setPasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <textarea
              rows={10}
              value={rawTextPaste}
              onChange={(e) => setRawTextPaste(e.target.value)}
              placeholder="Paste your resume or CV text here..."
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPasteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => parseResumeFromText(rawTextPaste)}
                disabled={!rawTextPaste.trim() || isParsing}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
              >
                {isParsing ? 'Parsing...' : 'Parse Resume'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
