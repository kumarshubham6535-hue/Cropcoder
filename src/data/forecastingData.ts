import { HistoricalDataPoint } from '../types';

export interface DistrictCropDataset {
  cropId: string;
  cropNameEn: string;
  cropNameHi: string;
  cropIcon: string;
  state: string;
  district: string;
  unit: string;
  history: HistoricalDataPoint[];
  seasonalNotesEn: string;
  seasonalNotesHi: string;
}

// NOTE: Demand/supply/arrival volumes below are illustrative round numbers (unsourced).
// Price readings are anchored to verified Haryana mandi/APMC rates (Aug 2026 anchors), with
// monthly trajectories shaped according to real Haryana rabi/kharif agricultural calendars.
export const REGIONAL_HISTORICAL_DATASETS: DistrictCropDataset[] = [
  {
    cropId: 'wheat',
    cropNameEn: 'Wheat (Karnal HD-3086)',
    cropNameHi: 'गेहूं (करनाल HD-3086)',
    cropIcon: '🌾',
    state: 'Haryana',
    district: 'Karnal',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Rabi harvest floods the market April–May; MSP procurement and storage smooth prices through the year. Direct sales yield roughly +15% over mandi rate.',
    seasonalNotesHi: 'रबी की फसल अप्रैल-मई में बाजार में आती है; MSP खरीद और भंडारण से साल भर कीमतें स्थिर रहती हैं।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 2400, directFarmerPrice: 2750, consumerRetailPrice: 3600, demandVolumeQuintals: 60000, supplyVolumeQuintals: 42000, arrivalTons: 4200 },
      { month: 'Oct 25', avgMandiPrice: 2420, directFarmerPrice: 2770, consumerRetailPrice: 3630, demandVolumeQuintals: 61000, supplyVolumeQuintals: 40000, arrivalTons: 4000 },
      { month: 'Nov 25', avgMandiPrice: 2450, directFarmerPrice: 2800, consumerRetailPrice: 3670, demandVolumeQuintals: 62000, supplyVolumeQuintals: 38000, arrivalTons: 3800 },
      { month: 'Dec 25', avgMandiPrice: 2480, directFarmerPrice: 2830, consumerRetailPrice: 3700, demandVolumeQuintals: 63000, supplyVolumeQuintals: 37000, arrivalTons: 3700 },
      { month: 'Jan 26', avgMandiPrice: 2500, directFarmerPrice: 2860, consumerRetailPrice: 3750, demandVolumeQuintals: 64000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Feb 26', avgMandiPrice: 2520, directFarmerPrice: 2890, consumerRetailPrice: 3780, demandVolumeQuintals: 63000, supplyVolumeQuintals: 39000, arrivalTons: 3900 },
      { month: 'Mar 26', avgMandiPrice: 2550, directFarmerPrice: 2920, consumerRetailPrice: 3820, demandVolumeQuintals: 62000, supplyVolumeQuintals: 55000, arrivalTons: 5500 },
      { month: 'Apr 26', avgMandiPrice: 2585, directFarmerPrice: 2950, consumerRetailPrice: 3900, demandVolumeQuintals: 68000, supplyVolumeQuintals: 95000, arrivalTons: 9500 },
      { month: 'May 26', avgMandiPrice: 2600, directFarmerPrice: 2980, consumerRetailPrice: 3950, demandVolumeQuintals: 66000, supplyVolumeQuintals: 80000, arrivalTons: 8000 },
      { month: 'Jun 26', avgMandiPrice: 2650, directFarmerPrice: 3020, consumerRetailPrice: 4000, demandVolumeQuintals: 65000, supplyVolumeQuintals: 60000, arrivalTons: 6000 },
      { month: 'Jul 26', avgMandiPrice: 2800, directFarmerPrice: 3200, consumerRetailPrice: 4200, demandVolumeQuintals: 64000, supplyVolumeQuintals: 50000, arrivalTons: 5000 },
      { month: 'Aug 26', avgMandiPrice: 3000, directFarmerPrice: 3450, consumerRetailPrice: 4500, demandVolumeQuintals: 63000, supplyVolumeQuintals: 45000, arrivalTons: 4500 }
    ]
  },
  {
    cropId: 'mustard',
    cropNameEn: 'Mustard / Sarson (Hisar RH-30)',
    cropNameHi: 'सरसों (हिसार RH-30)',
    cropIcon: '🌼',
    state: 'Haryana',
    district: 'Hisar',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Rabi harvest peaks March–April with high arrival pressure; off-season summer and monsoon bring steady price appreciation. Direct oil mill tie-ups capture roughly +15% over APMC modal auctions.',
    seasonalNotesHi: 'रबी की फसल मार्च-अप्रैल में आती है; ऑफ-सीजन में मांग बढ़ने से कीमतें सुधरती हैं। तेल मिलों को सीधी आपूर्ति से मंडी बिचौलियों का कमीशन बचता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 5750, directFarmerPrice: 6600, consumerRetailPrice: 9480, demandVolumeQuintals: 28000, supplyVolumeQuintals: 22000, arrivalTons: 2200 },
      { month: 'Oct 25', avgMandiPrice: 5850, directFarmerPrice: 6720, consumerRetailPrice: 9650, demandVolumeQuintals: 29000, supplyVolumeQuintals: 21000, arrivalTons: 2100 },
      { month: 'Nov 25', avgMandiPrice: 6000, directFarmerPrice: 6900, consumerRetailPrice: 9900, demandVolumeQuintals: 30000, supplyVolumeQuintals: 20000, arrivalTons: 2000 },
      { month: 'Dec 25', avgMandiPrice: 6150, directFarmerPrice: 7070, consumerRetailPrice: 10150, demandVolumeQuintals: 31000, supplyVolumeQuintals: 19000, arrivalTons: 1900 },
      { month: 'Jan 26', avgMandiPrice: 6050, directFarmerPrice: 6950, consumerRetailPrice: 9980, demandVolumeQuintals: 29000, supplyVolumeQuintals: 21000, arrivalTons: 2100 },
      { month: 'Feb 26', avgMandiPrice: 5800, directFarmerPrice: 6670, consumerRetailPrice: 9570, demandVolumeQuintals: 27000, supplyVolumeQuintals: 26000, arrivalTons: 2600 },
      { month: 'Mar 26', avgMandiPrice: 5450, directFarmerPrice: 6270, consumerRetailPrice: 8990, demandVolumeQuintals: 28000, supplyVolumeQuintals: 44000, arrivalTons: 4400 },
      { month: 'Apr 26', avgMandiPrice: 5350, directFarmerPrice: 6150, consumerRetailPrice: 8820, demandVolumeQuintals: 32000, supplyVolumeQuintals: 52000, arrivalTons: 5200 },
      { month: 'May 26', avgMandiPrice: 5650, directFarmerPrice: 6500, consumerRetailPrice: 9320, demandVolumeQuintals: 31000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Jun 26', avgMandiPrice: 5950, directFarmerPrice: 6840, consumerRetailPrice: 9810, demandVolumeQuintals: 30000, supplyVolumeQuintals: 27000, arrivalTons: 2700 },
      { month: 'Jul 26', avgMandiPrice: 6200, directFarmerPrice: 7130, consumerRetailPrice: 10230, demandVolumeQuintals: 29000, supplyVolumeQuintals: 23000, arrivalTons: 2300 },
      { month: 'Aug 26', avgMandiPrice: 6450, directFarmerPrice: 7450, consumerRetailPrice: 10650, demandVolumeQuintals: 30000, supplyVolumeQuintals: 22000, arrivalTons: 2200 }
    ]
  },
  {
    cropId: 'cotton',
    cropNameEn: 'Cotton / Narma (Sirsa Bt Hybrid)',
    cropNameHi: 'कपास / नरमा (सिरसा बीटी हाइब्रिड)',
    cropIcon: '☁️',
    state: 'Haryana',
    district: 'Sirsa',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Kharif cotton arrivals start September–October across Sirsa & Adampur APMCs; off-season mill demand stabilizes prices. Direct ginning hub supply captures +15–20% premium.',
    seasonalNotesHi: 'सिरसा और आदमपुर मंडियों में खरीफ कपास की आवक सितंबर-अक्टूबर में शुरू होती है; जिनिंग मिलों को सीधी बिक्री से किसानों को अतिरिक्त लाभ मिलता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 5700, directFarmerPrice: 6550, consumerRetailPrice: 10260, demandVolumeQuintals: 32000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'Oct 25', avgMandiPrice: 5500, directFarmerPrice: 6320, consumerRetailPrice: 9900, demandVolumeQuintals: 35000, supplyVolumeQuintals: 46000, arrivalTons: 4600 },
      { month: 'Nov 25', avgMandiPrice: 5400, directFarmerPrice: 6210, consumerRetailPrice: 9720, demandVolumeQuintals: 37000, supplyVolumeQuintals: 52000, arrivalTons: 5200 },
      { month: 'Dec 25', avgMandiPrice: 5550, directFarmerPrice: 6380, consumerRetailPrice: 9990, demandVolumeQuintals: 36000, supplyVolumeQuintals: 42000, arrivalTons: 4200 },
      { month: 'Jan 26', avgMandiPrice: 5650, directFarmerPrice: 6500, consumerRetailPrice: 10170, demandVolumeQuintals: 34000, supplyVolumeQuintals: 34000, arrivalTons: 3400 },
      { month: 'Feb 26', avgMandiPrice: 5750, directFarmerPrice: 6610, consumerRetailPrice: 10350, demandVolumeQuintals: 33000, supplyVolumeQuintals: 29000, arrivalTons: 2900 },
      { month: 'Mar 26', avgMandiPrice: 5850, directFarmerPrice: 6730, consumerRetailPrice: 10530, demandVolumeQuintals: 32000, supplyVolumeQuintals: 25000, arrivalTons: 2500 },
      { month: 'Apr 26', avgMandiPrice: 5900, directFarmerPrice: 6780, consumerRetailPrice: 10620, demandVolumeQuintals: 31000, supplyVolumeQuintals: 22000, arrivalTons: 2200 },
      { month: 'May 26', avgMandiPrice: 5980, directFarmerPrice: 6880, consumerRetailPrice: 10760, demandVolumeQuintals: 30000, supplyVolumeQuintals: 20000, arrivalTons: 2000 },
      { month: 'Jun 26', avgMandiPrice: 6050, directFarmerPrice: 6960, consumerRetailPrice: 10890, demandVolumeQuintals: 31000, supplyVolumeQuintals: 19000, arrivalTons: 1900 },
      { month: 'Jul 26', avgMandiPrice: 6090, directFarmerPrice: 7000, consumerRetailPrice: 10960, demandVolumeQuintals: 32000, supplyVolumeQuintals: 18000, arrivalTons: 1800 },
      { month: 'Aug 26', avgMandiPrice: 6115, directFarmerPrice: 7500, consumerRetailPrice: 11300, demandVolumeQuintals: 33000, supplyVolumeQuintals: 19500, arrivalTons: 1950 }
    ]
  },
  {
    cropId: 'rice_basmati',
    cropNameEn: 'Basmati Rice (Karnal Pusa 1121)',
    cropNameHi: 'बासमती चावल (करनाल पूसा 1121)',
    cropIcon: '🌾',
    state: 'Haryana',
    district: 'Karnal',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Paddy harvested Oct–Nov in Taraori belt and milled through winter; aged milled rice commands export-grade premiums. Direct miller aggregation yields ~10–15% over APMC rate; retail price reflects milled rice index (~1.3× mandi).',
    seasonalNotesHi: 'तरावड़ी बेल्ट का पूसा-1121 बासमती; धान की कटाई अक्टूबर-नवंबर में होती है। सीधे मिलर्स और एक्सपोर्टर्स को आपूर्ति से मंडी कमीशन की बचत होती है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 7200, directFarmerPrice: 7950, consumerRetailPrice: 9360, demandVolumeQuintals: 40000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Oct 25', avgMandiPrice: 7000, directFarmerPrice: 7700, consumerRetailPrice: 9100, demandVolumeQuintals: 44000, supplyVolumeQuintals: 58000, arrivalTons: 5800 },
      { month: 'Nov 25', avgMandiPrice: 6900, directFarmerPrice: 7600, consumerRetailPrice: 8970, demandVolumeQuintals: 47000, supplyVolumeQuintals: 64000, arrivalTons: 6400 },
      { month: 'Dec 25', avgMandiPrice: 7100, directFarmerPrice: 7810, consumerRetailPrice: 9230, demandVolumeQuintals: 45000, supplyVolumeQuintals: 48000, arrivalTons: 4800 },
      { month: 'Jan 26', avgMandiPrice: 7300, directFarmerPrice: 8030, consumerRetailPrice: 9490, demandVolumeQuintals: 43000, supplyVolumeQuintals: 38000, arrivalTons: 3800 },
      { month: 'Feb 26', avgMandiPrice: 7400, directFarmerPrice: 8140, consumerRetailPrice: 9620, demandVolumeQuintals: 41000, supplyVolumeQuintals: 34000, arrivalTons: 3400 },
      { month: 'Mar 26', avgMandiPrice: 7500, directFarmerPrice: 8250, consumerRetailPrice: 9750, demandVolumeQuintals: 40000, supplyVolumeQuintals: 31000, arrivalTons: 3100 },
      { month: 'Apr 26', avgMandiPrice: 7550, directFarmerPrice: 8300, consumerRetailPrice: 9810, demandVolumeQuintals: 39000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'May 26', avgMandiPrice: 7600, directFarmerPrice: 8360, consumerRetailPrice: 9880, demandVolumeQuintals: 40000, supplyVolumeQuintals: 26000, arrivalTons: 2600 },
      { month: 'Jun 26', avgMandiPrice: 7680, directFarmerPrice: 8450, consumerRetailPrice: 9980, demandVolumeQuintals: 41000, supplyVolumeQuintals: 25000, arrivalTons: 2500 },
      { month: 'Jul 26', avgMandiPrice: 7750, directFarmerPrice: 8520, consumerRetailPrice: 10070, demandVolumeQuintals: 42000, supplyVolumeQuintals: 24000, arrivalTons: 2400 },
      { month: 'Aug 26', avgMandiPrice: 7800, directFarmerPrice: 8600, consumerRetailPrice: 10100, demandVolumeQuintals: 43000, supplyVolumeQuintals: 25000, arrivalTons: 2500 }
    ]
  },
  {
    cropId: 'bajra',
    cropNameEn: 'Bajra / Pearl Millet (Bhiwani HHB-67)',
    cropNameHi: 'बाजरा (भिवानी HHB-67)',
    cropIcon: '🌾',
    state: 'Haryana',
    district: 'Bhiwani',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Kharif crop harvested September–October across dry south Haryana. State Bhavantar Bharpayee Yojana (BBY) bridges mandi gap; direct procurement unlocks ~₹26/kg (+15% over APMC modal).',
    seasonalNotesHi: 'दक्षिण हरियाणा की प्रमुख खरीफ फसल; भावांतर भरपाई योजना (BBY) और सीधी आपूर्ति से किसान को औसतन ₹2,600/क्विंटल शुद्ध आय मिलती है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 2150, directFarmerPrice: 2470, consumerRetailPrice: 3350, demandVolumeQuintals: 35000, supplyVolumeQuintals: 30000, arrivalTons: 3000 },
      { month: 'Oct 25', avgMandiPrice: 2000, directFarmerPrice: 2300, consumerRetailPrice: 3100, demandVolumeQuintals: 40000, supplyVolumeQuintals: 52000, arrivalTons: 5200 },
      { month: 'Nov 25', avgMandiPrice: 1950, directFarmerPrice: 2240, consumerRetailPrice: 3020, demandVolumeQuintals: 42000, supplyVolumeQuintals: 56000, arrivalTons: 5600 },
      { month: 'Dec 25', avgMandiPrice: 2050, directFarmerPrice: 2360, consumerRetailPrice: 3180, demandVolumeQuintals: 38000, supplyVolumeQuintals: 40000, arrivalTons: 4000 },
      { month: 'Jan 26', avgMandiPrice: 2100, directFarmerPrice: 2410, consumerRetailPrice: 3250, demandVolumeQuintals: 36000, supplyVolumeQuintals: 32000, arrivalTons: 3200 },
      { month: 'Feb 26', avgMandiPrice: 2120, directFarmerPrice: 2440, consumerRetailPrice: 3290, demandVolumeQuintals: 34000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'Mar 26', avgMandiPrice: 2150, directFarmerPrice: 2470, consumerRetailPrice: 3330, demandVolumeQuintals: 33000, supplyVolumeQuintals: 25000, arrivalTons: 2500 },
      { month: 'Apr 26', avgMandiPrice: 2180, directFarmerPrice: 2510, consumerRetailPrice: 3380, demandVolumeQuintals: 32000, supplyVolumeQuintals: 22000, arrivalTons: 2200 },
      { month: 'May 26', avgMandiPrice: 2200, directFarmerPrice: 2530, consumerRetailPrice: 3410, demandVolumeQuintals: 31000, supplyVolumeQuintals: 20000, arrivalTons: 2000 },
      { month: 'Jun 26', avgMandiPrice: 2220, directFarmerPrice: 2550, consumerRetailPrice: 3440, demandVolumeQuintals: 32000, supplyVolumeQuintals: 19000, arrivalTons: 1900 },
      { month: 'Jul 26', avgMandiPrice: 2250, directFarmerPrice: 2590, consumerRetailPrice: 3490, demandVolumeQuintals: 33000, supplyVolumeQuintals: 18000, arrivalTons: 1800 },
      { month: 'Aug 26', avgMandiPrice: 2270, directFarmerPrice: 2600, consumerRetailPrice: 3550, demandVolumeQuintals: 34000, supplyVolumeQuintals: 19000, arrivalTons: 1900 }
    ]
  }
];

export const HISTORICAL_CROP_DATASETS = REGIONAL_HISTORICAL_DATASETS;
