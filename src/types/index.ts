// KisanDirect - Direct Farm-to-Buyer Marketplace & Logistics
// Agricultural Supply Chain & Direct Exchange Platform

export type UserRole = 'farmer' | 'buyer';

export type QualityGrade = 'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C (Processing)';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  isFPO: boolean;
  fpoName?: string;
  state: string;
  district: string;
  village: string;
  primaryCrops: string[];
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  isFPO: boolean;
  fpoName?: string;
  cropId: string;
  cropName: string;
  variety: string;
  grade: QualityGrade;
  quantityAvailableQuintals: number;
  minOrderQuintals: number;
  askingPricePerQuintal: number;
  mandiMiddlemanPricePerQuintal: number; // APMC middleman benchmark
  retailConsumerPricePerQuintal: number; // Traditional retail chain price
  harvestDate: string;
  location: {
    village: string;
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  pickupPointName: string;
  createdAt: string;
  status: 'active' | 'sold_out';
}

export type OrderStatus = 'confirmed' | 'aggregated' | 'in_transit' | 'delivered';

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  listingId: string;
  cropName: string;
  farmerName: string;
  farmerPhone: string;
  farmerPickupLocation: string;
  buyerName: string;
  buyerPhone: string;
  buyerType: 'individual' | 'bulk';
  deliveryAddress: {
    district: string;
    state: string;
    addressLine: string;
    pincode: string;
  };
  quantityQuintals: number;
  pricePerQuintal: number;
  produceTotal: number;
  logisticsFee: number;
  totalAmount: number;
  traditionalChainCost: number; // what consumer would pay in middleman system
  consumerSavings: number; // traditionalChainCost - totalAmount
  farmerEarnings: number;
  farmerGainVsMandi: number; // farmerEarnings - (quantity * mandiPrice)
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryDays: number;
  logisticsStep: string;
  isScheduledPickup: boolean;
  scheduledDate?: string;
}

// AI Demand & Pricing Forecasting Types
export interface HistoricalDataPoint {
  month: string;
  avgMandiPrice: number;
  directFarmerPrice: number;
  consumerRetailPrice: number;
  demandVolumeQuintals: number;
  supplyVolumeQuintals: number;
  arrivalTons: number;
}

export interface CropForecastResult {
  cropId: string;
  cropNameEn: string;
  cropNameHi?: string;
  cropIcon?: string;
  state: string;
  district: string;
  currentMandiPrice: number;
  predictedDemandQuintals: number;
  demandTrend: 'rising' | 'steady' | 'declining';
  suggestedFarmerPrice: number;
  recommendedConsumerPrice: number;
  farmerMarginGainPercent: number;
  consumerPriceDropPercent: number;
  confidenceScore: number;
  seasonalNotesEn?: string;
  seasonalNotesHi?: string;
  next3MonthsForecast: {
    month: string;
    projectedDemand: number;
    recommendedPrice: number;
    projectedSupply?: number;
  }[];
  historicalData: HistoricalDataPoint[];
}

// Logistics & Route Optimization Types
export type GeoPointType = 'farm_pickup' | 'aggregation_hub' | 'consumer_drop' | 'bulk_depot' | 'delivery_point';

export interface GeoPoint {
  id: string;
  label: string;
  name: string;
  type: GeoPointType;
  lat: number;
  lng: number;
  district: string;
  cargoQuintals: number;
}

export interface RouteOptimizationResult {
  routeId: string;
  originHub: GeoPoint;
  pickups: GeoPoint[];
  dropoffs: GeoPoint[];
  orderedWaypoints: GeoPoint[];
  totalDistanceKm: number;
  unoptimizedDistanceKm: number;
  distanceSavedKm: number;
  estimatedTransitHours: number;
  fuelCostSavingsInr: number;
  carbonEmissionSavedKg: number;
  logisticsCostPerQuintalInr: number;
}
