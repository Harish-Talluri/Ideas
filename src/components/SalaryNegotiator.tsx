import React, { useState } from 'react';
import { LocationHub, RoleTrack, UserProfile, JobOpportunity, NegotiationChatMessage } from '../types';
import { SALARY_BENCHMARKS, LOCATION_HUBS, CURATED_JOBS } from '../data/mockData';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Copy, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Sparkles, 
  MapPin, 
  Briefcase,
  Sliders,
  HelpCircle
} from 'lucide-react';

interface SalaryNegotiatorProps {
  userProfile: UserProfile;
  selectedHub: LocationHub;
  selectedRoleTrack: RoleTrack;
  activeJob: JobOpportunity | null;
}

export const SalaryNegotiator: React.FC<SalaryNegotiatorProps> = ({
  userProfile,
  selectedHub,
  selectedRoleTrack,
  activeJob
}) => {
  const currentRoleTrack = selectedRoleTrack === 'all' ? 'product' : selectedRoleTrack;
  const benchmarkKey = `${currentRoleTrack}_senior_${selectedHub}` in SALARY_BENCHMARKS
    ? `${currentRoleTrack}_senior_${selectedHub}`
    : `${currentRoleTrack}_staff_${selectedHub}` in SALARY_BENCHMARKS
    ? `${currentRoleTrack}_staff_${selectedHub}`
    : 'product_senior_dubai';

  const benchmark = SALARY_BENCHMARKS[benchmarkKey] || SALARY_BENCHMARKS['product_senior_dubai'];
  const hubConfig = LOCATION_HUBS[selectedHub];
  const targetJob = activeJob || CURATED_JOBS[0];

  const [counterScript, setCounterScript] = useState(benchmark.counterOfferScript);
  const [leverageType, setLeverageType] = useState<'competing_offer' | 'high_impact' | 'relocation'>('high_impact');
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Chat Simulator State
  const [chatMessages, setChatMessages] = useState<NegotiationChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'recruiter',
      text: `Hello ${userProfile.name || 'there'}! The team is excited to extend an offer for ${targetJob.title} in our ${hubConfig.name} office. We are offering an initial package around ${benchmark.p50} ${benchmark.currency}. How does that align with your expectations?`,
      timestamp: 'Just now',
      feedback: `The recruiter opened with a median benchmark (${benchmark.p50}). Respond professionally with your target range anchored around ${benchmark.p75}–${benchmark.p90}.`
    }
  ]);
  const [userInputMessage, setUserInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Handle Leverage Selection
  const handleSelectLeverage = (type: 'competing_offer' | 'high_impact' | 'relocation') => {
    setLeverageType(type);
    if (type === 'competing_offer') {
      setCounterScript(
        `Thank you for extending the offer for ${targetJob.title}. I am currently in final stages with another company discussing a total package of ${benchmark.p90} ${benchmark.currency}. Because ${targetJob.company} is my preferred choice due to your product mission, if we can reach ${benchmark.p75} ${benchmark.currency} with standard relocation support, I would be thrilled to sign immediately.`
      );
    } else if (type === 'relocation') {
      setCounterScript(
        `Thank you for this exciting offer. Moving to ${hubConfig.name} involves transitional costs including housing deposits and relocation airfare. To make this move seamless for my family, I would like to request an initial monthly package of ${benchmark.p75} ${benchmark.currency} along with 30 days of temporary company accommodation upon arrival.`
      );
    } else {
      setCounterScript(benchmark.counterOfferScript);
    }
  };

  // Send message in simulator
  const handleSendMessage = async () => {
    if (!userInputMessage.trim()) return;

    const userMsg: NegotiationChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userInputMessage,
      timestamp: 'Just now'
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setUserInputMessage('');
    setIsSendingMessage(true);

    try {
      const res = await fetch('/api/career/negotiate-comp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInputMessage,
          history: newHistory,
          targetJob,
          locationHub: selectedHub,
          candidateTargetSalary: `${benchmark.p75} ${benchmark.currency}`
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const recruiterMsg: NegotiationChatMessage = {
          id: `rec_${Date.now()}`,
          sender: 'recruiter',
          text: data.reply,
          timestamp: 'Just now',
          feedback: data.coachTip
        };
        setChatMessages((prev) => [...prev, recruiterMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`${label} copied!`);
    setTimeout(() => setCopyToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-lg flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>Step 5: Compensation Strategy</span>
              <span aria-hidden="true">·</span>
              <span>Regional Benchmarks & Roleplay</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Salary Negotiation Radar & Regional Benchmarks
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Understand market percentiles and practice negotiations calibrated for compensation laws in {hubConfig.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-900">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Currency: {hubConfig.currency} ({hubConfig.currencySymbol})</span>
          </div>
        </div>

        {/* Regional Tax / Law context */}
        <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{benchmark.taxAndBenefitsSummary}</span>
        </div>
      </div>

      {/* Percentiles & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Benchmark Percentiles & Structure */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Percentile Cards */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {benchmark.roleTitle} Market Compensation Bands
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {hubConfig.name} Tech Sector
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  25th Percentile
                </span>
                <span className="text-sm sm:text-base font-bold font-mono text-slate-800">
                  {benchmark.p25}
                </span>
                <span className="text-[10px] text-slate-400 block">Entry Senior</span>
              </div>

              <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  50th Percentile (Median)
                </span>
                <span className="text-sm sm:text-base font-bold font-mono text-indigo-950">
                  {benchmark.p50}
                </span>
                <span className="text-[10px] text-indigo-600 block">Market Average</span>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  75th Percentile
                </span>
                <span className="text-sm sm:text-base font-bold font-mono text-emerald-950">
                  {benchmark.p75}
                </span>
                <span className="text-[10px] text-emerald-600 block">Top Tier Product</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 text-white text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  90th Percentile
                </span>
                <span className="text-sm sm:text-base font-bold font-mono text-amber-400">
                  {benchmark.p90}
                </span>
                <span className="text-[10px] text-slate-400 block">Unicorn / Elite</span>
              </div>
            </div>

            {/* Compensation Package Composition */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Regional Package Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">Fixed / Base:</span>
                  <span className="text-slate-600 leading-snug">{benchmark.compBreakdown.fixedOrBase}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">Variable / Bonus:</span>
                  <span className="text-slate-600 leading-snug">{benchmark.compBreakdown.variableOrBonus}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">Equity & Allowances:</span>
                  <span className="text-slate-600 leading-snug">{benchmark.compBreakdown.equityOrAllowances}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Counter-Offer Script Generator */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Counter-Offer Script Generator
                </h2>
                <p className="text-xs text-slate-500">
                  Tailor your written response based on your primary strategic leverage.
                </p>
              </div>

              {/* Leverage Pills */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => handleSelectLeverage('high_impact')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    leverageType === 'high_impact' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Skill & Scale
                </button>
                <button
                  onClick={() => handleSelectLeverage('competing_offer')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    leverageType === 'competing_offer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Competing Offer
                </button>
                <button
                  onClick={() => handleSelectLeverage('relocation')}
                  className={`px-2.5 py-1 rounded font-medium ${
                    leverageType === 'relocation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Relocation
                </button>
              </div>
            </div>

            {/* Generated Script Box */}
            <div className="space-y-2">
              <textarea
                rows={4}
                value={counterScript}
                onChange={(e) => setCounterScript(e.target.value)}
                className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => copyToClipboard(counterScript, 'Counter-Offer Script')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script</span>
                </button>
              </div>
            </div>

            {/* Regional Negotiation Tips */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Regional Leverage Tactics for {hubConfig.name}:
              </span>
              <ul className="space-y-1 text-xs text-slate-600">
                {benchmark.regionalNegotiationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 font-bold">›</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Interactive AI Negotiation Roleplay Simulator */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-[650px] space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Offer Roleplay Simulator</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Practice real-time back-and-forth negotiation with an AI recruiter.
            </p>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <span>{msg.sender === 'user' ? 'You (Candidate)' : 'Hiring Director'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[90%] p-3 rounded-lg text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* AI Coach Tactical Tip */}
                {msg.feedback && (
                  <div className="max-w-[90%] p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 mt-1">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Tactical Coach Advice:
                    </span>
                    <span className="block mt-0.5">{msg.feedback}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your counter or question to the recruiter..."
                value={userInputMessage}
                onChange={(e) => setUserInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSendMessage())}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInputMessage.trim() || isSendingMessage}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Responses are dynamically simulated by Gemini 3.8 Flash based on {hubConfig.name} market standards.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
