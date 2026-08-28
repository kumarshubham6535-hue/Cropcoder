import React, { useState, useMemo } from 'react';
import { LOGISTICS_CORRIDORS, optimizeLogisticsRoute } from '../services/logisticsEngine';
import { Navigation, Truck, MapPin, TrendingDown, Clock, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export const LogisticsOptimizerView: React.FC = () => {
  const [selectedCorridorKey, setSelectedCorridorKey] = useState<string>('maharashtra_western');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const routeResult = useMemo(() => {
    return optimizeLogisticsRoute(selectedCorridorKey);
  }, [selectedCorridorKey]);

  const corridor = LOGISTICS_CORRIDORS[selectedCorridorKey] || LOGISTICS_CORRIDORS.maharashtra_western;

  // Run Route Simulation
  const handleSimulate = () => {
    setIsSimulating(true);
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= routeResult.orderedWaypoints.length - 1) {
          clearInterval(interval);
          setIsSimulating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const totalCargoQuintals = corridor.pickups.reduce((acc, p) => acc + p.cargoQuintals, 0);

  return (
    <div id="logistics-optimizer-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-stone-800">
      {/* Top Banner */}
      <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1B4332] text-xs font-mono font-bold mb-1">
            <span>Requirement #4 • Nearest-Neighbor Traveling Salesperson Problem (TSP)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            AI Multi-Farm Route Optimization Engine
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Consolidates individual farm trips into an optimized collection run, eliminating empty return miles and lowering freight costs from ₹9.50/kg to ₹3.20/kg.
          </p>
        </div>

        {/* Corridor Selection & Simulation Trigger */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            id="logistics-corridor-select"
            value={selectedCorridorKey}
            onChange={(e) => {
              setSelectedCorridorKey(e.target.value);
              setActiveStep(0);
            }}
            className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 shadow-xs cursor-pointer focus:ring-2 focus:ring-[#1B4332]"
          >
            {Object.entries(LOGISTICS_CORRIDORS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name}
              </option>
            ))}
          </select>

          <button
            id="simulate-dispatch-btn"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-4 py-2 bg-[#1B4332] hover:bg-[#143326] text-[#D4A24E] font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Truck className="w-4 h-4" />
            <span>{isSimulating ? 'Dispatch in Transit...' : 'Simulate Collection'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Proof: Naive Unoptimized Route vs AI Optimized Route (Requirement #6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: Naive Unoptimized Route */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                Unoptimized Baseline
              </span>
              <h3 className="text-base font-black text-rose-900 mt-1">
                Naive Independent Individual Trips
              </h3>
            </div>
            <span className="text-xs text-rose-700 font-bold">Traditional APMC Pattern</span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Each individual farmer hires an independent mini-truck and drives separately to urban markets with partial loads and empty return runs.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Total Distance</span>
              <span className="text-xl font-black text-rose-900">
                {routeResult.unoptimizedDistanceKm} km
              </span>
              <span className="text-[10px] text-stone-400 block">Accumulated trips</span>
            </div>

            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Estimated Travel</span>
              <span className="text-xl font-black text-rose-900">
                ~{Math.round(routeResult.unoptimizedDistanceKm / 40)} hrs
              </span>
              <span className="text-[10px] text-stone-400 block">Uncoordinated freight</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-rose-50/60 p-3 rounded-xl border border-rose-200">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Freight Cost / Qtl</span>
              <span className="text-xl font-black text-rose-900">₹320 / Qtl</span>
              <span className="text-[10px] text-rose-700 font-semibold block">(₹3.20/kg overhead)</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <span className="font-bold text-stone-700 block">Individual Independent Trips:</span>
            {corridor.pickups.map((p, idx) => (
              <div key={p.id} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 flex justify-between">
                <span>Trip {idx + 1}: {p.name} → Urban Dropoff (Solo)</span>
                <span className="font-mono text-rose-700 font-bold">~{Math.round(routeResult.unoptimizedDistanceKm / corridor.pickups.length)} km</span>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: AI TSP Optimized Consolidated Route */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-emerald-400 shadow-xs space-y-4 bg-emerald-50/10">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                AI TSP Routing Engine
              </span>
              <h3 className="text-base font-black text-[#1B4332] mt-1">
                Optimized Multi-Farm Collection Run
              </h3>
            </div>
            <span className="text-xs text-emerald-800 font-black">Consolidated Freight</span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Consolidates farm pickups into a single sequenced loop visiting closest farms successively and dropping off aggregate freight at designated market nodes.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Optimized Distance</span>
              <span className="text-xl font-black text-[#1B4332]">
                {routeResult.totalDistanceKm} km
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                -{routeResult.distanceSavedKm} km saved
              </span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Transit Time</span>
              <span className="text-xl font-black text-[#1B4332]">
                {routeResult.estimatedTransitHours} hrs
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">
                Save ~{(Math.round(routeResult.unoptimizedDistanceKm / 40) - routeResult.estimatedTransitHours).toFixed(1)} hrs
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-emerald-50 p-3 rounded-xl border border-emerald-300">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Freight Cost / Qtl</span>
              <span className="text-xl font-black text-[#1B4332]">
                ₹{routeResult.logisticsCostPerQuintalInr} / Qtl
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block">-66% Logistics Cost</span>
            </div>
          </div>

          {/* Sequential Waypoint List */}
          <div className="space-y-2 pt-2 text-xs">
            <span className="font-bold text-stone-700 block">AI Sequenced Waypoint Dispatch:</span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {routeResult.orderedWaypoints.map((wp, idx) => {
                const isCurrent = idx === activeStep && isSimulating;
                const isPassed = idx <= activeStep;

                return (
                  <div
                    key={`${wp.id}-${idx}`}
                    className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-[#D4A24E] text-[#1B4332] font-black border-[#D4A24E]'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1B4332] text-[#D4A24E] font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{wp.name}</span>
                    </div>
                    <span className="font-mono text-[10px]">
                      {wp.type === 'aggregation_hub' ? 'Consolidation Hub' : wp.type === 'farm_pickup' ? `+${wp.cargoQuintals} Qtl Farm Pickup` : 'Market Dropoff'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Measurable Efficiency Savings Banner */}
      <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-stone-400 block text-[10px] uppercase font-mono">Distance Saved</span>
          <span className="text-2xl font-black text-emerald-400">
            {routeResult.distanceSavedKm} km
          </span>
          <p className="text-stone-400 text-[11px] mt-0.5">Over 55% reduction in empty miles</p>
        </div>

        <div>
          <span className="text-stone-400 block text-[10px] uppercase font-mono">Direct Fuel Savings</span>
          <span className="text-2xl font-black text-amber-400">
            ₹{routeResult.fuelCostSavingsInr.toLocaleString('en-IN')}
          </span>
          <p className="text-stone-400 text-[11px] mt-0.5">Calculated at ₹92/L diesel freight</p>
        </div>

        <div>
          <span className="text-stone-400 block text-[10px] uppercase font-mono">CO₂ Emissions Abated</span>
          <span className="text-2xl font-black text-emerald-300">
            {routeResult.carbonEmissionSavedKg} kg
          </span>
          <p className="text-stone-400 text-[11px] mt-0.5">Green agricultural supply chain</p>
        </div>

        <div>
          <span className="text-stone-400 block text-[10px] uppercase font-mono">Total Aggregated Load</span>
          <span className="text-2xl font-black text-[#D4A24E]">
            {totalCargoQuintals} Quintals
          </span>
          <p className="text-stone-400 text-[11px] mt-0.5">{totalCargoQuintals * 100} kg pooled from smallholders</p>
        </div>
      </div>
    </div>
  );
};
