import { ProduceListing, MarketplaceOrder } from '../types';

export const INITIAL_PRODUCE_LISTINGS: ProduceListing[] = [
  {
    id: 'list-201',
    farmerId: 'farmer-101',
    farmerName: 'Rajbir Singh Malik',
    farmerPhone: '+91 98120 34567',
    isFPO: true,
    fpoName: 'Karnal Wheat Growers Producer Co.',
    cropId: 'wheat',
    cropName: 'Karnal HD Wheat (Milling Grade)',
    variety: 'HD-3086 Bold Grain',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 250,
    minOrderQuintals: 5,
    askingPricePerQuintal: 3000, // ₹30/kg direct farmgate (est., ~15% above mandi)
    mandiMiddlemanPricePerQuintal: 2600, // Haryana mandi modal rate, ~₹26/kg (sourced Aug 2026)
    retailConsumerPricePerQuintal: 4300, // Retail flour-grade wheat ~₹43/kg (est.)
    harvestDate: '2026-04-18',
    location: {
      village: 'Nilokheri',
      district: 'Karnal',
      state: 'Haryana',
      lat: 29.8181,
      lng: 76.9998,
    },
    pickupPointName: 'Karnal Grain Aggregation Point, Nilokheri',
    createdAt: '2026-09-01T09:00:00Z',
    status: 'active',
  },
  {
    id: 'list-202',
    farmerId: 'farmer-102',
    farmerName: 'Om Parkash Dalal',
    farmerPhone: '+91 94162 78901',
    isFPO: false,
    cropId: 'mustard',
    cropName: 'Hisar Sarson (Mustard)',
    variety: 'RH-30 High Oil Content',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 80,
    minOrderQuintals: 2,
    askingPricePerQuintal: 7450, // ₹74.50/kg direct farmgate (est.)
    mandiMiddlemanPricePerQuintal: 6450, // Haryana APMC modal rate, ~₹64.50/kg (sourced 2026)
    retailConsumerPricePerQuintal: 10650, // Retail mustard seed/oil-linked rate (est.)
    harvestDate: '2026-03-15',
    location: {
      village: 'Barwala',
      district: 'Hisar',
      state: 'Haryana',
      lat: 29.3667,
      lng: 75.9167,
    },
    pickupPointName: 'Hisar Oilseeds Collection Depot, Barwala',
    createdAt: '2026-09-02T10:00:00Z',
    status: 'active',
  },
  {
    id: 'list-203',
    farmerId: 'farmer-103',
    farmerName: 'Suresh Kumar Sihag',
    farmerPhone: '+91 98962 45123',
    isFPO: true,
    fpoName: 'Sirsa Cotton & Narma Growers Federation',
    cropId: 'cotton',
    cropName: 'Sirsa Narma Cotton (Bt Hybrid)',
    variety: 'Bt Cotton Hybrid (RCH-2)',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 95,
    minOrderQuintals: 3,
    askingPricePerQuintal: 7500, // ₹75/kg direct farmgate (est.)
    mandiMiddlemanPricePerQuintal: 6115, // Haryana mandi avg, ~₹61.15/kg (sourced 2026, Adampur APMC)
    retailConsumerPricePerQuintal: 11300, // Processed cotton/yarn-linked index (est.)
    harvestDate: '2026-09-05',
    location: {
      village: 'Ellenabad',
      district: 'Sirsa',
      state: 'Haryana',
      lat: 29.4500,
      lng: 74.6667,
    },
    pickupPointName: 'Sirsa Cotton Ginning & Logistics Hub, Ellenabad',
    createdAt: '2026-09-06T08:30:00Z',
    status: 'active',
  },
  {
    id: 'list-204',
    farmerId: 'farmer-104',
    farmerName: 'Kuldeep Singh Redhu',
    farmerPhone: '+91 97290 55612',
    isFPO: true,
    fpoName: 'Taraori Basmati Exporters FPO',
    cropId: 'rice_basmati',
    cropName: 'Karnal Basmati Rice (Pusa 1121)',
    variety: 'Pusa 1121 Extra Long Grain',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 140,
    minOrderQuintals: 5,
    askingPricePerQuintal: 8600, // ₹86/kg direct-from-mill rate (est.)
    mandiMiddlemanPricePerQuintal: 7800, // 1121 raw basmati wholesale, ₹7,200–8,800/quintal range (sourced)
    retailConsumerPricePerQuintal: 10100, // Karnal retail 1121 medium grain, ~₹101/kg (sourced Jul 2026)
    harvestDate: '2026-09-08',
    location: {
      village: 'Taraori',
      district: 'Karnal',
      state: 'Haryana',
      lat: 29.8408,
      lng: 76.9469,
    },
    pickupPointName: 'Taraori Basmati Rice Mill Depot, Karnal',
    createdAt: '2026-09-09T07:45:00Z',
    status: 'active',
  },
  {
    id: 'list-205',
    farmerId: 'farmer-105',
    farmerName: 'Mahender Singh Punia',
    farmerPhone: '+91 94674 32109',
    isFPO: false,
    cropId: 'bajra',
    cropName: 'Bhiwani Bajra (Pearl Millet)',
    variety: 'HHB-67 Improved',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 60,
    minOrderQuintals: 2,
    askingPricePerQuintal: 2600, // ₹26/kg direct farmgate (est.)
    mandiMiddlemanPricePerQuintal: 2270, // Haryana mandi rate, ~₹22.70/kg (sourced 2026; MSP ₹2,200 + BBY bonus ≈ ₹2,500)
    retailConsumerPricePerQuintal: 3550, // Retail bajra grain (est.)
    harvestDate: '2026-09-06',
    location: {
      village: 'Loharu',
      district: 'Bhiwani',
      state: 'Haryana',
      lat: 28.4333,
      lng: 75.8000,
    },
    pickupPointName: 'Bhiwani Bajra Aggregation Yard, Loharu',
    createdAt: '2026-09-07T11:15:00Z',
    status: 'active',
  },
];

export const INITIAL_MARKETPLACE_ORDERS: MarketplaceOrder[] = [];

