import React, { useState } from 'react';
import { InterviewQuestion, LocationHub, RoleTrack, JobOpportunity } from '../types';
import { INTERVIEW_QUESTIONS, LOCATION_HUBS, CURATED_JOBS } from '../data/mockData';
import { 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  MapPin, 
  Briefcase, 
  Send, 
  RefreshCw, 
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';

interface InterviewCoachProps {
  selectedHub: LocationHub;
  selectedRoleTrack: RoleTrack;
  activeJob: JobOpportunity | null;
}

export const InterviewCoach: React.FC<InterviewCoachProps> = ({
  selectedHub,
  selectedRoleTrack,
  activeJob
}) => {
  const currentRoleTrack = selectedRoleTrack === 'all' ? 'product' : selectedRoleTrack;
  const questionsList = INTERVIEW_QUESTIONS[currentRoleTrack] || INTERVIEW_QUESTIONS['product'];

  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion>(questionsList[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'practice' | 'star_sample'>('practice');

  const hubConfig = LOCATION_HUBS[selectedHub];
  const targetJob = activeJob || CURATED_JOBS[0];

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/career/interview-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion.question,
          userAnswer,
          targetJob,
          locationHub: selectedHub
        })
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluationResult(data.evaluation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              <span>Step 4: Interview Simulation</span>
              <span aria-hidden="true">·</span>
              <span>STAR Rubrics & Bar-Raiser Feedback</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Interactive Interview Prep & Regional Coaching
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Master behavioral and technical loops calibrated for hiring committees in {hubConfig.name}.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-800">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target: {targetJob.title}</span>
          </div>
        </div>

        {/* Regional Interview Focus Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-bold">{hubConfig.name} Interview Expectation:</span>
          </div>
          <span className="text-slate-600">{hubConfig.hiringCulture}</span>
        </div>
      </div>

      {/* Main Grid: Question List on Left, Practice Pad on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Question Bank */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Target Question Bank ({questionsList.length})
            </h2>
            <span className="text-xs text-indigo-600 font-semibold uppercase">
              {currentRoleTrack} Track
            </span>
          </div>

          <div className="space-y-3">
            {questionsList.map((q) => {
              const isSelected = selectedQuestion.id === q.id;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q);
                    setUserAnswer('');
                    setEvaluationResult(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all space-y-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-600">
                      {q.category.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400">STAR</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {q.question}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Regional Tips Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cultural Tip for {hubConfig.name}</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              {selectedQuestion.regionalTip}
            </p>
          </div>
        </div>

        {/* Right 2 Cols: Practice & AI Feedback Arena */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Question Spotlight */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Active Question
              </span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`px-3 py-1 rounded font-medium ${
                    activeTab === 'practice' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Your Answer
                </button>
                <button
                  onClick={() => setActiveTab('star_sample')}
                  className={`px-3 py-1 rounded font-medium ${
                    activeTab === 'star_sample' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Model STAR Framework
                </button>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
              "{selectedQuestion.question}"
            </h2>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800">What the panel is evaluating: </span>
              <span>{selectedQuestion.contextWhy}</span>
            </div>

            {/* Sub-View: Model STAR Sample */}
            {activeTab === 'star_sample' && (
              <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs">
                <span className="font-bold text-indigo-950 block uppercase tracking-wider text-[11px]">
                  Master STAR Breakdown (Situation, Task, Action, Result)
                </span>
                <div className="space-y-2 text-slate-700">
                  <div>
                    <span className="font-bold text-indigo-900">Situation: </span>
                    {selectedQuestion.sampleSTAR.situation}
                  </div>
                  <div>
                    <span className="font-bold text-indigo-900">Task: </span>
                    {selectedQuestion.sampleSTAR.task}
                  </div>
                  <div>
                    <span className="font-bold text-indigo-900">Action: </span>
                    {selectedQuestion.sampleSTAR.action}
                  </div>
                  <div>
                    <span className="font-bold text-indigo-900">Result: </span>
                    {selectedQuestion.sampleSTAR.result}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-View: User Practice Area */}
            {activeTab === 'practice' && (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Outline your response using the STAR framework: Situation, Task, Action, and quantifiable Result..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Aim for concrete numbers (e.g. latency, revenue, conversion %, team size).
                  </span>
                  <button
                    onClick={handleEvaluate}
                    disabled={!userAnswer.trim() || isEvaluating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEvaluating ? 'Evaluating with AI...' : 'Submit for Bar-Raiser Feedback'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Feedback & Critique Card */}
          {evaluationResult && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Hiring Committee AI Critique
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">STAR Score:</span>
                  <span className="text-base font-bold text-emerald-700 font-mono bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                    {evaluationResult.score}/100
                  </span>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Key Strengths</span>
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {evaluationResult.strengths?.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">›</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-amber-800 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Recommended Enhancements</span>
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {evaluationResult.improvements?.map((imp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">›</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Polished Master Version */}
              {evaluationResult.refinedVersion && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
                    Master-Level Refined Delivery:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-mono bg-white p-3 rounded border border-slate-200/80">
                    "{evaluationResult.refinedVersion}"
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
