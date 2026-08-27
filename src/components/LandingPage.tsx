import React from 'react';
import { Sprout, ShoppingCart, TrendingUp, Navigation, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ActiveTab } from './Header';

interface LandingPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectTab }) => {
  return (
    <div id="landing-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 text-stone-800">
      {/* Problem & Mandate Banner */}
      <section className="bg-[#1B4332] text-white p-6 sm:p-10 rounded-2xl border border-[#2d5f49] shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d5f49] pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#24543f] text-[#D4A24E] text-xs font-mono font-bold border border-[#D4A24E]/30">
            <span>Official Problem Statement: PS 26033</span>
          </div>
          <span className="text-xs text-emerald-200">
            Ministry of Consumer Affairs, Food & Public Distribution (DoCA)
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Eliminating 4–5 Intermediary Tiers to Double Farmer Earnings and Lower Consumer Food Inflation
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-4xl leading-relaxed">
            In the traditional agricultural supply chain, produce passes through village aggregators, local commission agents (Arhtiyas), APMC mandi traders, secondary wholesalers, and urban retailers. Each layer extracts 15–30% margins, leaving farmers with only 28–35% of the consumer rupee while inflating end-consumer prices by up to 180%.
          </p>
        </div>

        {/* Real Numbers Problem Baseline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#153427] p-4 rounded-xl border border-[#26533f]">
            <span className="text-xs text-stone-400 block uppercase font-mono">Traditional Farmgate Realization</span>
            <span className="text-2xl font-black text-rose-400">28% – 35%</span>
            <p className="text-xs text-stone-300 mt-1">Farmer receives ₹13.50/kg for produce that retails at ₹36.00/kg in cities.</p>
          </div>

          <div className="bg-[#153427] p-4 rounded-xl border border-[#26533f]">
            <span className="text-xs text-stone-400 block uppercase font-mono">Middleman Markup Margin</span>
            <span className="text-2xl font-black text-amber-400">110% – 180%</span>
            <p className="text-xs text-stone-300 mt-1">Accumulated commission fees, mandi cess, sorting cuts, and uncoordinated freight.</p>
          </div>

          <div className="bg-[#153427] p-4 rounded-xl border border-[#26533f]">
            <span className="text-xs text-stone-400 block uppercase font-mono">KisanDirect Outcome</span>
            <span className="text-2xl font-black text-[#D4A24E]">+62% Farmer / -33% Buyer</span>
            <p className="text-xs text-stone-300 mt-1">Farmer gets ₹22.00/kg, consumer pays ₹23.90/kg with consolidated ₹1.90/kg logistics.</p>
          </div>
        </div>
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
            How the 4-Point Solution Solves Problem Statement 26033
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Architectural mapping to Department of Consumer Affairs requirements
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
              Requirement 1
            </span>
            <h3 className="text-sm font-extrabold text-stone-900">Direct Digital Marketplace</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Enables individual consumers, hotels, and retail chains to purchase directly from farmgate listings without Arhtiya commissions.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
              Requirement 2
            </span>
            <h3 className="text-sm font-extrabold text-stone-900">Integrated Logistics Support</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Assigns pickup points at farmgate and delivery points at buyer doorsteps with scheduled collection milestones.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
              Requirement 3
            </span>
            <h3 className="text-sm font-extrabold text-stone-900">AI Demand & Price Forecast</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Computes Holt-Winters exponential smoothing on historical wholesale arrivals to give farmers realistic demand and fair price guidance.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#1B4332] bg-emerald-50 px-2 py-0.5 rounded">
              Requirement 4
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
