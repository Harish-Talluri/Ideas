import React from 'react';
import { LocationHub, RoleTrack } from '../types';
import { LOCATION_HUBS } from '../data/mockData';
import { Briefcase, MapPin, Sparkles, FileText, MessageSquare, DollarSign, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: 'profile' | 'jobs' | 'external_jd' | 'ats_tailor' | 'interview' | 'salary';
  setActiveTab: (tab: 'profile' | 'jobs' | 'external_jd' | 'ats_tailor' | 'interview' | 'salary') => void;
  selectedHub: LocationHub;
  setSelectedHub: (hub: LocationHub) => void;
  selectedRoleTrack: RoleTrack;
  setSelectedRoleTrack: (track: RoleTrack) => void;
  onOpenExternalJd: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedHub,
  setSelectedHub,
  selectedRoleTrack,
  setSelectedRoleTrack,
  onOpenExternalJd
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Primary Top Bar Contract: Brand - Nav Links - Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
              CP
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                CareerPath AI
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Regional Career Command Center</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean text, no pill islands) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('profile')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'profile' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              Profile & Intake
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'jobs' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              Job Matches
            </button>
            <button
              onClick={() => setActiveTab('external_jd')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'external_jd' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              Analyze External JD
            </button>
            <button
              onClick={() => setActiveTab('ats_tailor')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'ats_tailor' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              ATS Resume Studio
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'interview' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              Interview Prep
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'salary' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              Comp & Negotiation
            </button>
          </nav>

          {/* Zone 3: Regional Hub Switcher & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Regional Hub selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <select
                aria-label="Target Tech Hub"
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value as LocationHub)}
                className="bg-transparent font-medium text-slate-800 outline-none cursor-pointer pr-1"
              >
                <option value="bangalore">Bangalore (INR ₹)</option>
                <option value="hyderabad">Hyderabad (INR ₹)</option>
                <option value="dubai">Dubai & UAE (AED)</option>
                <option value="london">London & UK (£)</option>
                <option value="us_remote">US & Remote ($)</option>
              </select>
            </div>

            {/* Quick Analyze External JD CTA */}
            <button
              onClick={onOpenExternalJd}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-sm shadow-indigo-200 whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Scan Any JD</span>
            </button>
          </div>

        </div>

        {/* Mobile secondary navigation scrollbar */}
        <div className="lg:hidden flex items-center gap-4 py-2 border-t border-slate-100 overflow-x-auto text-xs text-slate-600 no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'jobs' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('external_jd')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'external_jd' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}`}
          >
            Scan JD
          </button>
          <button
            onClick={() => setActiveTab('ats_tailor')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'ats_tailor' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}`}
          >
            ATS Resume
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'interview' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}`}
          >
            Interview
          </button>
          <button
            onClick={() => setActiveTab('salary')}
            className={`whitespace-nowrap px-2 py-1 rounded ${activeTab === 'salary' ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}`}
          >
            Salary
          </button>
        </div>
      </div>
    </header>
  );
};
