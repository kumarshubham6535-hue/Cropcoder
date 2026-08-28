import React from 'react';
import { Sprout, ShoppingCart, TrendingUp, Navigation, ArrowRight, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { ActiveTab } from './Header';
import { ProduceListing } from '../types';

interface LandingPageProps {
  onSelectTab: (tab: ActiveTab) => void;
  listings?: ProduceListing[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectTab, listings = [] }) => {
  // Compute live real-data statistics
  const distinctStates = new Set(listings.map((l) => l.location?.state).filter(Boolean));
  const distinctStatesCount = distinctStates.size || 1;
  const activeLotsCount = listings.filter((l) => l.status === 'active' && l.quantityAvailableQuintals > 0).length;

  return (
    <div id="landing-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 text-stone-800">
      {/* Redesigned Compact Hero Banner with Direct CTAs */}
      <section className="relative overflow-hidden bg-[#1B4332] text-white p-5 sm:p-8 rounded-2xl border border-[#2d5f49] shadow-lg space-y-5">
        {/* Resilient Thematic Background Pattern (Agricultural Contour & Sunrise Gradient) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <svg className="w-full h-full object-cover" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sunGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#D4A24E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="fieldWave" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52B788" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle cx="950" cy="120" r="280" fill="url(#sunGlow)" />
            <path d="M0 400 C 300 320, 600 480, 1200 350 L 1200 600 L 0 600 Z" fill="url(#fieldWave)" />
            <path d="M0 460 C 400 390, 800 520, 1200 420 L 1200 600 L 0 600 Z" fill="#2D6A4F" fillOpacity="0.3" />
            <path d="M0 520 C 350 480, 750 560, 1200 500 L 1200 600 L 0 600 Z" fill="#143326" fillOpacity="0.5" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-[#112d22]/90 via-[#1B4332]/80 to-[#153a2b]/70" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* 1. Small Eyebrow Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d5f49]/80 pb-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#24543f]/80 text-[#D4A24E] text-xs font-mono font-bold border border-[#D4A24E]/40 backdrop-blur-xs">
              <span>National Farmgate Exchange</span>
            </div>
            <span className="text-xs text-emerald-200/90 font-medium">
              Direct Farm-to-Consumer & Bulk Wholesale Network
            </span>
          </div>

          {/* 2. Punchy Headline & 3. One-sentence Subhead */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xs">
              Cut Out 4–5 Middlemen. Farmers Earn More. Buyers Pay Less.
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-3xl leading-relaxed">
              KisanDirect connects farmers and FPOs straight to consumers and bulk buyers — with AI-backed pricing, demand forecasts, and optimized logistics. No mandi commissions, no markup chains.
            </p>
          </div>

          {/* 4. Action CTA Buttons Directly in Hero */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              id="hero-list-harvest-btn"
              onClick={() => onSelectTab('farmer')}
              className="px-5 py-2.5 bg-[#D4A24E] hover:bg-[#c2913e] text-[#1B4332] font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98"
            >
              <Sprout className="w-4 h-4" />
              <span>List Your Harvest</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-browse-marketplace-btn"
              onClick={() => onSelectTab('buyer')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border border-white/20 backdrop-blur-xs active:scale-98"
            >
              <ShoppingCart className="w-4 h-4 text-[#D4A24E]" />
              <span>Browse the Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5. Live Real-Data Line */}
          <div className="flex items-center gap-2 text-xs text-emerald-200/90 font-medium pt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              {listings.length} active listings across {distinctStatesCount} {distinctStatesCount === 1 ? 'state' : 'states'} ({activeLotsCount} lots available for instant dispatch)
            </span>
          </div>

          {/* 6. Three Compact Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-[#153427]/85 backdrop-blur-xs p-3 sm:p-3.5 rounded-xl border border-[#26533f]/80 shadow-xs">
              <span className="text-[10px] sm:text-[11px] text-emerald-300/80 block uppercase font-mono tracking-wider">
                Traditional Realization
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-400">28% – 35%</span>
              <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5">
                Farmers receive ₹13.50/kg for produce retailing at ₹36.00/kg.
              </p>
            </div>

            <div className="bg-[#153427]/85 backdrop-blur-xs p-3 sm:p-3.5 rounded-xl border border-[#26533f]/80 shadow-xs">
              <span className="text-[10px] sm:text-[11px] text-emerald-300/80 block uppercase font-mono tracking-wider">
                Middleman Markup
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">110% – 180%</span>
              <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5">
                Extracted across 4–5 uncoordinated intermediary layers.
              </p>
            </div>

            <div className="bg-[#153427]/85 backdrop-blur-xs p-3 sm:p-3.5 rounded-xl border border-[#26533f]/80 shadow-xs">
              <span className="text-[10px] sm:text-[11px] text-emerald-300/80 block uppercase font-mono tracking-wider">
                KisanDirect Outcome
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#D4A24E]">+62% Farm / -33% Buyer</span>
              <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5">
                Direct fair price with consolidated ₹1.90/kg freight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Moved Problem Section (Specific Detail Preserved Below Hero) */}
      <section className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
            The Supply Chain Problem
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-mono">
            Why Traditional Agricultural Distribution Fails Farmers & Buyers
          </h2>
        </div>
        <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
          In the traditional agricultural supply chain, produce passes through village aggregators, local commission agents (Arhtiyas), APMC mandi traders, secondary wholesalers, and urban retailers. Each layer extracts 15–30% margins, leaving farmers with only 28–35% of the consumer rupee while inflating end-consumer prices by up to 180%.
        </p>
      </section>

      {/* Two Clear Entry Points */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-stone-600 font-mono">
          Select Your Access Portal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Farmer / FPO Entry Card */}
          <div 
            id="portal-farmer-card"
            className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-200 hover:border-[#1B4332] transition-all shadow-xs flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1B4332] flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#1B4332]">
                Farmer & FPO Portal
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Register your farm or Farmer Producer Organization (FPO), list your harvest, and obtain real-time AI-computed fair pricing based on regional wholesale demand trends.
              </p>
              <ul className="space-y-2 text-xs text-stone-700 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>List produce with quantity, harvest date, and pickup point</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>AI suggested fair price and next month expected demand</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Direct payout with 0% middleman commission deduction</span>
                </li>
              </ul>
            </div>

            <button
              id="enter-farmer-btn"
              onClick={() => onSelectTab('farmer')}
              className="w-full py-3.5 px-4 bg-[#1B4332] hover:bg-[#143326] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Enter as Farmer / FPO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Buyer Entry Card */}
          <div 
            id="portal-buyer-card"
            className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-200 hover:border-[#D4A24E] transition-all shadow-xs flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#91651c] flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-stone-900">
                Buyer Marketplace
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Source directly from verified farmers and FPOs. One unified marketplace for both household consumers (1–5 Qtl) and institutional bulk buyers with scheduled logistics.
              </p>
              <ul className="space-y-2 text-xs text-stone-700 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Browse live produce by crop, region, and quantity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Transparent price comparison vs local middleman market</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Consolidated collection and assigned delivery dispatch</span>
                </li>
              </ul>
            </div>

            <button
              id="enter-buyer-btn"
              onClick={() => onSelectTab('buyer')}
              className="w-full py-3.5 px-4 bg-[#D4A24E] hover:bg-[#c2913e] text-[#1B4332] font-black rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Enter as Buyer (Consumer / Bulk)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4-Point Solution Architecture (Plainly Stated) */}
      <section className="bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-xl font-black text-stone-900">
            Integrated Direct Farm-to-Market Ecosystem
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Four foundational pillars connecting farmers directly with buyers and AI-optimized logistics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
              Pillar 01
            </span>
            <h3 className="text-sm font-extrabold text-stone-900">Direct Digital Marketplace</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Enables individual consumers, hotels, and retail chains to purchase directly from farmgate listings without Arhtiya commissions.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
              Pillar 02
            </span>
            <h3 className="text-sm font-extrabold text-stone-900">Integrated Logistics Support</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Assigns pickup points at farmgate and delivery points at buyer doorsteps with scheduled collection milestones.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
              Pillar 03
            </span>
            <h3 className="text-sm font-extrabold text-stone-900">AI Demand & Price Forecast</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Computes Holt-Winters exponential smoothing on historical wholesale arrivals to give farmers realistic demand and fair price guidance.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
              Pillar 04
            </span>
            <h3 className="text-sm font-extrabold text-stone-900">AI Route Optimization</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Solves multi-farm collection via Nearest-Neighbor TSP heuristic, saving over 55% in freight distance vs uncoordinated individual trips.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
