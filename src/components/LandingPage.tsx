import React from 'react';
import { Sprout, ShoppingCart, TrendingUp, Navigation, ArrowRight, ShieldCheck, CheckCircle2, DollarSign, Truck, BarChart3 } from 'lucide-react';
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
    <div id="landing-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12 text-stone-800">
      {/* 1. Minimal Clean Hero */}
      <section className="bg-[#1B4332] text-white p-8 sm:p-12 rounded-3xl border border-[#26533f] shadow-lg space-y-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24543f] text-[#D4A24E] text-xs font-semibold">
            <span>Direct Farmgate Exchange</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Direct Farm-to-Buyer Marketplace &amp; Logistics
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Connecting farmers and FPOs directly with consumers and bulk buyers — transparent pricing, live demand forecasting, and consolidated transport.
          </p>
        </div>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            id="hero-list-harvest-btn"
            onClick={() => onSelectTab('farmer')}
            className="px-6 py-3 bg-[#D4A24E] hover:bg-[#c2913e] text-[#1B4332] font-bold rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98"
          >
            <Sprout className="w-4 h-4" />
            <span>List Your Harvest</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-browse-marketplace-btn"
            onClick={() => onSelectTab('buyer')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer border border-white/20 backdrop-blur-xs active:scale-98"
          >
            <ShoppingCart className="w-4 h-4 text-[#D4A24E]" />
            <span>Browse Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live Marketplace Indicator */}
        <div className="flex items-center gap-2 text-xs text-emerald-200/80 pt-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>
            {listings.length} active listings across {distinctStatesCount} {distinctStatesCount === 1 ? 'state' : 'states'} ({activeLotsCount} lots ready for dispatch)
          </span>
        </div>
      </section>

      {/* 2. Compact 3-Column Impact Stats Strip (Below the Fold) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 block">
            Traditional Farmer Realization
          </span>
          <span className="text-2xl font-black text-rose-600">28% – 35%</span>
          <p className="text-xs text-stone-600 pt-1">
            Farmers receive only ₹13.50/kg for produce retailing at ₹36.00/kg under traditional mandis.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 block">
            Intermediary Margin Spread
          </span>
          <span className="text-2xl font-black text-amber-600">110% – 180%</span>
          <p className="text-xs text-stone-600 pt-1">
            Extracted across 4–5 middleman layers between harvest points and retail markets.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500 block">
            KisanDirect Direct Outcome
          </span>
          <span className="text-2xl font-black text-[#1B4332]">+62% Farm / -33% Buyer</span>
          <p className="text-xs text-stone-600 pt-1">
            Direct fair farmgate price with consolidated ₹1.90/kg optimized freight routing.
          </p>
        </div>
      </section>

      {/* 3. Dedicated Access Portal Selection */}
      <section className="space-y-4">
        <div className="border-b border-stone-200 pb-2">
          <h2 className="text-xl font-black text-stone-900">
            Select Your Access Portal
          </h2>
          <p className="text-xs text-stone-500">
            Choose your role to access customized tools and marketplace workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Farmer Portal Card */}
          <div 
            id="portal-farmer-card"
            className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-200 hover:border-[#1B4332] transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1B4332] flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#1B4332]">
                Farmer &amp; FPO Portal
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                List your produce, receive AI-computed fair market price benchmarks, and connect with direct buyers without commission fees.
              </p>
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

          {/* Buyer Portal Card */}
          <div 
            id="portal-buyer-card"
            className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-stone-200 hover:border-[#D4A24E] transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#91651c] flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-stone-900">
                Buyer Marketplace
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Source fresh harvest directly from verified growers with full lot traceability, transparent pricing, and scheduled delivery dispatch.
              </p>
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

      {/* 4. Supply Chain Context Section */}
      <section className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-2">
        <h2 className="text-sm font-bold text-stone-900">
          The Agricultural Distribution Challenge
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Traditional agricultural supply chains pass produce through village aggregators, commission agents (Arhtiyas), APMC mandi traders, and multiple wholesaler layers. Each intermediary charges commissions, leaving growers with less than a third of the end consumer price. KisanDirect replaces these manual layers with algorithmic fair pricing and direct farmgate collection.
        </p>
      </section>

      {/* 5. 4-Pillar Ecosystem Section */}
      <section className="space-y-4">
        <div className="border-b border-stone-200 pb-2">
          <h2 className="text-xl font-black text-stone-900">
            Integrated Farm-to-Market Ecosystem
          </h2>
          <p className="text-xs text-stone-500">
            Core components uniting growers, buyers, and logistics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-sm font-bold text-stone-900">Direct Digital Marketplace</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Connects households, retailers, and institutions directly with farmgate lots without intermediary commission cuts.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-sm font-bold text-stone-900">Integrated Logistics</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Coordinates farmgate collection points with scheduled delivery milestones and vehicle tracking.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-sm font-bold text-stone-900">Demand &amp; Price Guidance</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Analyzes regional mandi arrival trends to provide growers with accurate pricing benchmarks.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-sm font-bold text-stone-900">Route Consolidation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Optimizes multi-farm freight pickup routes to minimize transport costs and reduce transit times.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

