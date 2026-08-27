import React from 'react';
import { ShieldCheck, Truck, Sprout, ShoppingCart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#153427] text-white/80 border-t border-[#26533f] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#D4A24E] text-[#1B4332] flex items-center justify-center font-black text-xs">
              🌾
            </div>
            <span className="font-extrabold text-white text-sm">KisanDirect</span>
            <span className="text-[10px] font-mono bg-[#24543f] text-[#D4A24E] px-1.5 py-0.5 rounded border border-[#D4A24E]/30">
              PS 26033
            </span>
          </div>
          <p className="text-[11px] text-stone-300 leading-relaxed">
            Eliminating agricultural middleman tiers to increase farmer farmgate realization and lower consumer prices with consolidated collection and routing.
          </p>
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4A24E] block mb-1.5">
            Key Architecture Modules
          </span>
          <ul className="space-y-1 text-[11px] text-stone-300">
            <li>• Direct Farmer & FPO Listing Engine</li>
            <li>• Unified Consumer & Bulk Buyer Marketplace</li>
            <li>• Holt-Winters & Regression Price Forecast</li>
            <li>• Nearest-Neighbor TSP Route Optimization</li>
          </ul>
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4A24E] block mb-1.5">
            Government Compliance & Standard
          </span>
          <p className="text-[11px] text-stone-300 leading-relaxed">
            Ministry of Consumer Affairs, Food & Public Distribution (DoCA). Designed for Smart India Hackathon Problem Statement 26033.
          </p>
          <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI FORECASTING & LOGISTICS ENGINE ONLINE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-400 font-mono gap-2">
        <span>© 2026 KisanDirect • DoCA PS 26033 Implementation</span>
        <span>Zero Middleman Commissions • Transparent Agricultural Trade</span>
      </div>
    </footer>
  );
};
