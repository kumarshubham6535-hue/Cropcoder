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

export const REGIONAL_HISTORICAL_DATASETS: DistrictCropDataset[] = [
  {
    cropId: 'onion',
    cropNameEn: 'Onion (Nashik Red)',
    cropNameHi: 'प्याज (नासिक लाल)',
    cropIcon: '🧅',
    state: 'Maharashtra',
    district: 'Nashik',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Kharif early arrivals start September; current post-monsoon stock faces middleman price manipulation. Direct sales yield +63% farmer gain.',
    seasonalNotesHi: 'खरीफ की शुरुआती आवक सितंबर में शुरू होती है; मौजूदा स्टॉक में बिचौलियों का दबाव है। सीधी बिक्री से +63% तक किसान लाभ मिलता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 1100, directFarmerPrice: 1900, consumerRetailPrice: 3200, demandVolumeQuintals: 42000, supplyVolumeQuintals: 45000, arrivalTons: 4500 },
      { month: 'Oct 25', avgMandiPrice: 1250, directFarmerPrice: 2050, consumerRetailPrice: 3400, demandVolumeQuintals: 46000, supplyVolumeQuintals: 43000, arrivalTons: 4300 },
      { month: 'Nov 25', avgMandiPrice: 1400, directFarmerPrice: 2200, consumerRetailPrice: 3800, demandVolumeQuintals: 51000, supplyVolumeQuintals: 48000, arrivalTons: 4800 },
      { month: 'Dec 25', avgMandiPrice: 1550, directFarmerPrice: 2400, consumerRetailPrice: 4100, demandVolumeQuintals: 55000, supplyVolumeQuintals: 52000, arrivalTons: 5200 },
      { month: 'Jan 26', avgMandiPrice: 1300, directFarmerPrice: 2150, consumerRetailPrice: 3600, demandVolumeQuintals: 49000, supplyVolumeQuintals: 53000, arrivalTons: 5300 },
      { month: 'Feb 26', avgMandiPrice: 1200, directFarmerPrice: 2000, consumerRetailPrice: 3300, demandVolumeQuintals: 47000, supplyVolumeQuintals: 54000, arrivalTons: 5400 },
      { month: 'Mar 26', avgMandiPrice: 1150, directFarmerPrice: 1950, consumerRetailPrice: 3100, demandVolumeQuintals: 46000, supplyVolumeQuintals: 58000, arrivalTons: 5800 },
      { month: 'Apr 26', avgMandiPrice: 1280, directFarmerPrice: 2100, consumerRetailPrice: 3500, demandVolumeQuintals: 48000, supplyVolumeQuintals: 51000, arrivalTons: 5100 },
      { month: 'May 26', avgMandiPrice: 1450, directFarmerPrice: 2300, consumerRetailPrice: 3900, demandVolumeQuintals: 52000, supplyVolumeQuintals: 47000, arrivalTons: 4700 },
      { month: 'Jun 26', avgMandiPrice: 1520, directFarmerPrice: 2380, consumerRetailPrice: 4050, demandVolumeQuintals: 54000, supplyVolumeQuintals: 46000, arrivalTons: 4600 },
      { month: 'Jul 26', avgMandiPrice: 1380, directFarmerPrice: 2220, consumerRetailPrice: 3750, demandVolumeQuintals: 50000, supplyVolumeQuintals: 49000, arrivalTons: 4900 },
      { month: 'Aug 26', avgMandiPrice: 1350, directFarmerPrice: 2200, consumerRetailPrice: 3600, demandVolumeQuintals: 53000, supplyVolumeQuintals: 48500, arrivalTons: 4850 }
    ]
  },
  {
    cropId: 'potato',
    cropNameEn: 'Potato (Agra Table & Cold Storage)',
    cropNameHi: 'आलू (आगरा कोल्ड स्टोरेज व टेबल)',
    cropIcon: '🥔',
    state: 'Uttar Pradesh',
    district: 'Agra',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High post-cold storage demand in northern urban belts. Eliminating 3 tiers of middlemen unlocks ₹600/quintal bonus for farmers.',
    seasonalNotesHi: 'उत्तर भारतीय शहरी क्षेत्रों में कोल्ड स्टोरेज के बाद उच्च मांग। 3 स्तर के बिचौलियों को हटाकर किसानों को ₹600/क्विंटल अतिरिक्त लाभ मिलता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 750, directFarmerPrice: 1300, consumerRetailPrice: 2100, demandVolumeQuintals: 65000, supplyVolumeQuintals: 70000, arrivalTons: 7000 },
      { month: 'Oct 25', avgMandiPrice: 820, directFarmerPrice: 1380, consumerRetailPrice: 2250, demandVolumeQuintals: 68000, supplyVolumeQuintals: 67000, arrivalTons: 6700 },
      { month: 'Nov 25', avgMandiPrice: 900, directFarmerPrice: 1480, consumerRetailPrice: 2400, demandVolumeQuintals: 72000, supplyVolumeQuintals: 65000, arrivalTons: 6500 },
      { month: 'Dec 25', avgMandiPrice: 950, directFarmerPrice: 1550, consumerRetailPrice: 2500, demandVolumeQuintals: 76000, supplyVolumeQuintals: 69000, arrivalTons: 6900 },
      { month: 'Jan 26', avgMandiPrice: 800, directFarmerPrice: 1350, consumerRetailPrice: 2200, demandVolumeQuintals: 71000, supplyVolumeQuintals: 78000, arrivalTons: 7800 },
      { month: 'Feb 26', avgMandiPrice: 720, directFarmerPrice: 1250, consumerRetailPrice: 2000, demandVolumeQuintals: 66000, supplyVolumeQuintals: 85000, arrivalTons: 8500 },
      { month: 'Mar 26', avgMandiPrice: 700, directFarmerPrice: 1200, consumerRetailPrice: 1950, demandVolumeQuintals: 64000, supplyVolumeQuintals: 90000, arrivalTons: 9000 },
      { month: 'Apr 26', avgMandiPrice: 760, directFarmerPrice: 1300, consumerRetailPrice: 2100, demandVolumeQuintals: 67000, supplyVolumeQuintals: 80000, arrivalTons: 8000 },
      { month: 'May 26', avgMandiPrice: 810, directFarmerPrice: 1390, consumerRetailPrice: 2250, demandVolumeQuintals: 70000, supplyVolumeQuintals: 75000, arrivalTons: 7500 },
      { month: 'Jun 26', avgMandiPrice: 850, directFarmerPrice: 1450, consumerRetailPrice: 2350, demandVolumeQuintals: 73000, supplyVolumeQuintals: 72000, arrivalTons: 7200 },
      { month: 'Jul 26', avgMandiPrice: 880, directFarmerPrice: 1490, consumerRetailPrice: 2400, demandVolumeQuintals: 75000, supplyVolumeQuintals: 69000, arrivalTons: 6900 },
      { month: 'Aug 26', avgMandiPrice: 850, directFarmerPrice: 1450, consumerRetailPrice: 2400, demandVolumeQuintals: 74000, supplyVolumeQuintals: 71000, arrivalTons: 7100 }
    ]
  },
  {
    cropId: 'tomato',
    cropNameEn: 'Tomato (Kolar Hybrid)',
    cropNameHi: 'टमाटर (कोलार हाइब्रिड)',
    cropIcon: '🍅',
    state: 'Karnataka',
    district: 'Kolar',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Perishable volatility peak in summer months. Direct cold routing prevents 22% post-harvest spoilage.',
    seasonalNotesHi: 'गर्मियों में अत्यधिक उतार-चढ़ाव। सीधा कोल्ड रूट 22% फसल बर्बादी रोकता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 900, directFarmerPrice: 1600, consumerRetailPrice: 2800, demandVolumeQuintals: 38000, supplyVolumeQuintals: 42000, arrivalTons: 4200 },
      { month: 'Oct 25', avgMandiPrice: 1100, directFarmerPrice: 1850, consumerRetailPrice: 3200, demandVolumeQuintals: 42000, supplyVolumeQuintals: 39000, arrivalTons: 3900 },
      { month: 'Nov 25', avgMandiPrice: 1300, directFarmerPrice: 2100, consumerRetailPrice: 3600, demandVolumeQuintals: 45000, supplyVolumeQuintals: 41000, arrivalTons: 4100 },
      { month: 'Dec 25', avgMandiPrice: 1500, directFarmerPrice: 2350, consumerRetailPrice: 4000, demandVolumeQuintals: 48000, supplyVolumeQuintals: 43000, arrivalTons: 4300 },
      { month: 'Jan 26', avgMandiPrice: 1200, directFarmerPrice: 1950, consumerRetailPrice: 3400, demandVolumeQuintals: 44000, supplyVolumeQuintals: 46000, arrivalTons: 4600 },
      { month: 'Feb 26', avgMandiPrice: 1050, directFarmerPrice: 1750, consumerRetailPrice: 3000, demandVolumeQuintals: 41000, supplyVolumeQuintals: 48000, arrivalTons: 4800 },
      { month: 'Mar 26', avgMandiPrice: 1000, directFarmerPrice: 1700, consumerRetailPrice: 2900, demandVolumeQuintals: 40000, supplyVolumeQuintals: 50000, arrivalTons: 5000 },
      { month: 'Apr 26', avgMandiPrice: 1250, directFarmerPrice: 2000, consumerRetailPrice: 3500, demandVolumeQuintals: 43000, supplyVolumeQuintals: 44000, arrivalTons: 4400 },
      { month: 'May 26', avgMandiPrice: 1600, directFarmerPrice: 2500, consumerRetailPrice: 4300, demandVolumeQuintals: 49000, supplyVolumeQuintals: 39000, arrivalTons: 3900 },
      { month: 'Jun 26', avgMandiPrice: 1800, directFarmerPrice: 2750, consumerRetailPrice: 4700, demandVolumeQuintals: 52000, supplyVolumeQuintals: 37000, arrivalTons: 3700 },
      { month: 'Jul 26', avgMandiPrice: 1400, directFarmerPrice: 2200, consumerRetailPrice: 3800, demandVolumeQuintals: 46000, supplyVolumeQuintals: 44000, arrivalTons: 4400 },
      { month: 'Aug 26', avgMandiPrice: 1200, directFarmerPrice: 1950, consumerRetailPrice: 3400, demandVolumeQuintals: 44000, supplyVolumeQuintals: 45000, arrivalTons: 4500 }
    ]
  },
  {
    cropId: 'wheat',
    cropNameEn: 'Wheat (Sharbati & Lokwan)',
    cropNameHi: 'गेहूं (शरबती व लोकवन)',
    cropIcon: '🌾',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High protein golden grain. Direct procurement to flour mills bypasses mandi commission and gunny bag fees.',
    seasonalNotesHi: 'उच्च प्रोटीन शरबती गेहूं। आटा मिलों को सीधी आपूर्ति मंडी टैक्स और आढ़त बचाती है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 2200, directFarmerPrice: 2900, consumerRetailPrice: 4200, demandVolumeQuintals: 30000, supplyVolumeQuintals: 32000, arrivalTons: 3200 },
      { month: 'Oct 25', avgMandiPrice: 2250, directFarmerPrice: 2950, consumerRetailPrice: 4300, demandVolumeQuintals: 31000, supplyVolumeQuintals: 31000, arrivalTons: 3100 },
      { month: 'Nov 25', avgMandiPrice: 2300, directFarmerPrice: 3000, consumerRetailPrice: 4400, demandVolumeQuintals: 33000, supplyVolumeQuintals: 30000, arrivalTons: 3000 },
      { month: 'Dec 25', avgMandiPrice: 2350, directFarmerPrice: 3100, consumerRetailPrice: 4500, demandVolumeQuintals: 35000, supplyVolumeQuintals: 29000, arrivalTons: 2900 },
      { month: 'Jan 26', avgMandiPrice: 2400, directFarmerPrice: 3150, consumerRetailPrice: 4600, demandVolumeQuintals: 36000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'Feb 26', avgMandiPrice: 2450, directFarmerPrice: 3200, consumerRetailPrice: 4700, demandVolumeQuintals: 37000, supplyVolumeQuintals: 27000, arrivalTons: 2700 },
      { month: 'Mar 26', avgMandiPrice: 2100, directFarmerPrice: 2800, consumerRetailPrice: 4100, demandVolumeQuintals: 32000, supplyVolumeQuintals: 45000, arrivalTons: 4500 },
      { month: 'Apr 26', avgMandiPrice: 2150, directFarmerPrice: 2850, consumerRetailPrice: 4200, demandVolumeQuintals: 33000, supplyVolumeQuintals: 42000, arrivalTons: 4200 },
      { month: 'May 26', avgMandiPrice: 2200, directFarmerPrice: 2900, consumerRetailPrice: 4300, demandVolumeQuintals: 34000, supplyVolumeQuintals: 39000, arrivalTons: 3900 },
      { month: 'Jun 26', avgMandiPrice: 2280, directFarmerPrice: 2980, consumerRetailPrice: 4400, demandVolumeQuintals: 35000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Jul 26', avgMandiPrice: 2320, directFarmerPrice: 3050, consumerRetailPrice: 4500, demandVolumeQuintals: 36000, supplyVolumeQuintals: 34000, arrivalTons: 3400 },
      { month: 'Aug 26', avgMandiPrice: 2350, directFarmerPrice: 3100, consumerRetailPrice: 4600, demandVolumeQuintals: 37000, supplyVolumeQuintals: 33000, arrivalTons: 3300 }
    ]
  }
];

export const HISTORICAL_CROP_DATASETS = REGIONAL_HISTORICAL_DATASETS;
