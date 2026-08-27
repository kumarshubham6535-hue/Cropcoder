import { GeoPoint, RouteOptimizationResult } from '../types';

/**
 * Calculates Haversine distance in Kilometers between two lat/lng points
 */
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Preset Indian Agricultural Hub Networks
export const LOGISTICS_CORRIDORS: Record<string, {
  name: string;
  state: string;
  hub: GeoPoint;
  pickups: GeoPoint[];
  dropoffs: GeoPoint[];
}> = {
  maharashtra_western: {
    name: 'Maharashtra Western Agro Corridor (Nashik-Pune-Mumbai)',
    state: 'Maharashtra',
    hub: {
      id: 'hub-narayangaon',
      label: 'Hub',
      name: 'Narayangaon Cold Aggregation Depot',
      type: 'aggregation_hub',
      lat: 19.1235,
      lng: 73.9781,
      district: 'Pune',
      cargoQuintals: 0
    },
    pickups: [
      { id: 'p1', label: 'Farm A', name: 'Lasalgaon Onion Farm (Rameshwar)', type: 'farm_pickup', lat: 20.1448, lng: 74.2255, district: 'Nashik', cargoQuintals: 45 },
      { id: 'p2', label: 'Farm B', name: 'Pimpalgaon Tomato Cluster', type: 'farm_pickup', lat: 20.1706, lng: 73.9856, district: 'Nashik', cargoQuintals: 30 },
      { id: 'p3', label: 'Farm C', name: 'Tasgaon Grape & Tomato FPO', type: 'farm_pickup', lat: 17.0344, lng: 74.6042, district: 'Sangli', cargoQuintals: 40 }
    ],
    dropoffs: [
      { id: 'd1', label: 'Drop 1', name: 'Kothrud Direct Consumer Mart', type: 'consumer_drop', lat: 18.5074, lng: 73.8077, district: 'Pune', cargoQuintals: 35 },
      { id: 'd2', label: 'Drop 2', name: 'Vashi APMC Direct Food Terminal', type: 'bulk_depot', lat: 19.0771, lng: 72.9986, district: 'Navi Mumbai', cargoQuintals: 80 }
    ]
  },
  north_yamuna_expressway: {
    name: 'North NCR Yamuna Expressway Corridor (Agra-Karnal-Noida-Delhi)',
    state: 'Uttar Pradesh / NCR',
    hub: {
      id: 'hub-mathura',
      label: 'Hub',
      name: 'Mathura Central Cold Consolidation Terminal',
      type: 'aggregation_hub',
      lat: 27.4924,
      lng: 77.6737,
      district: 'Mathura',
      cargoQuintals: 0
    },
    pickups: [
      { id: 'p1', label: 'Farm A', name: 'Khandauli Potato Belt (Baldev)', type: 'farm_pickup', lat: 27.2798, lng: 78.0772, district: 'Agra', cargoQuintals: 120 },
      { id: 'p2', label: 'Farm B', name: 'Bharatpur Mustard Seed Farms', type: 'farm_pickup', lat: 27.3195, lng: 77.3756, district: 'Bharatpur', cargoQuintals: 85 },
      { id: 'p3', label: 'Farm C', name: 'Nilokheri Basmati FPO Cluster', type: 'farm_pickup', lat: 29.8329, lng: 76.9208, district: 'Karnal', cargoQuintals: 100 }
    ],
    dropoffs: [
      { id: 'd1', label: 'Drop 1', name: 'Noida Sector 18 Retail Distribution', type: 'bulk_depot', lat: 28.5708, lng: 77.3271, district: 'Noida', cargoQuintals: 150 },
      { id: 'd2', label: 'Drop 2', name: 'Central Delhi Govt Stabilization Godown', type: 'consumer_drop', lat: 28.6139, lng: 77.2090, district: 'New Delhi', cargoQuintals: 155 }
    ]
  }
};

export const SAMPLE_LOGISTICS_ROUTES = LOGISTICS_CORRIDORS;

/**
 * Optimizes route using Nearest-Neighbor TSP heuristic
 */
