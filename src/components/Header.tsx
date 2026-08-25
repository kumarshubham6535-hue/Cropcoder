import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Globe, Camera, Home, BarChart2, Sparkles, MapPin, Database, User, LogIn } from 'lucide-react';
import { UserProfile } from '../services/authService';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: 'home' | 'scan' | 'dashboard';
  setActiveTab: (tab: 'home' | 'scan' | 'dashboard') => void;
  onStartScan: () => void;
  onOpenSupabaseModal?: () => void;
  isSupabaseConnected?: boolean;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  setActiveTab,
  onStartScan,
  onOpenSupabaseModal,
  isSupabaseConnected = true,
  currentUser,
  onOpenAuthModal,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-40 h-14 px-3 sm:px-6 bg-[#1B4332] text-white border-b border-[#D4A24E]/30 flex items-center justify-between no-print shadow-xs select-none">
      {/* Brand Title & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A24E] rounded px-0.5 cursor-pointer"
        >
          <div className="w-8 h-8 bg-[#D4A24E] rounded flex items-center justify-center font-black text-[#1B4332] text-sm tracking-tighter shadow-2xs group-hover:scale-105 transition-transform font-mono">
            KS
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-white flex items-center gap-1.5">
            <span>KrishiScan</span>
            <span className="text-[10px] bg-[#D4A24E]/20 text-[#D4A24E] border border-[#D4A24E]/40 px-1.5 py-0.5 rounded font-mono font-bold hidden sm:inline-block">
              SIH-AI
            </span>
          </h1>
        </button>
      </div>

      {/* Center & Right Navigation Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Navigation Tabs (High Density Clean Style) */}
        <nav className="flex items-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-semibold tracking-wider uppercase">
          <button
            onClick={() => setActiveTab('home')}
            className={`cursor-pointer transition-all ${
              activeTab === 'home'
                ? 'text-[#D4A24E] border-b-2 border-[#D4A24E] pb-1'
                : 'opacity-70 hover:opacity-100 hover:text-white pb-1'
            }`}
          >
            {t.navHome || 'HOME'}
          </button>

          <button
            onClick={() => {
              setActiveTab('scan');
              onStartScan();
            }}
            className={`cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === 'scan'
                ? 'text-[#D4A24E] border-b-2 border-[#D4A24E] pb-1'
                : 'opacity-70 hover:opacity-100 hover:text-white pb-1'
            }`}
          >
            <span>{t.navScan || 'SCANNER'}</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === 'dashboard'
                ? 'text-[#D4A24E] border-b-2 border-[#D4A24E] pb-1'
                : 'opacity-70 hover:opacity-100 hover:text-white pb-1'
            }`}
          >
            <span>{t.navHistory || 'MY HISTORY'}</span>
          </button>
        </nav>

        {/* Supabase DB Connection Pill */}
        {onOpenSupabaseModal && (
          <button
            onClick={onOpenSupabaseModal}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/25 hover:bg-black/40 border border-[#D4A24E]/30 text-white text-xs font-mono transition-all cursor-pointer"
            title="Supabase PostgreSQL Integration & SQL Schema"
          >
            <Database className="w-3.5 h-3.5 text-[#D4A24E]" />
            <span className="text-[11px] font-bold">Supabase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        )}

        {/* Farmer Login / Profile Button */}
        <button
          onClick={onOpenAuthModal}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            currentUser
              ? 'bg-[#D4A24E]/20 text-[#D4A24E] border-[#D4A24E]/50 hover:bg-[#D4A24E]/30'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
          }`}
          title={currentUser ? `Logged in as ${currentUser.name}` : 'Login to view scan history'}
        >
          <User className="w-3.5 h-3.5 text-[#D4A24E]" />
          <span className="max-w-[100px] truncate hidden xs:inline">
            {currentUser ? currentUser.name.split(' ')[0] : (currentLang === 'hi' ? 'लॉगिन' : 'Login')}
          </span>
        </button>

        {/* Quick Language Toggle Pill */}
        <div className="flex items-center gap-1 bg-black/25 border border-[#D4A24E]/20 rounded-full px-2 py-0.5 text-xs">
          <button
            onClick={() => onLanguageChange('en')}
            className={`cursor-pointer transition-colors px-1 rounded ${
              currentLang === 'en' ? 'text-[#D4A24E] font-bold' : 'opacity-70 hover:opacity-100'
            }`}
          >
            EN
          </button>
          <span className="opacity-30">|</span>
          <button
            onClick={() => onLanguageChange('hi')}
            className={`cursor-pointer transition-colors px-1 rounded ${
              currentLang === 'hi' ? 'text-[#D4A24E] font-bold' : 'opacity-70 hover:opacity-100'
            }`}
          >
            हिं
          </button>

          {/* Extended dropdown for all 8 Indian regional languages */}
          <div className="relative ml-0.5">
            <select
              aria-label="Select regional language"
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-transparent w-4 h-4 cursor-pointer focus:outline-none absolute inset-0 opacity-0"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#1B4332] text-white">
                  {lang.native} ({lang.label})
                </option>
              ))}
            </select>
            <Globe className="w-3.5 h-3.5 text-[#D4A24E] opacity-80 pointer-events-none" />
          </div>
        </div>

        {/* Quick Scan Action CTA */}
        <button
          onClick={() => {
            setActiveTab('scan');
            onStartScan();
          }}
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#D4A24E] hover:bg-[#C2903C] text-[#081C15] px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{t.navScan || 'SCAN'}</span>
        </button>
      </div>
    </header>
  );
};


