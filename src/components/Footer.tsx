import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Phone, ShieldCheck, AlertTriangle } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <footer className="bg-[#1B4332] text-white/70 border-t border-[#D4A24E]/30 no-print">
      {/* High Density Information Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded bg-[#D4A24E] text-[#1B4332] flex items-center justify-center font-bold text-[10px]">
              KS
            </div>
            <span className="font-bold text-white text-xs">KrishiScan AI Engine</span>
          </div>
          <p className="text-[11px] text-white/60 leading-snug">
            Precision crop pathology & CIBRC-compliant dosage calculator for Indian farming ecosystems.
          </p>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4A24E] mb-1">
            Helpline Support
          </div>
          <p className="text-[11px] text-white/80 font-mono">
            Kisan Call Centre: <span className="text-[#D4A24E]">1800-180-1551</span>
          </p>
          <p className="text-[10px] text-white/50">Toll-Free (6:00 AM - 10:00 PM IST)</p>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4A24E] mb-1">
            Research Standard
          </div>
          <p className="text-[11px] text-white/80">ICAR, CPRI & IIWBR Aligned</p>
          <p className="text-[10px] text-white/50">Standardized Agro-Climate Pathogen DB</p>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4A24E] mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#D4A24E]" />
            <span>Safety Rule</span>
          </div>
          <p className="text-[10px] text-white/60 leading-tight">
            Follow Pre-Harvest Interval (PHI) safety windows before plucking. Wear masks when spraying.
          </p>
        </div>
      </div>

      {/* Ultra-compact High Density bottom status bar */}
      <div className="h-8 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between text-[10px] text-white/50 font-mono">
        <div className="flex items-center gap-2">
          <span>&copy; 2026 KRISHISCAN • SIH HACKATHON DEMO</span>
          <span className="hidden sm:inline opacity-30">|</span>
          <span className="hidden sm:inline text-white/60">FARMER ADVISORY PORTAL</span>
        </div>
        <div className="flex items-center gap-3">
          <span>AI MODEL v2.4.0</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

