/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, ScanResult, CropCategory, DiseaseInfo } from './types';
import { INITIAL_SAMPLE_SCANS } from './data/sampleScans';
import { CROP_DISEASES } from './data/cropDiseases';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ScanPage } from './components/ScanPage';
import { ResultsPage } from './components/ResultsPage';
import { Dashboard } from './components/Dashboard';
import { SupabaseModal } from './components/SupabaseModal';
import { AuthModal } from './components/AuthModal';
import {
  UserProfile,
  getCurrentUser,
  setCurrentUser,
  DEMO_USER,
} from './services/authService';
import {
  fetchScansFromSupabase,
  saveScanToSupabase,
  saveFarmerProfileToSupabase,
  updateScanStatusInSupabase,
} from './services/supabaseService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'results' | 'dashboard'>('home');
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [scansHistory, setScansHistory] = useState<ScanResult[]>(INITIAL_SAMPLE_SCANS);
  const [currentScanResult, setCurrentScanResult] = useState<ScanResult>(INITIAL_SAMPLE_SCANS[0]);
  const [preselectedCrop, setPreselectedCrop] = useState<CropCategory>('potato');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUser() || DEMO_USER);

  // Load scans and sync farmer profile from/to Supabase on startup
  const syncWithSupabase = async () => {
    try {
      if (user) {
        saveFarmerProfileToSupabase(user).catch(() => {});
      }
      const cloudScans = await fetchScansFromSupabase();
      if (cloudScans && cloudScans.length > 0) {
        setScansHistory(cloudScans);
        setCurrentScanResult(cloudScans[0]);
      }
    } catch (err) {
      console.warn('Initial Supabase sync fallback:', err);
    }
  };

  useEffect(() => {
    syncWithSupabase();
  }, []);

  // Handle Login & Logout
  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setCurrentUser(newUser);
    saveFarmerProfileToSupabase(newUser).catch(() => {});
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  // Navigate to scan tab
  const handleNavigateToScan = (crop: CropCategory = 'potato') => {
    setPreselectedCrop(crop);
    setActiveTab('scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Instant demo preset selection from landing page
  const handleSelectSampleLeaf = (disease: DiseaseInfo) => {
    const [minConf, maxConf] = disease.confidenceRange;
    const randomConf = Number((minConf + Math.random() * (maxConf - minConf)).toFixed(1));

    const newScan: ScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      crop: disease.crop,
      cropNameEn: disease.cropNameEn,
      cropNameHi: disease.cropNameHi,
      disease: disease,
      confidence: randomConf,
      imageUrl: disease.sampleImage,
      severity: disease.severity,
      farmAreaAcres: user ? user.farmSizeAcres : 1.5,
      fieldLocation: user ? `${user.village || 'Plot 1'}, ${user.district}` : 'Plot 2 - Test Sector',
      status: disease.severity === 'healthy' ? 'Healthy' : 'Critical',
      notes: `Instant demo diagnosis via KrishiScan pathology engine.`,
      userId: user?.id,
      userPhone: user?.phone,
      userName: user?.name,
    };

    setScansHistory((prev) => [newScan, ...prev]);
    setCurrentScanResult(newScan);
    saveScanToSupabase(newScan); // Asynchronously sync to Supabase
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete scan handler
  const handleScanComplete = (result: ScanResult) => {
    const enrichedResult: ScanResult = {
      ...result,
      userId: user?.id,
      userPhone: user?.phone,
      userName: user?.name,
      fieldLocation: user ? `${user.village || 'Plot 1'}, ${user.district}` : result.fieldLocation,
    };
    setScansHistory((prev) => [enrichedResult, ...prev]);
    setCurrentScanResult(enrichedResult);
    saveScanToSupabase(enrichedResult); // Asynchronously sync to Supabase
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View historical scan from dashboard
  const handleViewScanResult = (scan: ScanResult) => {
    setCurrentScanResult(scan);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update status in history
  const handleUpdateScanStatus = (
    scanId: string,
    status: 'Treated' | 'Follow-up' | 'Critical' | 'Healthy'
  ) => {
    setScansHistory((prev) =>
      prev.map((s) => (s.id === scanId ? { ...s, status } : s))
    );
    updateScanStatusInSupabase(scanId, status); // Asynchronously update in Supabase
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#2B2B2B] font-sans selection:bg-[#D4A24E] selection:text-[#081C15]">
      {/* Universal Top Navigation */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab === 'results' ? 'scan' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartScan={() => handleNavigateToScan()}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        currentUser={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Dynamic Workspace */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            currentLang={currentLang}
            onNavigateToScan={handleNavigateToScan}
            onSelectSampleLeaf={handleSelectSampleLeaf}
          />
        )}

        {activeTab === 'scan' && (
          <ScanPage
            currentLang={currentLang}
            onScanComplete={handleScanComplete}
            preselectedCrop={preselectedCrop}
          />
        )}

        {activeTab === 'results' && currentScanResult && (
          <ResultsPage
            scan={currentScanResult}
            currentLang={currentLang}
            onReScan={() => handleNavigateToScan(currentScanResult.crop)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            scans={scansHistory}
            currentLang={currentLang}
            onViewScanResult={handleViewScanResult}
            onUpdateScanStatus={handleUpdateScanStatus}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
            currentUser={user}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Farmer Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        currentLang={currentLang}
      />

      {/* Supabase Connection & SQL Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigUpdated={syncWithSupabase}
        scans={scansHistory}
        currentUser={user}
      />

      {/* Footer */}
      <Footer currentLang={currentLang} />
    </div>
  );
}

