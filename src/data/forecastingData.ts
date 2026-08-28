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
    seasonalNotesEn: 'Kharif early arrivals start September; current post-monsoon stock faces middleman price manipulation. Direct sales yield +38% farmer gain.',
    seasonalNotesHi: 'खरीफ की शुरुआती आवक सितंबर में शुरू होती है; मौजूदा स्टॉक में बिचौलियों का दबाव है। सीधी बिक्री से +38% तक किसान लाभ मिलता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 1900, directFarmerPrice: 2700, consumerRetailPrice: 3900, demandVolumeQuintals: 42000, supplyVolumeQuintals: 45000, arrivalTons: 4500 },
      { month: 'Oct 25', avgMandiPrice: 2050, directFarmerPrice: 2950, consumerRetailPrice: 4200, demandVolumeQuintals: 46000, supplyVolumeQuintals: 43000, arrivalTons: 4300 },
      { month: 'Nov 25', avgMandiPrice: 2300, directFarmerPrice: 3200, consumerRetailPrice: 4600, demandVolumeQuintals: 51000, supplyVolumeQuintals: 48000, arrivalTons: 4800 },
      { month: 'Dec 25', avgMandiPrice: 2550, directFarmerPrice: 3500, consumerRetailPrice: 5000, demandVolumeQuintals: 55000, supplyVolumeQuintals: 52000, arrivalTons: 5200 },
      { month: 'Jan 26', avgMandiPrice: 2200, directFarmerPrice: 3100, consumerRetailPrice: 4500, demandVolumeQuintals: 49000, supplyVolumeQuintals: 53000, arrivalTons: 5300 },
      { month: 'Feb 26', avgMandiPrice: 2000, directFarmerPrice: 2900, consumerRetailPrice: 4200, demandVolumeQuintals: 47000, supplyVolumeQuintals: 54000, arrivalTons: 5400 },
      { month: 'Mar 26', avgMandiPrice: 1950, directFarmerPrice: 2800, consumerRetailPrice: 4100, demandVolumeQuintals: 46000, supplyVolumeQuintals: 58000, arrivalTons: 5800 },
      { month: 'Apr 26', avgMandiPrice: 2100, directFarmerPrice: 3000, consumerRetailPrice: 4400, demandVolumeQuintals: 48000, supplyVolumeQuintals: 51000, arrivalTons: 5100 },
      { month: 'May 26', avgMandiPrice: 2400, directFarmerPrice: 3300, consumerRetailPrice: 4800, demandVolumeQuintals: 52000, supplyVolumeQuintals: 47000, arrivalTons: 4700 },
      { month: 'Jun 26', avgMandiPrice: 2550, directFarmerPrice: 3500, consumerRetailPrice: 5100, demandVolumeQuintals: 54000, supplyVolumeQuintals: 46000, arrivalTons: 4600 },
      { month: 'Jul 26', avgMandiPrice: 2600, directFarmerPrice: 3550, consumerRetailPrice: 5200, demandVolumeQuintals: 50000, supplyVolumeQuintals: 49000, arrivalTons: 4900 },
      { month: 'Aug 26', avgMandiPrice: 2600, directFarmerPrice: 3600, consumerRetailPrice: 5200, demandVolumeQuintals: 53000, supplyVolumeQuintals: 48500, arrivalTons: 4850 }
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
    seasonalNotesEn: 'High post-cold storage demand in northern urban belts. Eliminating 3 tiers of middlemen unlocks ₹700/quintal bonus for farmers.',
    seasonalNotesHi: 'उत्तर भारतीय शहरी क्षेत्रों में कोल्ड स्टोरेज के बाद उच्च मांग। 3 स्तर के बिचौलियों को हटाकर किसानों को ₹700/क्विंटल अतिरिक्त लाभ मिलता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 1200, directFarmerPrice: 1800, consumerRetailPrice: 2700, demandVolumeQuintals: 65000, supplyVolumeQuintals: 70000, arrivalTons: 7000 },
      { month: 'Oct 25', avgMandiPrice: 1300, directFarmerPrice: 1900, consumerRetailPrice: 2900, demandVolumeQuintals: 68000, supplyVolumeQuintals: 67000, arrivalTons: 6700 },
      { month: 'Nov 25', avgMandiPrice: 1400, directFarmerPrice: 2050, consumerRetailPrice: 3100, demandVolumeQuintals: 72000, supplyVolumeQuintals: 65000, arrivalTons: 6500 },
      { month: 'Dec 25', avgMandiPrice: 1450, directFarmerPrice: 2150, consumerRetailPrice: 3200, demandVolumeQuintals: 76000, supplyVolumeQuintals: 69000, arrivalTons: 6900 },
      { month: 'Jan 26', avgMandiPrice: 1350, directFarmerPrice: 1980, consumerRetailPrice: 3000, demandVolumeQuintals: 71000, supplyVolumeQuintals: 78000, arrivalTons: 7800 },
      { month: 'Feb 26', avgMandiPrice: 1250, directFarmerPrice: 1850, consumerRetailPrice: 2800, demandVolumeQuintals: 66000, supplyVolumeQuintals: 85000, arrivalTons: 8500 },
      { month: 'Mar 26', avgMandiPrice: 1200, directFarmerPrice: 1800, consumerRetailPrice: 2750, demandVolumeQuintals: 64000, supplyVolumeQuintals: 90000, arrivalTons: 9000 },
      { month: 'Apr 26', avgMandiPrice: 1350, directFarmerPrice: 1950, consumerRetailPrice: 2950, demandVolumeQuintals: 67000, supplyVolumeQuintals: 80000, arrivalTons: 8000 },
      { month: 'May 26', avgMandiPrice: 1420, directFarmerPrice: 2080, consumerRetailPrice: 3100, demandVolumeQuintals: 70000, supplyVolumeQuintals: 75000, arrivalTons: 7500 },
      { month: 'Jun 26', avgMandiPrice: 1500, directFarmerPrice: 2180, consumerRetailPrice: 3250, demandVolumeQuintals: 73000, supplyVolumeQuintals: 72000, arrivalTons: 7200 },
      { month: 'Jul 26', avgMandiPrice: 1520, directFarmerPrice: 2200, consumerRetailPrice: 3300, demandVolumeQuintals: 75000, supplyVolumeQuintals: 69000, arrivalTons: 6900 },
      { month: 'Aug 26', avgMandiPrice: 1550, directFarmerPrice: 2250, consumerRetailPrice: 3400, demandVolumeQuintals: 74000, supplyVolumeQuintals: 71000, arrivalTons: 7100 }
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
    seasonalNotesEn: 'Perishable volatility peak in summer months. Direct cold routing prevents 22% post-harvest spoilage and captures full consumer premium.',
    seasonalNotesHi: 'गर्मियों में अत्यधिक उतार-चढ़ाव। सीधा कोल्ड रूट 22% फसल बर्बादी रोकता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 1500, directFarmerPrice: 2400, consumerRetailPrice: 3800, demandVolumeQuintals: 38000, supplyVolumeQuintals: 42000, arrivalTons: 4200 },
      { month: 'Oct 25', avgMandiPrice: 1700, directFarmerPrice: 2650, consumerRetailPrice: 4200, demandVolumeQuintals: 42000, supplyVolumeQuintals: 39000, arrivalTons: 3900 },
      { month: 'Nov 25', avgMandiPrice: 1900, directFarmerPrice: 2900, consumerRetailPrice: 4600, demandVolumeQuintals: 45000, supplyVolumeQuintals: 41000, arrivalTons: 4100 },
      { month: 'Dec 25', avgMandiPrice: 2100, directFarmerPrice: 3150, consumerRetailPrice: 4900, demandVolumeQuintals: 48000, supplyVolumeQuintals: 43000, arrivalTons: 4300 },
      { month: 'Jan 26', avgMandiPrice: 1800, directFarmerPrice: 2750, consumerRetailPrice: 4400, demandVolumeQuintals: 44000, supplyVolumeQuintals: 46000, arrivalTons: 4600 },
      { month: 'Feb 26', avgMandiPrice: 1650, directFarmerPrice: 2550, consumerRetailPrice: 4000, demandVolumeQuintals: 41000, supplyVolumeQuintals: 48000, arrivalTons: 4800 },
      { month: 'Mar 26', avgMandiPrice: 1600, directFarmerPrice: 2500, consumerRetailPrice: 3900, demandVolumeQuintals: 40000, supplyVolumeQuintals: 50000, arrivalTons: 5000 },
      { month: 'Apr 26', avgMandiPrice: 1850, directFarmerPrice: 2800, consumerRetailPrice: 4500, demandVolumeQuintals: 43000, supplyVolumeQuintals: 44000, arrivalTons: 4400 },
      { month: 'May 26', avgMandiPrice: 2300, directFarmerPrice: 3400, consumerRetailPrice: 5300, demandVolumeQuintals: 49000, supplyVolumeQuintals: 39000, arrivalTons: 3900 },
      { month: 'Jun 26', avgMandiPrice: 2400, directFarmerPrice: 3550, consumerRetailPrice: 5500, demandVolumeQuintals: 52000, supplyVolumeQuintals: 37000, arrivalTons: 3700 },
      { month: 'Jul 26', avgMandiPrice: 2100, directFarmerPrice: 3150, consumerRetailPrice: 4900, demandVolumeQuintals: 46000, supplyVolumeQuintals: 44000, arrivalTons: 4400 },
      { month: 'Aug 26', avgMandiPrice: 2050, directFarmerPrice: 3100, consumerRetailPrice: 4800, demandVolumeQuintals: 44000, supplyVolumeQuintals: 45000, arrivalTons: 4500 }
    ]
  },
  {
    cropId: 'wheat',
    cropNameEn: 'Wheat (Sehore Sharbati)',
    cropNameHi: 'गेहूं (सीहोर शरबती)',
    cropIcon: '🌾',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High protein golden grain. Direct procurement to flour mills bypasses mandi commission and gunny bag fees.',
    seasonalNotesHi: 'उच्च प्रोटीन शरबती गेहूं। आटा मिलों को सीधी आपूर्ति मंडी टैक्स और आढ़त बचाती है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 2400, directFarmerPrice: 3300, consumerRetailPrice: 4800, demandVolumeQuintals: 30000, supplyVolumeQuintals: 32000, arrivalTons: 3200 },
      { month: 'Oct 25', avgMandiPrice: 2450, directFarmerPrice: 3380, consumerRetailPrice: 4900, demandVolumeQuintals: 31000, supplyVolumeQuintals: 31000, arrivalTons: 3100 },
      { month: 'Nov 25', avgMandiPrice: 2500, directFarmerPrice: 3450, consumerRetailPrice: 5000, demandVolumeQuintals: 33000, supplyVolumeQuintals: 30000, arrivalTons: 3000 },
      { month: 'Dec 25', avgMandiPrice: 2550, directFarmerPrice: 3500, consumerRetailPrice: 5100, demandVolumeQuintals: 35000, supplyVolumeQuintals: 29000, arrivalTons: 2900 },
      { month: 'Jan 26', avgMandiPrice: 2600, directFarmerPrice: 3580, consumerRetailPrice: 5200, demandVolumeQuintals: 36000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'Feb 26', avgMandiPrice: 2650, directFarmerPrice: 3650, consumerRetailPrice: 5300, demandVolumeQuintals: 37000, supplyVolumeQuintals: 27000, arrivalTons: 2700 },
      { month: 'Mar 26', avgMandiPrice: 2450, directFarmerPrice: 3400, consumerRetailPrice: 4900, demandVolumeQuintals: 32000, supplyVolumeQuintals: 45000, arrivalTons: 4500 },
      { month: 'Apr 26', avgMandiPrice: 2500, directFarmerPrice: 3450, consumerRetailPrice: 5000, demandVolumeQuintals: 33000, supplyVolumeQuintals: 42000, arrivalTons: 4200 },
      { month: 'May 26', avgMandiPrice: 2550, directFarmerPrice: 3520, consumerRetailPrice: 5100, demandVolumeQuintals: 34000, supplyVolumeQuintals: 39000, arrivalTons: 3900 },
      { month: 'Jun 26', avgMandiPrice: 2600, directFarmerPrice: 3580, consumerRetailPrice: 5150, demandVolumeQuintals: 35000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Jul 26', avgMandiPrice: 2620, directFarmerPrice: 3620, consumerRetailPrice: 5200, demandVolumeQuintals: 36000, supplyVolumeQuintals: 34000, arrivalTons: 3400 },
      { month: 'Aug 26', avgMandiPrice: 2650, directFarmerPrice: 3650, consumerRetailPrice: 5200, demandVolumeQuintals: 37000, supplyVolumeQuintals: 33000, arrivalTons: 3300 }
    ]
  },
  {
    cropId: 'rice_basmati',
    cropNameEn: 'Basmati Rice (1121 Raw Aromatic)',
    cropNameHi: 'बासमती चावल (1121 सुगन्धित)',
    cropIcon: '🍚',
    state: 'Punjab',
    district: 'Amritsar',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Export-grade long grain. Direct procurement to rice millers eliminates multi-tiered commission cuts.',
    seasonalNotesHi: 'निर्यात गुणवत्ता लंबा दाना। राइस मिलर्स को सीधी आपूर्ति से बिचौलियों का कमीशन समाप्त होता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 3500, directFarmerPrice: 5100, consumerRetailPrice: 7600, demandVolumeQuintals: 28000, supplyVolumeQuintals: 30000, arrivalTons: 3000 },
      { month: 'Oct 25', avgMandiPrice: 3650, directFarmerPrice: 5300, consumerRetailPrice: 7900, demandVolumeQuintals: 31000, supplyVolumeQuintals: 33000, arrivalTons: 3300 },
      { month: 'Nov 25', avgMandiPrice: 3800, directFarmerPrice: 5500, consumerRetailPrice: 8200, demandVolumeQuintals: 34000, supplyVolumeQuintals: 35000, arrivalTons: 3500 },
      { month: 'Dec 25', avgMandiPrice: 3900, directFarmerPrice: 5650, consumerRetailPrice: 8400, demandVolumeQuintals: 36000, supplyVolumeQuintals: 32000, arrivalTons: 3200 },
      { month: 'Jan 26', avgMandiPrice: 3850, directFarmerPrice: 5600, consumerRetailPrice: 8300, demandVolumeQuintals: 35000, supplyVolumeQuintals: 31000, arrivalTons: 3100 },
      { month: 'Feb 26', avgMandiPrice: 3950, directFarmerPrice: 5750, consumerRetailPrice: 8500, demandVolumeQuintals: 37000, supplyVolumeQuintals: 30000, arrivalTons: 3000 },
      { month: 'Mar 26', avgMandiPrice: 4000, directFarmerPrice: 5800, consumerRetailPrice: 8600, demandVolumeQuintals: 38000, supplyVolumeQuintals: 29000, arrivalTons: 2900 },
      { month: 'Apr 26', avgMandiPrice: 4050, directFarmerPrice: 5850, consumerRetailPrice: 8700, demandVolumeQuintals: 39000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'May 26', avgMandiPrice: 4100, directFarmerPrice: 5900, consumerRetailPrice: 8800, demandVolumeQuintals: 40000, supplyVolumeQuintals: 27000, arrivalTons: 2700 },
      { month: 'Jun 26', avgMandiPrice: 4100, directFarmerPrice: 5920, consumerRetailPrice: 8850, demandVolumeQuintals: 41000, supplyVolumeQuintals: 26000, arrivalTons: 2600 },
      { month: 'Jul 26', avgMandiPrice: 4100, directFarmerPrice: 5950, consumerRetailPrice: 8900, demandVolumeQuintals: 42000, supplyVolumeQuintals: 25000, arrivalTons: 2500 },
      { month: 'Aug 26', avgMandiPrice: 4100, directFarmerPrice: 5950, consumerRetailPrice: 8900, demandVolumeQuintals: 43000, supplyVolumeQuintals: 26000, arrivalTons: 2600 }
    ]
  },
  {
    cropId: 'mustard',
    cropNameEn: 'Mustard / Sarson (Pusa Bold)',
    cropNameHi: 'सरसों (पूसा बोल्ड उच्च तेल)',
    cropIcon: '🟡',
    state: 'Rajasthan',
    district: 'Bharatpur',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High oil content crop (41%+). Direct delivery to solvent extraction units secures premium price for farmers.',
    seasonalNotesHi: '41%+ तेल मात्रा। तेल मिलों को सीधी आपूर्ति से किसानों को अतिरिक्त बोनस मिलता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 5800, directFarmerPrice: 7100, consumerRetailPrice: 9800, demandVolumeQuintals: 22000, supplyVolumeQuintals: 24000, arrivalTons: 2400 },
      { month: 'Oct 25', avgMandiPrice: 5950, directFarmerPrice: 7250, consumerRetailPrice: 10000, demandVolumeQuintals: 24000, supplyVolumeQuintals: 23000, arrivalTons: 2300 },
      { month: 'Nov 25', avgMandiPrice: 6100, directFarmerPrice: 7400, consumerRetailPrice: 10300, demandVolumeQuintals: 27000, supplyVolumeQuintals: 22000, arrivalTons: 2200 },
      { month: 'Dec 25', avgMandiPrice: 6250, directFarmerPrice: 7600, consumerRetailPrice: 10500, demandVolumeQuintals: 29000, supplyVolumeQuintals: 21000, arrivalTons: 2100 },
      { month: 'Jan 26', avgMandiPrice: 6150, directFarmerPrice: 7450, consumerRetailPrice: 10200, demandVolumeQuintals: 26000, supplyVolumeQuintals: 25000, arrivalTons: 2500 },
      { month: 'Feb 26', avgMandiPrice: 5900, directFarmerPrice: 7200, consumerRetailPrice: 9800, demandVolumeQuintals: 25000, supplyVolumeQuintals: 34000, arrivalTons: 3400 },
      { month: 'Mar 26', avgMandiPrice: 5800, directFarmerPrice: 7100, consumerRetailPrice: 9600, demandVolumeQuintals: 28000, supplyVolumeQuintals: 42000, arrivalTons: 4200 },
      { month: 'Apr 26', avgMandiPrice: 6000, directFarmerPrice: 7350, consumerRetailPrice: 9900, demandVolumeQuintals: 30000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'May 26', avgMandiPrice: 6150, directFarmerPrice: 7550, consumerRetailPrice: 10200, demandVolumeQuintals: 32000, supplyVolumeQuintals: 30000, arrivalTons: 3000 },
      { month: 'Jun 26', avgMandiPrice: 6300, directFarmerPrice: 7700, consumerRetailPrice: 10500, demandVolumeQuintals: 33000, supplyVolumeQuintals: 27000, arrivalTons: 2700 },
      { month: 'Jul 26', avgMandiPrice: 6350, directFarmerPrice: 7800, consumerRetailPrice: 10700, demandVolumeQuintals: 34000, supplyVolumeQuintals: 25000, arrivalTons: 2500 },
      { month: 'Aug 26', avgMandiPrice: 6400, directFarmerPrice: 7850, consumerRetailPrice: 10800, demandVolumeQuintals: 35000, supplyVolumeQuintals: 24000, arrivalTons: 2400 }
    ]
  },
  {
    cropId: 'chili',
    cropNameEn: 'Red Chili (Guntur Sannam S4)',
    cropNameHi: 'लाल मिर्च (गुंटूर सन्नम)',
    cropIcon: '🌶️',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High pungency export spice. Direct procurement by spice processors prevents 18% moisture weight fraud.',
    seasonalNotesHi: 'उच्च तीखापन निर्यात मसाला। मसाला प्रसंस्करण इकाइयों को सीधी खरीद से नमी कटौती धोखाधड़ी रुकती है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 15500, directFarmerPrice: 20500, consumerRetailPrice: 29000, demandVolumeQuintals: 12000, supplyVolumeQuintals: 13000, arrivalTons: 1300 },
      { month: 'Oct 25', avgMandiPrice: 16200, directFarmerPrice: 21200, consumerRetailPrice: 30200, demandVolumeQuintals: 13500, supplyVolumeQuintals: 12500, arrivalTons: 1250 },
      { month: 'Nov 25', avgMandiPrice: 16800, directFarmerPrice: 22000, consumerRetailPrice: 31500, demandVolumeQuintals: 15000, supplyVolumeQuintals: 12000, arrivalTons: 1200 },
      { month: 'Dec 25', avgMandiPrice: 17200, directFarmerPrice: 22800, consumerRetailPrice: 32500, demandVolumeQuintals: 16500, supplyVolumeQuintals: 11500, arrivalTons: 1150 },
      { month: 'Jan 26', avgMandiPrice: 16800, directFarmerPrice: 22200, consumerRetailPrice: 31500, demandVolumeQuintals: 14000, supplyVolumeQuintals: 15000, arrivalTons: 1500 },
      { month: 'Feb 26', avgMandiPrice: 16000, directFarmerPrice: 21000, consumerRetailPrice: 29500, demandVolumeQuintals: 13000, supplyVolumeQuintals: 21000, arrivalTons: 2100 },
      { month: 'Mar 26', avgMandiPrice: 15800, directFarmerPrice: 20800, consumerRetailPrice: 29000, demandVolumeQuintals: 14500, supplyVolumeQuintals: 26000, arrivalTons: 2600 },
      { month: 'Apr 26', avgMandiPrice: 16500, directFarmerPrice: 21800, consumerRetailPrice: 31000, demandVolumeQuintals: 16000, supplyVolumeQuintals: 20000, arrivalTons: 2000 },
      { month: 'May 26', avgMandiPrice: 17000, directFarmerPrice: 22600, consumerRetailPrice: 32500, demandVolumeQuintals: 17000, supplyVolumeQuintals: 16000, arrivalTons: 1600 },
      { month: 'Jun 26', avgMandiPrice: 17200, directFarmerPrice: 23000, consumerRetailPrice: 33200, demandVolumeQuintals: 18000, supplyVolumeQuintals: 14000, arrivalTons: 1400 },
      { month: 'Jul 26', avgMandiPrice: 17400, directFarmerPrice: 23300, consumerRetailPrice: 33800, demandVolumeQuintals: 19000, supplyVolumeQuintals: 13000, arrivalTons: 1300 },
      { month: 'Aug 26', avgMandiPrice: 17500, directFarmerPrice: 23500, consumerRetailPrice: 34000, demandVolumeQuintals: 19500, supplyVolumeQuintals: 13500, arrivalTons: 1350 }
    ]
  },
  {
    cropId: 'apple',
    cropNameEn: 'Apple (Shimla Royal Delicious)',
    cropNameHi: 'सेब (शिमला रॉयल डेलिशियस)',
    cropIcon: '🍎',
    state: 'Himachal Pradesh',
    district: 'Shimla',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High-altitude orchard harvest. Refrigerated container logistics directly to metro retail prevents transit bruising and commission gouging.',
    seasonalNotesHi: 'उच्च पर्वतीय बागान सेब। मेट्रो शहरों को सीधी कोल्ड वैन आपूर्ति से बिचौलियों का 40% मार्जिन कटता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 6500, directFarmerPrice: 9800, consumerRetailPrice: 15500, demandVolumeQuintals: 25000, supplyVolumeQuintals: 30000, arrivalTons: 3000 },
      { month: 'Oct 25', avgMandiPrice: 7000, directFarmerPrice: 10500, consumerRetailPrice: 16500, demandVolumeQuintals: 28000, supplyVolumeQuintals: 27000, arrivalTons: 2700 },
      { month: 'Nov 25', avgMandiPrice: 7500, directFarmerPrice: 11400, consumerRetailPrice: 17800, demandVolumeQuintals: 30000, supplyVolumeQuintals: 22000, arrivalTons: 2200 },
      { month: 'Dec 25', avgMandiPrice: 8000, directFarmerPrice: 12200, consumerRetailPrice: 19000, demandVolumeQuintals: 33000, supplyVolumeQuintals: 18000, arrivalTons: 1800 },
      { month: 'Jan 26', avgMandiPrice: 8200, directFarmerPrice: 12500, consumerRetailPrice: 19500, demandVolumeQuintals: 32000, supplyVolumeQuintals: 16000, arrivalTons: 1600 },
      { month: 'Feb 26', avgMandiPrice: 8400, directFarmerPrice: 12800, consumerRetailPrice: 20000, demandVolumeQuintals: 31000, supplyVolumeQuintals: 14000, arrivalTons: 1400 },
      { month: 'Mar 26', avgMandiPrice: 8600, directFarmerPrice: 13000, consumerRetailPrice: 20500, demandVolumeQuintals: 30000, supplyVolumeQuintals: 12000, arrivalTons: 1200 },
      { month: 'Apr 26', avgMandiPrice: 8800, directFarmerPrice: 13400, consumerRetailPrice: 21000, demandVolumeQuintals: 29000, supplyVolumeQuintals: 10000, arrivalTons: 1000 },
      { month: 'May 26', avgMandiPrice: 9000, directFarmerPrice: 13800, consumerRetailPrice: 21500, demandVolumeQuintals: 28000, supplyVolumeQuintals: 9000, arrivalTons: 900 },
      { month: 'Jun 26', avgMandiPrice: 9200, directFarmerPrice: 14000, consumerRetailPrice: 22000, demandVolumeQuintals: 27000, supplyVolumeQuintals: 8000, arrivalTons: 800 },
      { month: 'Jul 26', avgMandiPrice: 7500, directFarmerPrice: 11500, consumerRetailPrice: 18000, demandVolumeQuintals: 26000, supplyVolumeQuintals: 24000, arrivalTons: 2400 },
      { month: 'Aug 26', avgMandiPrice: 7200, directFarmerPrice: 11200, consumerRetailPrice: 17500, demandVolumeQuintals: 29000, supplyVolumeQuintals: 32000, arrivalTons: 3200 }
    ]
  },
  {
    cropId: 'turmeric',
    cropNameEn: 'Turmeric / Haldi (Salem Double Polished)',
    cropNameHi: 'हल्दी (सलेम डबल पॉलिश्ड 4.5% करक्यूमिन)',
    cropIcon: '🌿',
    state: 'Tamil Nadu',
    district: 'Salem',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High-curcumin medicinal finger turmeric. Direct pharmaceutical & culinary supply cuts intermediate grading deductions.',
    seasonalNotesHi: '4.5%+ करक्यूमिन औषधि हल्दी। मसाला व फार्मा कंपनियों को सीधी बिक्री से मंडी आढ़त बचती है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 12000, directFarmerPrice: 16500, consumerRetailPrice: 24000, demandVolumeQuintals: 14000, supplyVolumeQuintals: 15000, arrivalTons: 1500 },
      { month: 'Oct 25', avgMandiPrice: 12500, directFarmerPrice: 17100, consumerRetailPrice: 25000, demandVolumeQuintals: 15500, supplyVolumeQuintals: 14500, arrivalTons: 1450 },
      { month: 'Nov 25', avgMandiPrice: 13100, directFarmerPrice: 17900, consumerRetailPrice: 26200, demandVolumeQuintals: 17000, supplyVolumeQuintals: 13500, arrivalTons: 1350 },
      { month: 'Dec 25', avgMandiPrice: 13600, directFarmerPrice: 18500, consumerRetailPrice: 27000, demandVolumeQuintals: 18000, supplyVolumeQuintals: 13000, arrivalTons: 1300 },
      { month: 'Jan 26', avgMandiPrice: 13200, directFarmerPrice: 18000, consumerRetailPrice: 26400, demandVolumeQuintals: 16000, supplyVolumeQuintals: 16000, arrivalTons: 1600 },
      { month: 'Feb 26', avgMandiPrice: 12600, directFarmerPrice: 17200, consumerRetailPrice: 25000, demandVolumeQuintals: 15000, supplyVolumeQuintals: 22000, arrivalTons: 2200 },
      { month: 'Mar 26', avgMandiPrice: 12400, directFarmerPrice: 17000, consumerRetailPrice: 24800, demandVolumeQuintals: 16000, supplyVolumeQuintals: 27000, arrivalTons: 2700 },
      { month: 'Apr 26', avgMandiPrice: 13000, directFarmerPrice: 17800, consumerRetailPrice: 26000, demandVolumeQuintals: 17500, supplyVolumeQuintals: 21000, arrivalTons: 2100 },
      { month: 'May 26', avgMandiPrice: 13600, directFarmerPrice: 18500, consumerRetailPrice: 27200, demandVolumeQuintals: 18500, supplyVolumeQuintals: 17000, arrivalTons: 1700 },
      { month: 'Jun 26', avgMandiPrice: 14000, directFarmerPrice: 19000, consumerRetailPrice: 28000, demandVolumeQuintals: 19500, supplyVolumeQuintals: 15000, arrivalTons: 1500 },
      { month: 'Jul 26', avgMandiPrice: 14150, directFarmerPrice: 19150, consumerRetailPrice: 28300, demandVolumeQuintals: 20500, supplyVolumeQuintals: 14000, arrivalTons: 1400 },
      { month: 'Aug 26', avgMandiPrice: 14200, directFarmerPrice: 19200, consumerRetailPrice: 28500, demandVolumeQuintals: 21000, supplyVolumeQuintals: 14500, arrivalTons: 1450 }
    ]
  },
  {
    cropId: 'cotton',
    cropNameEn: 'Cotton / Kapas (Gujarat Shankar-6)',
    cropNameHi: 'कपास (गुजरात शंकर-6 लंबा रेशा)',
    cropIcon: '☁️',
    state: 'Gujarat',
    district: 'Rajkot',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Long staple lint. Direct delivery to spinning textile mills eliminates intermediate ginner commission cuts.',
    seasonalNotesHi: 'लंबा रेशा शंकर-6 कपास। टेक्सटाइल स्पिनिंग मिलों को सीधी आपूर्ति से आढ़त समाप्त होती है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 6800, directFarmerPrice: 8400, consumerRetailPrice: 12200, demandVolumeQuintals: 24000, supplyVolumeQuintals: 26000, arrivalTons: 2600 },
      { month: 'Oct 25', avgMandiPrice: 7000, directFarmerPrice: 8650, consumerRetailPrice: 12500, demandVolumeQuintals: 27000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'Nov 25', avgMandiPrice: 7150, directFarmerPrice: 8850, consumerRetailPrice: 12800, demandVolumeQuintals: 30000, supplyVolumeQuintals: 31000, arrivalTons: 3100 },
      { month: 'Dec 25', avgMandiPrice: 7300, directFarmerPrice: 9050, consumerRetailPrice: 13100, demandVolumeQuintals: 33000, supplyVolumeQuintals: 29000, arrivalTons: 2900 },
      { month: 'Jan 26', avgMandiPrice: 7200, directFarmerPrice: 8900, consumerRetailPrice: 12900, demandVolumeQuintals: 31000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'Feb 26', avgMandiPrice: 7250, directFarmerPrice: 8950, consumerRetailPrice: 13000, demandVolumeQuintals: 32000, supplyVolumeQuintals: 26000, arrivalTons: 2600 },
      { month: 'Mar 26', avgMandiPrice: 7300, directFarmerPrice: 9000, consumerRetailPrice: 13200, demandVolumeQuintals: 34000, supplyVolumeQuintals: 24000, arrivalTons: 2400 },
      { month: 'Apr 26', avgMandiPrice: 7350, directFarmerPrice: 9050, consumerRetailPrice: 13300, demandVolumeQuintals: 35000, supplyVolumeQuintals: 22000, arrivalTons: 2200 },
      { month: 'May 26', avgMandiPrice: 7400, directFarmerPrice: 9100, consumerRetailPrice: 13500, demandVolumeQuintals: 36000, supplyVolumeQuintals: 20000, arrivalTons: 2000 },
      { month: 'Jun 26', avgMandiPrice: 7420, directFarmerPrice: 9120, consumerRetailPrice: 13600, demandVolumeQuintals: 37000, supplyVolumeQuintals: 18000, arrivalTons: 1800 },
      { month: 'Jul 26', avgMandiPrice: 7450, directFarmerPrice: 9150, consumerRetailPrice: 13750, demandVolumeQuintals: 38000, supplyVolumeQuintals: 17000, arrivalTons: 1700 },
      { month: 'Aug 26', avgMandiPrice: 7450, directFarmerPrice: 9150, consumerRetailPrice: 13800, demandVolumeQuintals: 38500, supplyVolumeQuintals: 17500, arrivalTons: 1750 }
    ]
  },
  {
    cropId: 'maize',
    cropNameEn: 'Yellow Maize / Corn (Purnia High Starch)',
    cropNameHi: 'पीला मक्का (पूर्णिया उच्च स्टार्च)',
    cropIcon: '🌽',
    state: 'Bihar',
    district: 'Purnia',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High yield feed & industrial starch grain. Direct supply to feed plants and starch mills secures ₹800/qtl bonus.',
    seasonalNotesHi: 'उच्च स्टार्च औद्योगिक मक्का। पोल्ट्री व स्टार्च मिलों को सीधी बिक्री से ₹800/क्विंटल अतिरिक्त लाभ।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 1850, directFarmerPrice: 2550, consumerRetailPrice: 3600, demandVolumeQuintals: 35000, supplyVolumeQuintals: 38000, arrivalTons: 3800 },
      { month: 'Oct 25', avgMandiPrice: 1900, directFarmerPrice: 2620, consumerRetailPrice: 3700, demandVolumeQuintals: 37000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Nov 25', avgMandiPrice: 1980, directFarmerPrice: 2720, consumerRetailPrice: 3850, demandVolumeQuintals: 40000, supplyVolumeQuintals: 35000, arrivalTons: 3500 },
      { month: 'Dec 25', avgMandiPrice: 2050, directFarmerPrice: 2800, consumerRetailPrice: 4000, demandVolumeQuintals: 42000, supplyVolumeQuintals: 34000, arrivalTons: 3400 },
      { month: 'Jan 26', avgMandiPrice: 2000, directFarmerPrice: 2750, consumerRetailPrice: 3900, demandVolumeQuintals: 39000, supplyVolumeQuintals: 37000, arrivalTons: 3700 },
      { month: 'Feb 26', avgMandiPrice: 1920, directFarmerPrice: 2650, consumerRetailPrice: 3750, demandVolumeQuintals: 38000, supplyVolumeQuintals: 41000, arrivalTons: 4100 },
      { month: 'Mar 26', avgMandiPrice: 1880, directFarmerPrice: 2600, consumerRetailPrice: 3650, demandVolumeQuintals: 41000, supplyVolumeQuintals: 49000, arrivalTons: 4900 },
      { month: 'Apr 26', avgMandiPrice: 1950, directFarmerPrice: 2680, consumerRetailPrice: 3800, demandVolumeQuintals: 43000, supplyVolumeQuintals: 44000, arrivalTons: 4400 },
      { month: 'May 26', avgMandiPrice: 2020, directFarmerPrice: 2780, consumerRetailPrice: 3950, demandVolumeQuintals: 45000, supplyVolumeQuintals: 39000, arrivalTons: 3900 },
      { month: 'Jun 26', avgMandiPrice: 2100, directFarmerPrice: 2880, consumerRetailPrice: 4100, demandVolumeQuintals: 47000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Jul 26', avgMandiPrice: 2140, directFarmerPrice: 2920, consumerRetailPrice: 4180, demandVolumeQuintals: 48000, supplyVolumeQuintals: 35000, arrivalTons: 3500 },
      { month: 'Aug 26', avgMandiPrice: 2150, directFarmerPrice: 2950, consumerRetailPrice: 4200, demandVolumeQuintals: 49000, supplyVolumeQuintals: 35500, arrivalTons: 3550 }
    ]
  },
  {
    cropId: 'soybean',
    cropNameEn: 'Soybean / Soyabean (Indore Yellow Gold)',
    cropNameHi: 'सोयाबीन (इंदौर पीला सोना)',
    cropIcon: '🌱',
    state: 'Madhya Pradesh',
    district: 'Indore',
    unit: '₹/Quintal',
    seasonalNotesEn: 'High protein and oil content. Direct procurement to oil extraction plants removes mandi tax and bag deductions.',
    seasonalNotesHi: 'उच्च प्रोटीन व तेल मात्रा। तेल प्रसंस्करण संयंत्रों को सीधी बिक्री से मंडी टैक्स की बचत।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 4300, directFarmerPrice: 5400, consumerRetailPrice: 7600, demandVolumeQuintals: 30000, supplyVolumeQuintals: 32000, arrivalTons: 3200 },
      { month: 'Oct 25', avgMandiPrice: 4400, directFarmerPrice: 5550, consumerRetailPrice: 7800, demandVolumeQuintals: 33000, supplyVolumeQuintals: 35000, arrivalTons: 3500 },
      { month: 'Nov 25', avgMandiPrice: 4500, directFarmerPrice: 5700, consumerRetailPrice: 8000, demandVolumeQuintals: 36000, supplyVolumeQuintals: 33000, arrivalTons: 3300 },
      { month: 'Dec 25', avgMandiPrice: 4600, directFarmerPrice: 5800, consumerRetailPrice: 8200, demandVolumeQuintals: 38000, supplyVolumeQuintals: 31000, arrivalTons: 3100 },
      { month: 'Jan 26', avgMandiPrice: 4500, directFarmerPrice: 5700, consumerRetailPrice: 8050, demandVolumeQuintals: 35000, supplyVolumeQuintals: 32000, arrivalTons: 3200 },
      { month: 'Feb 26', avgMandiPrice: 4450, directFarmerPrice: 5600, consumerRetailPrice: 7900, demandVolumeQuintals: 34000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Mar 26', avgMandiPrice: 4400, directFarmerPrice: 5550, consumerRetailPrice: 7800, demandVolumeQuintals: 33000, supplyVolumeQuintals: 40000, arrivalTons: 4000 },
      { month: 'Apr 26', avgMandiPrice: 4500, directFarmerPrice: 5700, consumerRetailPrice: 8000, demandVolumeQuintals: 36000, supplyVolumeQuintals: 35000, arrivalTons: 3500 },
      { month: 'May 26', avgMandiPrice: 4600, directFarmerPrice: 5850, consumerRetailPrice: 8200, demandVolumeQuintals: 38000, supplyVolumeQuintals: 31000, arrivalTons: 3100 },
      { month: 'Jun 26', avgMandiPrice: 4620, directFarmerPrice: 5900, consumerRetailPrice: 8300, demandVolumeQuintals: 40000, supplyVolumeQuintals: 28000, arrivalTons: 2800 },
      { month: 'Jul 26', avgMandiPrice: 4640, directFarmerPrice: 5920, consumerRetailPrice: 8350, demandVolumeQuintals: 41000, supplyVolumeQuintals: 26000, arrivalTons: 2600 },
      { month: 'Aug 26', avgMandiPrice: 4650, directFarmerPrice: 5950, consumerRetailPrice: 8400, demandVolumeQuintals: 42000, supplyVolumeQuintals: 27000, arrivalTons: 2700 }
    ]
  },
  {
    cropId: 'cardamom',
    cropNameEn: 'Cardamom / Elaichi (Idukki 8mm Bold)',
    cropNameHi: 'हरी इलायची (इडुक्की 8mm एक्स्ट्रा बोल्ड)',
    cropIcon: '🌿',
    state: 'Kerala',
    district: 'Idukki',
    unit: '₹/Quintal',
    seasonalNotesEn: 'GI tagged high-aroma queen of spices. Direct sale to premium tea blenders and exporters guarantees zero commission gouging.',
    seasonalNotesHi: 'जीआई प्रमाणित सुगंधित इलायची। चाय ब्लेंडर्स और निर्यातकों को सीधी बिक्री से बिचौलियों का कट रुकता है।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 195000, directFarmerPrice: 255000, consumerRetailPrice: 350000, demandVolumeQuintals: 1800, supplyVolumeQuintals: 2000, arrivalTons: 200 },
      { month: 'Oct 25', avgMandiPrice: 200000, directFarmerPrice: 265000, consumerRetailPrice: 365000, demandVolumeQuintals: 2100, supplyVolumeQuintals: 2100, arrivalTons: 210 },
      { month: 'Nov 25', avgMandiPrice: 210000, directFarmerPrice: 275000, consumerRetailPrice: 380000, demandVolumeQuintals: 2400, supplyVolumeQuintals: 1900, arrivalTons: 190 },
      { month: 'Dec 25', avgMandiPrice: 215000, directFarmerPrice: 285000, consumerRetailPrice: 395000, demandVolumeQuintals: 2600, supplyVolumeQuintals: 1800, arrivalTons: 180 },
      { month: 'Jan 26', avgMandiPrice: 212000, directFarmerPrice: 280000, consumerRetailPrice: 390000, demandVolumeQuintals: 2300, supplyVolumeQuintals: 1900, arrivalTons: 190 },
      { month: 'Feb 26', avgMandiPrice: 205000, directFarmerPrice: 270000, consumerRetailPrice: 375000, demandVolumeQuintals: 2000, supplyVolumeQuintals: 2400, arrivalTons: 240 },
      { month: 'Mar 26', avgMandiPrice: 200000, directFarmerPrice: 265000, consumerRetailPrice: 370000, demandVolumeQuintals: 1900, supplyVolumeQuintals: 2700, arrivalTons: 270 },
      { month: 'Apr 26', avgMandiPrice: 208000, directFarmerPrice: 275000, consumerRetailPrice: 385000, demandVolumeQuintals: 2200, supplyVolumeQuintals: 2300, arrivalTons: 230 },
      { month: 'May 26', avgMandiPrice: 212000, directFarmerPrice: 280000, consumerRetailPrice: 395000, demandVolumeQuintals: 2400, supplyVolumeQuintals: 1900, arrivalTons: 190 },
      { month: 'Jun 26', avgMandiPrice: 214000, directFarmerPrice: 282000, consumerRetailPrice: 400000, demandVolumeQuintals: 2500, supplyVolumeQuintals: 1700, arrivalTons: 170 },
      { month: 'Jul 26', avgMandiPrice: 215000, directFarmerPrice: 284000, consumerRetailPrice: 405000, demandVolumeQuintals: 2700, supplyVolumeQuintals: 1600, arrivalTons: 160 },
      { month: 'Aug 26', avgMandiPrice: 215000, directFarmerPrice: 285000, consumerRetailPrice: 410000, demandVolumeQuintals: 2800, supplyVolumeQuintals: 1650, arrivalTons: 165 }
    ]
  },
  {
    cropId: 'sona_masoori',
    cropNameEn: 'Sona Masoori Rice (Nalgonda Medium Grain)',
    cropNameHi: 'सोना मसूरी चावल (नालगोंडा माध्यम दाना)',
    cropIcon: '🌾',
    state: 'Telangana',
    district: 'Nalgonda',
    unit: '₹/Quintal',
    seasonalNotesEn: 'Lightweight aromatic daily staple. Institutional procurement by bulk caterers delivers maximum farmgate value.',
    seasonalNotesHi: 'दैनिक भोजन के लिए लोकप्रिय सुगंधित चावल। संस्थागत थोक खरीदारों को सीधी आपूर्ति से किसान को अधिक मूल्य।',
    history: [
      { month: 'Sep 25', avgMandiPrice: 3200, directFarmerPrice: 4300, consumerRetailPrice: 6100, demandVolumeQuintals: 32000, supplyVolumeQuintals: 34000, arrivalTons: 3400 },
      { month: 'Oct 25', avgMandiPrice: 3250, directFarmerPrice: 4400, consumerRetailPrice: 6250, demandVolumeQuintals: 35000, supplyVolumeQuintals: 36000, arrivalTons: 3600 },
      { month: 'Nov 25', avgMandiPrice: 3350, directFarmerPrice: 4500, consumerRetailPrice: 6400, demandVolumeQuintals: 38000, supplyVolumeQuintals: 34000, arrivalTons: 3400 },
      { month: 'Dec 25', avgMandiPrice: 3400, directFarmerPrice: 4600, consumerRetailPrice: 6550, demandVolumeQuintals: 40000, supplyVolumeQuintals: 33000, arrivalTons: 3300 },
      { month: 'Jan 26', avgMandiPrice: 3380, directFarmerPrice: 4550, consumerRetailPrice: 6450, demandVolumeQuintals: 37000, supplyVolumeQuintals: 35000, arrivalTons: 3500 },
      { month: 'Feb 26', avgMandiPrice: 3300, directFarmerPrice: 4450, consumerRetailPrice: 6300, demandVolumeQuintals: 36000, supplyVolumeQuintals: 38000, arrivalTons: 3800 },
      { month: 'Mar 26', avgMandiPrice: 3250, directFarmerPrice: 4400, consumerRetailPrice: 6200, demandVolumeQuintals: 37000, supplyVolumeQuintals: 42000, arrivalTons: 4200 },
      { month: 'Apr 26', avgMandiPrice: 3320, directFarmerPrice: 4500, consumerRetailPrice: 6350, demandVolumeQuintals: 39000, supplyVolumeQuintals: 37000, arrivalTons: 3700 },
      { month: 'May 26', avgMandiPrice: 3380, directFarmerPrice: 4600, consumerRetailPrice: 6500, demandVolumeQuintals: 41000, supplyVolumeQuintals: 33000, arrivalTons: 3300 },
      { month: 'Jun 26', avgMandiPrice: 3420, directFarmerPrice: 4680, consumerRetailPrice: 6650, demandVolumeQuintals: 43000, supplyVolumeQuintals: 30000, arrivalTons: 3000 },
      { month: 'Jul 26', avgMandiPrice: 3440, directFarmerPrice: 4720, consumerRetailPrice: 6720, demandVolumeQuintals: 44000, supplyVolumeQuintals: 29000, arrivalTons: 2900 },
      { month: 'Aug 26', avgMandiPrice: 3450, directFarmerPrice: 4750, consumerRetailPrice: 6800, demandVolumeQuintals: 45000, supplyVolumeQuintals: 30000, arrivalTons: 3000 }
    ]
  }
];

export const HISTORICAL_CROP_DATASETS = REGIONAL_HISTORICAL_DATASETS;
