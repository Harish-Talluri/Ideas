/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, LocationHub, RoleTrack, JobOpportunity } from './types';
import { EMPTY_USER_PROFILE, CURATED_JOBS } from './data/mockData';
import { Header } from './components/Header';
import { ProfileWorkspace } from './components/ProfileWorkspace';
import { JobExplorer } from './components/JobExplorer';
import { ATSTailorStudio } from './components/ATSTailorStudio';
import { InterviewCoach } from './components/InterviewCoach';
import { SalaryNegotiator } from './components/SalaryNegotiator';

export default function App() {
  // Personal profile initialized from localStorage or empty zero-state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('careerpath_personal_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return EMPTY_USER_PROFILE;
  });

  const [selectedHub, setSelectedHub] = useState<LocationHub>(() => {
    if (userProfile.targetLocations?.length) {
      return userProfile.targetLocations[0];
    }
    return 'bangalore';
  });

  const [selectedRoleTrack, setSelectedRoleTrack] = useState<RoleTrack>(() => {
    return userProfile.targetRoleTrack || 'product';
  });

  const [activeJob, setActiveJob] = useState<JobOpportunity | null>(CURATED_JOBS[0]);
  const [activeTab, setActiveTab] = useState<'profile' | 'jobs' | 'external_jd' | 'ats_tailor' | 'interview' | 'salary'>('profile');

  // Save profile changes to localStorage
  useEffect(() => {
    if (userProfile.name) {
      try {
        localStorage.setItem('careerpath_personal_profile', JSON.stringify(userProfile));
      } catch (e) {
        // ignore
      }
    }
  }, [userProfile]);

  // Keep role track in sync with profile preferences
  useEffect(() => {
    if (userProfile.targetRoleTrack && userProfile.targetRoleTrack !== 'all') {
      setSelectedRoleTrack(userProfile.targetRoleTrack);
    }
  }, [userProfile.targetRoleTrack]);

  // Handle Quick Scan from Header
  const handleOpenExternalJd = () => {
    setActiveTab('external_jd');
  };

  // Jump to ATS Tailor with selected job
  const handleOpenTailorStudio = (job: JobOpportunity) => {
    setActiveJob(job);
    setActiveTab('ats_tailor');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedHub={selectedHub}
        setSelectedHub={setSelectedHub}
        selectedRoleTrack={selectedRoleTrack}
        setSelectedRoleTrack={setSelectedRoleTrack}
        onOpenExternalJd={handleOpenExternalJd}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'profile' && (
          <ProfileWorkspace
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            selectedHub={selectedHub}
            setSelectedHub={setSelectedHub}
            onContinueToJobs={() => setActiveTab('jobs')}
          />
        )}

        {activeTab === 'jobs' && (
          <JobExplorer
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            selectedHub={selectedHub}
            setSelectedHub={setSelectedHub}
            selectedRoleTrack={selectedRoleTrack}
            setSelectedRoleTrack={setSelectedRoleTrack}
            activeJob={activeJob}
            setActiveJob={setActiveJob}
            onOpenTailorStudio={handleOpenTailorStudio}
            externalJdDefaultOpen={false}
          />
        )}

        {activeTab === 'external_jd' && (
          <JobExplorer
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            selectedHub={selectedHub}
            setSelectedHub={setSelectedHub}
            selectedRoleTrack={selectedRoleTrack}
            setSelectedRoleTrack={setSelectedRoleTrack}
            activeJob={activeJob}
            setActiveJob={setActiveJob}
            onOpenTailorStudio={handleOpenTailorStudio}
            externalJdDefaultOpen={true}
          />
        )}

        {activeTab === 'ats_tailor' && (
          <ATSTailorStudio
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            selectedHub={selectedHub}
            activeJob={activeJob}
            setActiveJob={setActiveJob}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewCoach
            selectedHub={selectedHub}
            selectedRoleTrack={selectedRoleTrack}
            activeJob={activeJob}
          />
        )}

        {activeTab === 'salary' && (
          <SalaryNegotiator
            userProfile={userProfile}
            selectedHub={selectedHub}
            selectedRoleTrack={selectedRoleTrack}
            activeJob={activeJob}
          />
        )}
      </main>

      {/* Restrained Domain Footer (No decorative status engines or fake worker tags) */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CareerPath AI</span>
            <span aria-hidden="true">·</span>
            <span>Regional Career Command Center</span>
            <span aria-hidden="true">·</span>
            <span>Bangalore · Hyderabad · Dubai · London · US / Global</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>ATS Engine v3.8</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Pill Typography Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
