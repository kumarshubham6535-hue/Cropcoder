import React, { useState, useMemo } from 'react';
import { ProduceListing, MarketplaceOrder, GeoPoint } from '../types';
import { LOGISTICS_CORRIDORS, optimizeLogisticsRoute, optimizeCustomRoute } from '../services/logisticsEngine';
import { getCoordinatesForLocation } from '../data/districtCoordinates';
import { Navigation, Truck, MapPin, TrendingDown, Clock, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw, Activity } from 'lucide-react';

interface LogisticsOptimizerViewProps {
  listings?: ProduceListing[];
  orders?: MarketplaceOrder[];
}

export const LogisticsOptimizerView: React.FC<LogisticsOptimizerViewProps> = ({ listings = [], orders = [] }) => {
  const [selectedCorridorKey, setSelectedCorridorKey] = useState<string>('maharashtra_western');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Derive dynamic live network from real active listings and orders
  const liveNetworkData = useMemo(() => {
    const activeListings = listings.filter((l) => l.status === 'active' && l.quantityAvailableQuintals > 0);
    const activeOrders = orders.filter((o) => o.status !== 'cancelled');

    // Group listings by district as pickup points
    const pickupMap = new Map<string, { name: string; district: string; lat: number; lng: number; cargo: number }>();
    activeListings.forEach((listing, index) => {
      const d = listing.location?.district || `District ${index + 1}`;
      const existing = pickupMap.get(d);
      const coords = listing.location?.lat && listing.location?.lng 
        ? { lat: listing.location.lat, lng: listing.location.lng }
        : getCoordinatesForLocation(d, listing.location?.state || 'Maharashtra');
      
      if (existing) {
        existing.cargo += listing.quantityAvailableQuintals;
      } else {
        pickupMap.set(d, {
          name: `${listing.pickupPointName || `${d} Farm Hub`} (${listing.cropName})`,
          district: d,
          lat: coords.lat,
          lng: coords.lng,
          cargo: listing.quantityAvailableQuintals
        });
      }
    });

    const livePickups: GeoPoint[] = Array.from(pickupMap.entries()).slice(0, 6).map(([district, data], idx) => ({
      id: `live-p-${idx + 1}`,
      label: `Farm Hub ${idx + 1}`,
      name: data.name,
      type: 'farm_pickup' as const,
      lat: data.lat,
      lng: data.lng,
      district: data.district,
      cargoQuintals: Math.max(10, data.cargo)
    }));

    // Group orders by delivery district as dropoff points
    const dropoffMap = new Map<string, { name: string; district: string; lat: number; lng: number; cargo: number }>();
    activeOrders.forEach((order, index) => {
      const d = order.deliveryAddress?.district || `Metro Hub ${index + 1}`;
      const existing = dropoffMap.get(d);
      const coords = getCoordinatesForLocation(d, order.deliveryAddress?.state || 'Maharashtra');
      if (existing) {
        existing.cargo += order.quantityQuintals;
      } else {
        dropoffMap.set(d, {
          name: `${order.buyerName} (${d} Delivery Point)`,
          district: d,
          lat: coords.lat,
          lng: coords.lng,
          cargo: order.quantityQuintals
        });
      }
    });

    // If no orders yet, establish central consumption distribution points
    let liveDropoffs: GeoPoint[] = Array.from(dropoffMap.entries()).map(([district, data], idx) => ({
      id: `live-d-${idx + 1}`,
      label: `Drop ${idx + 1}`,
      name: data.name,
      type: 'consumer_drop' as const,
      lat: data.lat,
      lng: data.lng,
      district: data.district,
      cargoQuintals: Math.max(10, data.cargo)
    }));

    if (liveDropoffs.length === 0) {
      liveDropoffs = [
        { id: 'ld-1', label: 'Drop 1', name: 'Pune Regional Retail Terminal', type: 'consumer_drop', lat: 18.5204, lng: 73.8567, district: 'Pune', cargoQuintals: 65 },
        { id: 'ld-2', label: 'Drop 2', name: 'Navi Mumbai Direct Consumer Depot', type: 'bulk_depot', lat: 19.0760, lng: 72.8777, district: 'Mumbai', cargoQuintals: 90 }
      ];
    }

    const liveHub: GeoPoint = {
      id: 'live-hub-central',
      label: 'Hub',
      name: 'KisanDirect Regional Consolidation & Sorting Hub',
      type: 'aggregation_hub',
      lat: livePickups[0]?.lat ? livePickups[0].lat - 0.5 : 19.1235,
      lng: livePickups[0]?.lng ? livePickups[0].lng - 0.2 : 73.9781,
      district: livePickups[0]?.district || 'Pune',
      cargoQuintals: 0
    };

    return {
      hub: liveHub,
      pickups: livePickups.length > 0 ? livePickups : LOGISTICS_CORRIDORS.maharashtra_western.pickups,
      dropoffs: liveDropoffs
    };
  }, [listings, orders]);

  const isLiveNetwork = selectedCorridorKey === 'live_network';

  const routeResult = useMemo(() => {
    if (isLiveNetwork) {
      return optimizeCustomRoute(liveNetworkData.hub, liveNetworkData.pickups, liveNetworkData.dropoffs, 'LIVE');
    }
    return optimizeLogisticsRoute(selectedCorridorKey);
  }, [selectedCorridorKey, isLiveNetwork, liveNetworkData]);

  const corridor = isLiveNetwork 
    ? { name: 'Live Marketplace Network (Active Farmgate Lots & Dispatches)', state: 'Live System', pickups: liveNetworkData.pickups, dropoffs: liveNetworkData.dropoffs, hub: liveNetworkData.hub }
    : (LOGISTICS_CORRIDORS[selectedCorridorKey] || LOGISTICS_CORRIDORS.maharashtra_western);

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

  // Dynamic calculations: benchmarked against industry solo-trip baseline (₹320/Qtl or ₹3.20/kg)
  const naiveCostPerQtl = 320;
  const costReductionPct = Math.max(
    0,
    Math.round(((naiveCostPerQtl - routeResult.logisticsCostPerQuintalInr) / naiveCostPerQtl) * 100)
  );
  const distanceSavedPct = routeResult.unoptimizedDistanceKm > 0
    ? Math.round((routeResult.distanceSavedKm / routeResult.unoptimizedDistanceKm) * 100)
    : 0;
  const optimizedCostPerKg = (routeResult.logisticsCostPerQuintalInr / 100).toFixed(2);

  return (
    <div id="logistics-optimizer-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-stone-800">
      {/* Top Banner */}
      <div className="bg-stone-50 p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#1B4332] text-xs font-mono font-bold mb-1">
            <span>Nearest-Neighbor Traveling Salesperson Problem (TSP) Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            AI Multi-Farm Route Optimization Engine
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Consolidates individual farm trips into an optimized collection run, eliminating empty return miles and lowering freight costs from the ₹3.20/kg (₹320/Qtl) solo baseline down to ₹{optimizedCostPerKg}/kg (₹{routeResult.logisticsCostPerQuintalInr}/Qtl) — a {costReductionPct}% reduction in logistics overhead.
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
            <option value="live_network">⚡ Live Marketplace Network ({listings.length} Active Lots)</option>
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
              <span className="text-[10px] text-emerald-700 font-bold block">-{costReductionPct}% Logistics Cost</span>
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
          <p className="text-stone-400 text-[11px] mt-0.5">{distanceSavedPct}% reduction in empty miles</p>
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
