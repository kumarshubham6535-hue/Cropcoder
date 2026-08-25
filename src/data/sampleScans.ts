import { ScanResult } from '../types';
import { CROP_DISEASES } from './cropDiseases';

export const INITIAL_SAMPLE_SCANS: ScanResult[] = [
  {
    id: 'scan-001',
    timestamp: '2026-08-23 09:14 AM',
    crop: 'potato',
    cropNameEn: 'Potato',
    cropNameHi: 'आलू',
    disease: CROP_DISEASES[0], // Late Blight
    confidence: 96.4,
    imageUrl: CROP_DISEASES[0].sampleImage,
    severity: 'severe',
    farmAreaAcres: 2.5,
    fieldLocation: 'Plot 4A - North Ridge',
    status: 'Treated',
    notes: 'Sprayed Mancozeb 75% WP @ 2.5g/L on 24th Aug morning. Humidity 88%.'
  },
  {
    id: 'scan-002',
    timestamp: '2026-08-20 04:30 PM',
    crop: 'tomato',
    cropNameEn: 'Tomato',
    cropNameHi: 'टमाटर',
    disease: CROP_DISEASES[1], // Early Blight
    confidence: 93.8,
    imageUrl: CROP_DISEASES[1].sampleImage,
    severity: 'moderate',
    farmAreaAcres: 1.0,
    fieldLocation: 'Polyhouse 2',
    status: 'Follow-up',
    notes: 'Applied Azoxystrobin foliar spray. Pruned lower 30cm leaf canopy.'
  },
  {
    id: 'scan-003',
    timestamp: '2026-08-16 11:05 AM',
    crop: 'rice',
    cropNameEn: 'Paddy / Rice',
    cropNameHi: 'धान',
    disease: CROP_DISEASES[2], // Rice Blast
    confidence: 95.1,
    imageUrl: CROP_DISEASES[2].sampleImage,
    severity: 'severe',
    farmAreaAcres: 4.0,
    fieldLocation: 'South Canal Block',
    status: 'Treated',
    notes: 'Tricyclazole applied at boot leaf emergence stage.'
  },
  {
    id: 'scan-004',
    timestamp: '2026-08-10 08:45 AM',
    crop: 'wheat',
    cropNameEn: 'Wheat',
    cropNameHi: 'गेहूं',
    disease: CROP_DISEASES[3], // Yellow Rust
    confidence: 97.2,
    imageUrl: CROP_DISEASES[3].sampleImage,
    severity: 'severe',
    farmAreaAcres: 3.5,
    fieldLocation: 'Tubewell Sector 1',
    status: 'Treated',
    notes: 'Propiconazole 25% EC applied with knapsack mist blower.'
  },
  {
    id: 'scan-005',
    timestamp: '2026-08-04 02:15 PM',
    crop: 'cotton',
    cropNameEn: 'Cotton',
    cropNameHi: 'कपास',
    disease: CROP_DISEASES[4], // Bacterial Blight
    confidence: 91.5,
    imageUrl: CROP_DISEASES[4].sampleImage,
    severity: 'moderate',
    farmAreaAcres: 2.0,
    fieldLocation: 'East Farm Border',
    status: 'Follow-up',
    notes: 'Sprayed Streptocycline + Copper Oxychloride mix.'
  },
  {
    id: 'scan-006',
    timestamp: '2026-07-28 10:20 AM',
    crop: 'tomato',
    cropNameEn: 'Tomato',
    cropNameHi: 'टमाटर',
    disease: CROP_DISEASES[6], // Healthy
    confidence: 98.7,
    imageUrl: CROP_DISEASES[6].sampleImage,
    severity: 'healthy',
    farmAreaAcres: 1.5,
    fieldLocation: 'Block B - Nursery',
    status: 'Healthy',
    notes: 'Healthy vegetative growth, Panchagavya 3% preventive tonic applied.'
  }
];

export const MONTHLY_TREND_DATA = [
  { month: 'Mar', potatoBlight: 12, wheatRust: 38, riceBlast: 5, cottonBlight: 2, totalScans: 57 },
  { month: 'Apr', potatoBlight: 8, wheatRust: 45, riceBlast: 4, cottonBlight: 3, totalScans: 60 },
  { month: 'May', potatoBlight: 4, wheatRust: 10, riceBlast: 8, cottonBlight: 14, totalScans: 36 },
  { month: 'Jun', potatoBlight: 6, wheatRust: 2, riceBlast: 18, cottonBlight: 28, totalScans: 54 },
  { month: 'Jul', potatoBlight: 19, wheatRust: 0, riceBlast: 34, cottonBlight: 42, totalScans: 95 },
  { month: 'Aug', potatoBlight: 41, wheatRust: 0, riceBlast: 48, cottonBlight: 39, totalScans: 128 }
];

export const SEVERITY_DISTRIBUTION = [
  { name: 'Healthy (स्वस्थ)', value: 32, color: '#166534' },
  { name: 'Mild (हल्का)', value: 24, color: '#2563EB' },
  { name: 'Moderate (मध्यम)', value: 28, color: '#D97706' },
  { name: 'Severe (गंभीर)', value: 44, color: '#DC2626' }
];
