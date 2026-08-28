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
    askingPricePerQuintal: 3600, // ₹36/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 2600, // APMC Lasalgaon middleman modal rate ₹26/kg
    retailConsumerPricePerQuintal: 5200, // Urban retail grocery rate ₹52/kg
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
    askingPricePerQuintal: 2250, // ₹22.50/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 1550, // Agra Mandi wholesale rate ₹15.50/kg
    retailConsumerPricePerQuintal: 3400, // Consumer pays ₹34/kg in retail
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
    fpoName: 'Andhra Spice & Horticulture Federation',
    cropId: 'tomato',
    cropName: 'Kolar Hybrid Fresh Tomatoes',
    variety: 'Abhinav Firm Round',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 30,
    minOrderQuintals: 1,
    askingPricePerQuintal: 3100, // ₹31.00/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 2050, // Kolar Mandi wholesale gives ₹20.50/kg
    retailConsumerPricePerQuintal: 4800, // Retail price ₹48.00/kg
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
    farmerName: 'Devendra Malviya',
    farmerPhone: '+91 98930 45612',
    isFPO: true,
    fpoName: 'Narmada Valley Kisan Producer Co.',
    cropId: 'wheat',
    cropName: 'Sehore Sharbati Wheat',
    variety: 'Sharbati Golden Grain',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 200,
    minOrderQuintals: 5,
    askingPricePerQuintal: 3650, // ₹36.50/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 2650, // Mandi gives ₹26.50/kg
    retailConsumerPricePerQuintal: 5200, // Retail shop gives ₹52/kg
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
  },
  {
    id: 'list-105',
    farmerId: 'farmer-05',
    farmerName: 'Gurpreet Singh Sandhu',
    farmerPhone: '+91 98760 11223',
    isFPO: true,
    fpoName: 'Majha Organic Basmati Producers',
    cropId: 'rice_basmati',
    cropName: 'Basmati Rice (1121 Raw Aromatic)',
    variety: 'Pusa 1121 Extra Long Grain',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 160,
    minOrderQuintals: 5,
    askingPricePerQuintal: 5950, // ₹59.50/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 4100, // Mandi gives ₹41.00/kg
    retailConsumerPricePerQuintal: 8900, // Retail shop gives ₹89/kg
    harvestDate: '2026-08-20',
    location: {
      village: 'Rayya',
      district: 'Amritsar',
      state: 'Punjab',
      lat: 31.6340,
      lng: 74.8723,
    },
    pickupPointName: 'Majha Grain Logistics Hub, Amritsar',
    createdAt: '2026-08-24T07:15:00Z',
    status: 'active',
  },
  {
    id: 'list-106',
    farmerId: 'farmer-06',
    farmerName: 'Kishan Lal Choudhary',
    farmerPhone: '+91 94140 88219',
    isFPO: false,
    cropId: 'mustard',
    cropName: 'Mustard / Sarson (Pusa Bold)',
    variety: 'Pusa Bold 42% Oil Content',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 90,
    minOrderQuintals: 3,
    askingPricePerQuintal: 7850, // ₹78.50/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 6400, // Mandi offers ₹64/kg
    retailConsumerPricePerQuintal: 10800, // Retail oil/seed ₹108/kg
    harvestDate: '2026-08-22',
    location: {
      village: 'Kumher',
      district: 'Bharatpur',
      state: 'Rajasthan',
      lat: 27.3167,
      lng: 77.3833,
    },
    pickupPointName: 'Bharatpur Oilseeds Aggregation Depot',
    createdAt: '2026-08-24T09:45:00Z',
    status: 'active',
  },
  {
    id: 'list-107',
    farmerId: 'farmer-07',
    farmerName: 'Chandra Shekar Rao',
    farmerPhone: '+91 98480 33419',
    isFPO: true,
    fpoName: 'Mirchi Rythu Producer Federation',
    cropId: 'chili',
    cropName: 'Red Chili (Guntur Sannam S4)',
    variety: 'Guntur S4 Hot Sun-Dried',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 40,
    minOrderQuintals: 1,
    askingPricePerQuintal: 23500, // ₹235/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 17500, // Mandi gives ₹175/kg
    retailConsumerPricePerQuintal: 34000, // Retail spice ₹340/kg
    harvestDate: '2026-08-24',
    location: {
      village: 'Medikonduru',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      lat: 16.3067,
      lng: 80.4365,
    },
    pickupPointName: 'Guntur Spices Transit Center',
    createdAt: '2026-08-25T08:00:00Z',
    status: 'active',
  },
  {
    id: 'list-108',
    farmerId: 'farmer-08',
    farmerName: 'Hemant Negi',
    farmerPhone: '+91 98050 67123',
    isFPO: false,
    cropId: 'apple',
    cropName: 'Apple (Shimla Royal Delicious)',
    variety: 'Royal Delicious Crunchy Red',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 55,
    minOrderQuintals: 2,
    askingPricePerQuintal: 11200, // ₹112/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 7200, // Mandi middleman gives ₹72/kg
    retailConsumerPricePerQuintal: 17500, // Metro retail ₹175/kg
    harvestDate: '2026-08-25',
    location: {
      village: 'Kotkhai',
      district: 'Shimla',
      state: 'Himachal Pradesh',
      lat: 31.1200,
      lng: 77.5300,
    },
    pickupPointName: 'Kotkhai Cold Chain Terminal, Shimla',
    createdAt: '2026-08-25T11:20:00Z',
    status: 'active',
  },
  {
    id: 'list-109',
    farmerId: 'farmer-09',
    farmerName: 'M. Subramanian',
    farmerPhone: '+91 94432 18900',
    isFPO: true,
    fpoName: 'Kongu Agro Organic Producer Co.',
    cropId: 'turmeric',
    cropName: 'Turmeric / Haldi (Salem Double Polished)',
    variety: 'Salem Curcumin 4.8% Finger',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 70,
    minOrderQuintals: 2,
    askingPricePerQuintal: 19200, // ₹192/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 14200, // Mandi middleman gives ₹142/kg
    retailConsumerPricePerQuintal: 28500, // Retail shop gives ₹285/kg
    harvestDate: '2026-08-20',
    location: {
      village: 'Attur',
      district: 'Salem',
      state: 'Tamil Nadu',
      lat: 11.5950,
      lng: 78.5980,
    },
    pickupPointName: 'Attur Agro Processing Terminal, Salem',
    createdAt: '2026-08-25T13:00:00Z',
    status: 'active',
  },
  {
    id: 'list-110',
    farmerId: 'farmer-10',
    farmerName: 'Pravinbhai Patel',
    farmerPhone: '+91 98251 77340',
    isFPO: false,
    cropId: 'cotton',
    cropName: 'Cotton / Kapas (Gujarat Shankar-6)',
    variety: 'Shankar-6 High Micronaire',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 110,
    minOrderQuintals: 5,
    askingPricePerQuintal: 9150, // ₹91.50/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 7450, // Mandi price ₹74.50/kg
    retailConsumerPricePerQuintal: 13800, // Processed yarn index ₹138/kg
    harvestDate: '2026-08-22',
    location: {
      village: 'Gondal',
      district: 'Rajkot',
      state: 'Gujarat',
      lat: 21.9619,
      lng: 70.7923,
    },
    pickupPointName: 'Gondal Ginning & Logistics Hub',
    createdAt: '2026-08-25T14:40:00Z',
    status: 'active',
  },
  {
    id: 'list-111',
    farmerId: 'farmer-11',
    farmerName: 'Abhishek Kumar Mishra',
    farmerPhone: '+91 94312 60511',
    isFPO: true,
    fpoName: 'Kosi Seemanchal Farmer Producer Federation',
    cropId: 'maize',
    cropName: 'Yellow Maize / Corn (Purnia High Starch)',
    variety: 'Pioneer 3302 Yellow Dent',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 180,
    minOrderQuintals: 5,
    askingPricePerQuintal: 2950, // ₹29.50/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 2150, // Mandi gives ₹21.50/kg
    retailConsumerPricePerQuintal: 4200, // Retail gives ₹42.00/kg
    harvestDate: '2026-08-23',
    location: {
      village: 'Kasba',
      district: 'Purnia',
      state: 'Bihar',
      lat: 25.7771,
      lng: 87.4753,
    },
    pickupPointName: 'Purnia Agro Rail Siding Depot',
    createdAt: '2026-08-25T16:00:00Z',
    status: 'active',
  },
  {
    id: 'list-112',
    farmerId: 'farmer-12',
    farmerName: 'Anil Mukati',
    farmerPhone: '+91 97551 66341',
    isFPO: true,
    fpoName: 'Malwa Oilseed & Pulses Sangh',
    cropId: 'soybean',
    cropName: 'Soybean / Soyabean (Indore Yellow Gold)',
    variety: 'JS 9560 High Protein',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 140,
    minOrderQuintals: 5,
    askingPricePerQuintal: 5950, // ₹59.50/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 4650, // Mandi gives ₹46.50/kg
    retailConsumerPricePerQuintal: 8400, // Retail refined oil/meal ₹84/kg
    harvestDate: '2026-08-24',
    location: {
      village: 'Sanwer',
      district: 'Indore',
      state: 'Madhya Pradesh',
      lat: 22.9734,
      lng: 75.8267,
    },
    pickupPointName: 'Sanwer Malwa FPO Aggregation Yard',
    createdAt: '2026-08-25T18:00:00Z',
    status: 'active',
  },
  {
    id: 'list-113',
    farmerId: 'farmer-13',
    farmerName: 'Mathew Varghese',
    farmerPhone: '+91 94470 33891',
    isFPO: false,
    cropId: 'cardamom',
    cropName: 'Cardamom / Elaichi (Idukki 8mm Bold)',
    variety: 'Highland Alleppey Green Bold',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 15,
    minOrderQuintals: 1,
    askingPricePerQuintal: 285000, // ₹2,850/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 215000, // Mandi auction ₹2,150/kg
    retailConsumerPricePerQuintal: 410000, // Gourmet consumer retail ₹4,100/kg
    harvestDate: '2026-08-22',
    location: {
      village: 'Nedumkandam',
      district: 'Idukki',
      state: 'Kerala',
      lat: 9.8407,
      lng: 77.1517,
    },
    pickupPointName: 'Idukki Spice Collective Depot, Nedumkandam',
    createdAt: '2026-08-25T19:20:00Z',
    status: 'active',
  },
  {
    id: 'list-114',
    farmerId: 'farmer-14',
    farmerName: 'N. Srinivas Rao',
    farmerPhone: '+91 98480 55198',
    isFPO: true,
    fpoName: 'Telangana Rice Farmers Federation',
    cropId: 'sona_masoori',
    cropName: 'Sona Masoori Rice (Nalgonda Medium Grain)',
    variety: 'BPT 5204 (Samba Mahsuri)',
    grade: 'Grade A (Premium)',
    quantityAvailableQuintals: 130,
    minOrderQuintals: 3,
    askingPricePerQuintal: 4750, // ₹47.50/kg direct farmgate
    mandiMiddlemanPricePerQuintal: 3450, // Mandi wholesale ₹34.50/kg
    retailConsumerPricePerQuintal: 6800, // Retail shop gives ₹68/kg
    harvestDate: '2026-08-25',
    location: {
      village: 'Miryalaguda',
      district: 'Nalgonda',
      state: 'Telangana',
      lat: 16.8712,
      lng: 79.5637,
    },
    pickupPointName: 'Miryalaguda Milling & Dispatch Depot',
    createdAt: '2026-08-26T08:00:00Z',
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
  }
];
