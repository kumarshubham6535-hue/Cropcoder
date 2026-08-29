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
        {/* Smart Agriculture Connected Background Layer (Precision Farming, Drone Telemetry & Field Network) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Base Smart Agriculture Photography */}
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=80"
            alt="Smart precision agriculture field with drone monitoring and automated machinery"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
          />

          {/* Connected Network & Drone Telemetry Vector Overlay (Matching User's Smart Farming Visual) */}
          <svg className="absolute inset-0 w-full h-full object-cover opacity-35" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gridGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#52B788" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#D4A24E" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1B4332" stopOpacity="0.1" />
              </linearGradient>
              <radialGradient id="satelliteNode" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D4A24E" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#D4A24E" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Constellation & Satellite Network Mesh in the Sky */}
            <g stroke="#52B788" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6">
              <line x1="520" y1="90" x2="610" y2="140" />
              <line x1="610" y1="140" x2="700" y2="110" />
              <line x1="700" y1="110" x2="820" y2="150" />
              <line x1="610" y1="140" x2="680" y2="200" />
              <line x1="520" y1="90" x2="580" y2="220" />
              <line x1="680" y1="200" x2="820" y2="150" />
              <line x1="700" y1="110" x2="760" y2="60" />
              <line x1="610" y1="140" x2="640" y2="70" />
              <line x1="220" y1="110" x2="520" y2="90" stroke="#D4A24E" strokeWidth="1" />
            </g>

            {/* Network Nodes */}
            <circle cx="520" cy="90" r="3" fill="#D4A24E" />
            <circle cx="610" cy="140" r="4" fill="#52B788" />
            <circle cx="700" cy="110" r="3.5" fill="#D4A24E" />
            <circle cx="820" cy="150" r="3" fill="#52B788" />
            <circle cx="680" cy="200" r="3.5" fill="#D4A24E" />
            <circle cx="580" cy="220" r="2.5" fill="#52B788" />
            <circle cx="640" cy="70" r="2.5" fill="#D4A24E" />
            <circle cx="760" cy="60" r="3" fill="#52B788" />
            <circle cx="610" cy="140" r="14" fill="url(#satelliteNode)" />

            {/* Smart Drone Silhouette & Signal Cone on Left */}
            <g transform="translate(180, 80)">
              {/* Drone Body */}
              <ellipse cx="40" cy="20" rx="14" ry="5" fill="#D4A24E" />
              <line x1="20" y1="15" x2="60" y2="25" stroke="#D4A24E" strokeWidth="2" />
              <line x1="20" y1="25" x2="60" y2="15" stroke="#D4A24E" strokeWidth="2" />
              {/* Rotors */}
              <ellipse cx="18" cy="14" rx="8" ry="2" fill="#52B788" opacity="0.8" />
              <ellipse cx="62" cy="14" rx="8" ry="2" fill="#52B788" opacity="0.8" />
              <ellipse cx="18" cy="26" rx="8" ry="2" fill="#52B788" opacity="0.8" />
              <ellipse cx="62" cy="26" rx="8" ry="2" fill="#52B788" opacity="0.8" />
              {/* Sensor Camera & Downlink Beam */}
              <circle cx="40" cy="25" r="3" fill="#ffffff" />
              <polygon points="35,28 45,28 90,260 -10,260" fill="url(#gridGlow)" opacity="0.15" />
            </g>

            {/* Secondary Field Survey Drone */}
            <g transform="translate(130, 160) scale(0.6)">
              <ellipse cx="40" cy="20" rx="12" ry="4" fill="#52B788" />
              <line x1="22" y1="16" x2="58" y2="24" stroke="#52B788" strokeWidth="1.5" />
              <line x1="22" y1="24" x2="58" y2="16" stroke="#52B788" strokeWidth="1.5" />
            </g>

            {/* Precision Crop Field Rows / Furrow Lines */}
            <path d="M 0 420 Q 300 380 600 440 T 1200 400" stroke="#52B788" strokeWidth="1.5" opacity="0.3" fill="none" />
            <path d="M 0 470 Q 300 430 600 490 T 1200 450" stroke="#52B788" strokeWidth="1.5" opacity="0.4" fill="none" />
            <path d="M 0 520 Q 300 480 600 540 T 1200 500" stroke="#2D6A4F" strokeWidth="2" opacity="0.5" fill="none" />
            <path d="M 0 570 Q 300 530 600 590 T 1200 550" stroke="#143326" strokeWidth="2.5" opacity="0.6" fill="none" />
          </svg>

          {/* Deep Forest Gradient Overlays for High Legibility & WCAG AA Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#112d22]/95 via-[#1B4332]/90 to-[#153a2b]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332] via-transparent to-transparent opacity-80" />
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
