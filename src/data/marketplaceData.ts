import { ProduceListing, MarketplaceOrder } from '../types';

export const INITIAL_PRODUCE_LISTINGS: ProduceListing[] = [
  {
    id: 'list-101',
    farmerId: 'farmer-01',
    farmerName: 'Rameshwar Patil',
    farmerPhone: '+91 98224 51203',
    isFPO: true,
    fpoName: 'Godavari Sahyadri Farmer Producer Co.',
    cropId: 'onion',
    cropName: 'Nashik Red Onion',
    variety: 'Garwa / High-Solid Red',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 45,
    minOrderQuintals: 1,
    askingPricePerQuintal: 2200, // ₹22/kg
    mandiMiddlemanPricePerQuintal: 1350, // Middleman offers only ₹13.50/kg
    retailConsumerPricePerQuintal: 3600, // Traditional city retail shop price ₹36/kg
    harvestDate: '2026-08-18',
    location: {
      village: 'Lasalgaon',
      district: 'Nashik',
      state: 'Maharashtra',
      lat: 20.1448,
      lng: 74.2255,
    },
    pickupPointName: 'Godavari FPO Aggregation Point, Lasalgaon',
    createdAt: '2026-08-20T08:30:00Z',
    status: 'active',
  },
  {
    id: 'list-102',
    farmerId: 'farmer-02',
    farmerName: 'Baldev Singh Dhillon',
    farmerPhone: '+91 98141 87211',
    isFPO: false,
    cropId: 'potato',
    cropName: 'Agra Kufri Pukhraj Potatoes',
    variety: 'Kufri Pukhraj (Oval)',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 120,
    minOrderQuintals: 2,
    askingPricePerQuintal: 1450, // ₹14.50/kg
    mandiMiddlemanPricePerQuintal: 850, // Mandi middleman gives ₹8.50/kg
    retailConsumerPricePerQuintal: 2400, // Consumer pays ₹24/kg in retail
    harvestDate: '2026-08-21',
    location: {
      village: 'Khandauli',
      district: 'Agra',
      state: 'Uttar Pradesh',
      lat: 27.2798,
      lng: 78.0772,
    },
    pickupPointName: 'Khandauli Cold Aggregation Point, Agra',
    createdAt: '2026-08-21T10:15:00Z',
    status: 'active',
  },
  {
    id: 'list-103',
    farmerId: 'farmer-03',
    farmerName: 'Venkateshwarlu Reddy',
    farmerPhone: '+91 94401 29845',
    isFPO: true,
    fpoName: 'Andhra Spice Growers Federation',
    cropId: 'tomato',
    cropName: 'Kolar Hybrid Fresh Tomatoes',
    variety: 'Abhinav Firm Round',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 30,
    minOrderQuintals: 1,
    askingPricePerQuintal: 1950, // ₹19.50/kg
    mandiMiddlemanPricePerQuintal: 1200, // Mandi gives ₹12.00/kg
    retailConsumerPricePerQuintal: 3400, // Retail price ₹34.00/kg
    harvestDate: '2026-08-23',
    location: {
      village: 'Malur',
      district: 'Kolar',
      state: 'Karnataka',
      lat: 13.1378,
      lng: 78.1291,
    },
    pickupPointName: 'Kolar Agro Collection Center, Malur',
    createdAt: '2026-08-23T06:40:00Z',
    status: 'active',
  },
  {
    id: 'list-104',
    farmerId: 'farmer-04',
    farmerName: 'Harpreet Singh Sandhu',
    farmerPhone: '+91 98760 11223',
    isFPO: true,
    fpoName: 'Karnal Organic Grain Producers',
    cropId: 'wheat',
    cropName: 'Sehore Sharbati Wheat',
    variety: 'Sharbati Golden Grain',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 200,
    minOrderQuintals: 5,
    askingPricePerQuintal: 3100, // ₹31/kg
    mandiMiddlemanPricePerQuintal: 2350, // Mandi gives ₹23.50/kg
    retailConsumerPricePerQuintal: 4600, // Retail shop gives ₹46/kg
    harvestDate: '2026-08-19',
    location: {
      village: 'Ashta',
      district: 'Sehore',
      state: 'Madhya Pradesh',
      lat: 23.2032,
      lng: 77.0844,
    },
    pickupPointName: 'Sehore Grain Depot Gate 2',
    createdAt: '2026-08-23T11:00:00Z',
    status: 'active',
  }
];

export const INITIAL_MARKETPLACE_ORDERS: MarketplaceOrder[] = [
  {
    id: 'ord-901',
    orderNumber: 'KD-2026-08-901',
    listingId: 'list-102',
    cropName: 'Agra Kufri Pukhraj Potatoes',
    farmerName: 'Baldev Singh Dhillon',
    farmerPhone: '+91 98141 87211',
    farmerPickupLocation: 'Khandauli Cold Aggregation Point, Agra',
    buyerName: 'Aarav Sharma (FreshBasket Superstores)',
    buyerPhone: '+91 98110 44556',
    buyerType: 'bulk',
    deliveryAddress: {
      addressLine: 'Sector 18 Wholesale Hub',
      district: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
    },
    quantityQuintals: 20, // 20 Quintals (2,000 kg)
    pricePerQuintal: 1450,
    produceTotal: 29000,
    logisticsFee: 1850,
    totalAmount: 30850,
    traditionalChainCost: 48000, // 20 * 2400 in middleman chain
    consumerSavings: 17150, // 48000 - 30850
    farmerEarnings: 29000,
    farmerGainVsMandi: 12000, // 29000 - (20 * 850 = 17000)
    status: 'in_transit',
    createdAt: '2026-08-25T14:30:00Z',
    estimatedDeliveryDays: 2,
    logisticsStep: 'Consolidated pickup complete • Transit to Sector 18 Noida Hub',
    isScheduledPickup: true,
    scheduledDate: '2026-08-27',
  },
  {
    id: 'ord-902',
    orderNumber: 'KD-2026-08-902',
    listingId: 'list-101',
    cropName: 'Nashik Red Onion',
    farmerName: 'Rameshwar Patil (Godavari FPO)',
    farmerPhone: '+91 98224 51203',
    farmerPickupLocation: 'Godavari FPO Aggregation Point, Lasalgaon',
    buyerName: 'Sunita Verma',
    buyerPhone: '+91 99302 77102',
    buyerType: 'individual',
    deliveryAddress: {
      addressLine: 'Flat 402, Green Meadows, Kothrud',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
    },
    quantityQuintals: 1, // 1 Quintal (100 kg)
    pricePerQuintal: 2200,
    produceTotal: 2200,
    logisticsFee: 190,
    totalAmount: 2390,
    traditionalChainCost: 3600,
    consumerSavings: 1210, // 3600 - 2390
    farmerEarnings: 2200,
    farmerGainVsMandi: 850, // 2200 - 1350
    status: 'delivered',
    createdAt: '2026-08-24T09:10:00Z',
    estimatedDeliveryDays: 1,
    logisticsStep: 'Delivered at Doorstep • Payment Released to Farmer',
    isScheduledPickup: false,
  }
];