export function optimizeLogisticsRoute(corridorKey = 'maharashtra_western'): RouteOptimizationResult {
  const corridor = LOGISTICS_CORRIDORS[corridorKey] || LOGISTICS_CORRIDORS.maharashtra_western;
  const hub = corridor.hub;
  const pickups = [...corridor.pickups];
  const dropoffs = [...corridor.dropoffs];

  // 1. Calculate Unoptimized Naive Distance:
  // Each individual farmer traveling separately to each buyer independently
  let unoptimizedDistanceKm = 0;
  for (const p of pickups) {
    for (const d of dropoffs) {
      unoptimizedDistanceKm += calculateHaversineDistanceKm(p.lat, p.lng, d.lat, d.lng) * 1.35; // road curvature multiplier
    }
  }

  // 2. Nearest Neighbor Sequencing from Hub -> Pickups -> Hub -> Dropoffs
  const orderedWaypoints: GeoPoint[] = [hub];
  const remainingPickups = [...pickups];
  let currentPos = hub;

  // Visit closest pickup successively
  while (remainingPickups.length > 0) {
    let nearestIdx = 0;
    let minD = Infinity;
    for (let i = 0; i < remainingPickups.length; i++) {
      const d = calculateHaversineDistanceKm(currentPos.lat, currentPos.lng, remainingPickups[i].lat, remainingPickups[i].lng);
      if (d < minD) {
        minD = d;
        nearestIdx = i;
      }
    }
    const nextNode = remainingPickups.splice(nearestIdx, 1)[0];
    orderedWaypoints.push(nextNode);
    currentPos = nextNode;
  }

  // Return to hub for consolidation
  orderedWaypoints.push(hub);
  currentPos = hub;

  // Visit dropoffs efficiently
  const remainingDrops = [...dropoffs];
  while (remainingDrops.length > 0) {
    let nearestIdx = 0;
    let minD = Infinity;
    for (let i = 0; i < remainingDrops.length; i++) {
      const d = calculateHaversineDistanceKm(currentPos.lat, currentPos.lng, remainingDrops[i].lat, remainingDrops[i].lng);
      if (d < minD) {
        minD = d;
        nearestIdx = i;
      }
    }
    const nextNode = remainingDrops.splice(nearestIdx, 1)[0];
    orderedWaypoints.push(nextNode);
    currentPos = nextNode;
  }

  // Calculate actual optimized road distance
  let totalOptimizedKm = 0;
  for (let i = 0; i < orderedWaypoints.length - 1; i++) {
    const d = calculateHaversineDistanceKm(
      orderedWaypoints[i].lat,
      orderedWaypoints[i].lng,
      orderedWaypoints[i + 1].lat,
      orderedWaypoints[i + 1].lng
    );
    totalOptimizedKm += d * 1.25; // standard road factor
  }

  totalOptimizedKm = Math.round(totalOptimizedKm);
  unoptimizedDistanceKm = Math.round(unoptimizedDistanceKm);
  const distanceSavedKm = Math.max(0, unoptimizedDistanceKm - totalOptimizedKm);

  // Transit time at average 45 km/h freight speed
  const transitHours = Math.round((totalOptimizedKm / 45) * 10) / 10;

  // Diesel fuel savings (Avg freight truck: 4.5 km/L @ ₹92/L)
  const litersSaved = distanceSavedKm / 4.5;
  const fuelSavingsInr = Math.round(litersSaved * 92);

  // Carbon emissions: 2.68 kg CO2 per liter diesel
  const carbonEmissionSavedKg = Math.round(litersSaved * 2.68);

  // Consolidated logistics cost per quintal
  const totalCargo = pickups.reduce((acc, p) => acc + p.cargoQuintals, 0);
  const logisticsCostPerQuintalInr = Math.round(((totalOptimizedKm * 18) / (totalCargo || 1)) + 40);

  return {
    routeId: `OPT-${corridorKey}-${Date.now().toString().slice(-4)}`,
    originHub: hub,
    pickups,
    dropoffs,
    orderedWaypoints,
    totalDistanceKm: totalOptimizedKm,
    unoptimizedDistanceKm,
    distanceSavedKm,
    estimatedTransitHours: transitHours,
    fuelCostSavingsInr: fuelSavingsInr,
    carbonEmissionSavedKg,
    logisticsCostPerQuintalInr
  };
}

export const getOptimizedRouteForCluster = optimizeLogisticsRoute;
