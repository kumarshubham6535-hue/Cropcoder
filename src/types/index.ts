export type Language = 'hi' | 'en' | 'mr' | 'te' | 'ta' | 'kn' | 'gu' | 'pa';

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'healthy';

export type CropCategory = 
  | 'potato'
  | 'tomato'
  | 'rice'
  | 'wheat'
  | 'cotton'
  | 'chilli'
  | 'mustard'
  | 'sugarcane'
  | 'soybean'
  | 'groundnut'
  | 'maize'
  | 'onion'
  | 'gram'
  | 'tea'
  | 'mango'
  | 'banana';

export interface TreatmentChemical {
  tradeName: string;
  genericName: string;
  dosagePerLiter: string;
  dosagePerAcre: string;
  waterPerAcre: string;
  applicationMethod: string;
  waitingPeriodDays: number; // Pre-harvest interval (PHI)
  sprayIntervalDays: string;
  cibrcApproved: boolean;
  precautions: string[];
}

export interface TreatmentOrganic {
  name: string;
  nameHindi: string;
  ingredients: string;
  dosagePerLiter: string;
  preparationMethod: string;
  applicationSchedule: string;
  bestTime: string;
  costEfficiency: string;
}

export interface DiseaseInfo {
  id: string;
  crop: CropCategory;
  cropNameEn: string;
  cropNameHi: string;
  cropIcon: string;
  nameEn: string;
  nameHi: string;
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest' | 'Physiological' | 'None';
  scientificName: string;
  severity: SeverityLevel;
  confidenceRange: [number, number]; // e.g. [91, 98]
  symptoms: {
    en: string[];
    hi: string[];
  };
  causes: {
    en: string;
    hi: string;
  };
  favorableWeather: {
    temp: string;
    humidity: string;
    season: string;
  };
  treatments: {
    chemical: TreatmentChemical[];
    organic: TreatmentOrganic[];
  };
  preventionTips: {
    en: string[];
    hi: string[];
  };
  sampleImage: string;
  fallbackColor: string;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  crop: CropCategory;
  cropNameEn: string;
  cropNameHi: string;
  disease: DiseaseInfo;
  confidence: number;
  imageUrl: string;
  severity: SeverityLevel;
  farmAreaAcres?: number;
  fieldLocation?: string;
  status?: 'Treated' | 'Follow-up' | 'Critical' | 'Healthy';
  notes?: string;
  userId?: string;
  userPhone?: string;
  userName?: string;
}

export interface DosageInput {
  areaValue: number;
  areaUnit: 'acre' | 'bigha' | 'hectare' | 'guntha';
  tankCapacityLiters: number;
}
