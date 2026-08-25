import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ScanResult } from '../types';

// Default Supabase project configuration provided by user
export const DEFAULT_SUPABASE_PROJECT_ID = 'gzwketwuirwtwrbkhbiz';
export const DEFAULT_SUPABASE_URL = 'https://gzwketwuirwtwrbkhbiz.supabase.co';

// Helper to get stored key or env var
export const getSupabaseConfig = () => {
  const metaEnv = (import.meta as any).env || {};
  const storedUrl = localStorage.getItem('krishi_supabase_url') || metaEnv.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const storedKey = localStorage.getItem('krishi_supabase_anon_key') || metaEnv.VITE_SUPABASE_ANON_KEY || '';
  return { url: storedUrl, anonKey: storedKey };
};

export const setSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem('krishi_supabase_url', url);
  localStorage.setItem('krishi_supabase_anon_key', anonKey);
};

let supabaseInstance: SupabaseClient | null = null;
let currentKey = '';
let currentUrl = '';

export const getSupabase = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }
  if (!supabaseInstance || currentKey !== anonKey || currentUrl !== url) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      currentKey = anonKey;
      currentUrl = url;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

// SQL Schema for the user to run in Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- KRISHISCAN (कृषिस्कैन) - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Project ID: gzwketwuirwtwrbkhbiz
-- Designed for Smart India Hackathon Precision Crop Pathology Advisory
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Farmer Profiles table
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_code VARCHAR(32) UNIQUE DEFAULT ('KRISHI-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6))),
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    state VARCHAR(50) DEFAULT 'Maharashtra',
    district VARCHAR(50) DEFAULT 'Nashik',
    village VARCHAR(100),
    total_land_acres NUMERIC(6, 2) DEFAULT 4.5,
    primary_crop VARCHAR(50) DEFAULT 'potato',
    preferred_language VARCHAR(10) DEFAULT 'hi',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Crops Directory Table
CREATE TABLE IF NOT EXISTS public.crops (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    season VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Insert Default Crops (All 16 Commercial & Staple Agricultural Crops)
INSERT INTO public.crops (id, name_en, name_hi, icon, season)
VALUES 
    ('potato', 'Potato', 'आलू', '🥔', 'Rabi/Winter'),
    ('tomato', 'Tomato', 'टमाटर', '🍅', 'Year-round'),
    ('rice', 'Paddy / Rice', 'धान / चावल', '🌾', 'Kharif/Monsoon'),
    ('wheat', 'Wheat', 'गेहूं', '🌾', 'Rabi/Winter'),
    ('mustard', 'Mustard / Rapeseed', 'सरसों / राई', '🌼', 'Rabi/Winter'),
    ('cotton', 'Cotton', 'कपास', '🌱', 'Kharif/Monsoon'),
    ('sugarcane', 'Sugarcane', 'गन्ना', '🎋', 'Perennial/Monsoon'),
    ('chilli', 'Chilli', 'मिर्च', '🌶️', 'Kharif/Rabi'),
    ('soybean', 'Soybean', 'सोयाबीन', '🌱', 'Kharif/Monsoon'),
    ('groundnut', 'Groundnut / Peanut', 'मूंगफली', '🥜', 'Kharif/Summer'),
    ('maize', 'Maize / Corn', 'मक्का', '🌽', 'Kharif/Rabi'),
    ('onion', 'Onion / Garlic', 'प्याज / लहसुन', '🧅', 'Rabi/Kharif'),
    ('gram', 'Gram / Chickpea', 'चना / छोले', '🧆', 'Rabi/Winter'),
    ('mango', 'Mango', 'आम', '🥭', 'Summer/Perennial'),
    ('banana', 'Banana', 'केला', '🍌', 'Perennial'),
    ('tea', 'Tea', 'चाय', '🍵', 'Perennial/Monsoon')
ON CONFLICT (id) DO UPDATE SET 
    name_en = EXCLUDED.name_en,
    name_hi = EXCLUDED.name_hi,
    icon = EXCLUDED.icon;

-- 5. Create Scan History Table (Main Diagnostic Repository)
CREATE TABLE IF NOT EXISTS public.scan_history (
    id VARCHAR(100) PRIMARY KEY,
    farmer_id UUID REFERENCES public.farmer_profiles(id) ON DELETE SET NULL,
    user_id VARCHAR(100),
    user_phone VARCHAR(20),
    user_name VARCHAR(100),
    timestamp_text VARCHAR(100) NOT NULL,
    crop VARCHAR(50) NOT NULL REFERENCES public.crops(id) ON UPDATE CASCADE,
    crop_name_en VARCHAR(100) NOT NULL,
    crop_name_hi VARCHAR(100) NOT NULL,
    disease_id VARCHAR(100) NOT NULL,
    disease_name_en VARCHAR(150) NOT NULL,
    disease_name_hi VARCHAR(150) NOT NULL,
    scientific_name VARCHAR(150),
    pathogen_type VARCHAR(50),
    confidence NUMERIC(5, 2) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe', 'healthy')),
    image_url TEXT,
    farm_area_acres NUMERIC(6, 2) DEFAULT 1.0,
    field_location VARCHAR(100) DEFAULT 'Plot 1',
    status VARCHAR(30) DEFAULT 'Follow-up' CHECK (status IN ('Treated', 'Follow-up', 'Critical', 'Healthy')),
    notes TEXT,
    full_disease_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Agronomic Prescription Slips Table
CREATE TABLE IF NOT EXISTS public.prescription_slips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id VARCHAR(100) NOT NULL REFERENCES public.scan_history(id) ON DELETE CASCADE,
    prescribed_chemical VARCHAR(150),
    dosage_per_liter VARCHAR(50),
    dosage_per_acre VARCHAR(50),
    water_volume_liters INTEGER,
    sprayer_tanks_count INTEGER,
    tank_capacity_liters INTEGER DEFAULT 15,
    phi_waiting_days INTEGER DEFAULT 7,
    organic_alternative TEXT,
    kvk_officer_signatory VARCHAR(100) DEFAULT 'Dr. A. Verma (Agronomist In-Charge)',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_scan_history_crop ON public.scan_history(crop);
CREATE INDEX IF NOT EXISTS idx_scan_history_severity ON public.scan_history(severity);
CREATE INDEX IF NOT EXISTS idx_scan_history_status ON public.scan_history(status);
CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON public.scan_history(created_at DESC);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_slips ENABLE ROW LEVEL SECURITY;

-- 9. Create Public Access Policies (Allow public read/write for demo & authenticated access)
CREATE POLICY "Allow public read access to crops" 
ON public.crops FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public read access to scan_history" 
ON public.scan_history FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert to scan_history" 
ON public.scan_history FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public update to scan_history" 
ON public.scan_history FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete to scan_history" 
ON public.scan_history FOR DELETE 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public access to prescription_slips" 
ON public.prescription_slips FOR ALL 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public access to farmer_profiles" 
ON public.farmer_profiles FOR ALL 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- 10. Seed Initial Sample Scans for Instant Testing
INSERT INTO public.scan_history (
    id, timestamp_text, crop, crop_name_en, crop_name_hi, 
    disease_id, disease_name_en, disease_name_hi, scientific_name, 
    pathogen_type, confidence, severity, image_url, 
    farm_area_acres, field_location, status, notes, full_disease_payload
) VALUES 
(
    'scan-101', '24 Aug 2026 10:30 AM', 'potato', 'Potato', 'आलू',
    'potato-late-blight', 'Potato Late Blight', 'आलू का पछेती झुलसा', 'Phytophthora infestans',
    'Fungal', 96.8, 'severe', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    2.5, 'North Field - Plot 3', 'Critical', 'Severe water-soaked lesion spots expanding due to overnight dew.',
    '{"id":"potato-late-blight","nameEn":"Potato Late Blight","nameHi":"आलू का पछेती झुलसा"}'::jsonb
),
(
    'scan-102', '23 Aug 2026 04:15 PM', 'rice', 'Paddy / Rice', 'धान / चावल',
    'rice-blast', 'Rice Blast', 'धान का झोंका रोग', 'Magnaporthe oryzae',
    'Fungal', 94.2, 'moderate', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    1.0, 'East Canal Plot', 'Treated', 'Tricyclazole 75% WP sprayed with battery knapsack.',
    '{"id":"rice-blast","nameEn":"Rice Blast","nameHi":"धान का झोंका रोग"}'::jsonb
),
(
    'scan-103', '22 Aug 2026 09:00 AM', 'wheat', 'Wheat', 'गेहूं',
    'wheat-stripe-rust', 'Wheat Yellow / Stripe Rust', 'गेहूं का पीला रतुआ', 'Puccinia striiformis',
    'Fungal', 97.4, 'severe', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    3.0, 'Riverbed Block A', 'Follow-up', 'Yellow pustules in linear rows on flag leaves.',
    '{"id":"wheat-stripe-rust","nameEn":"Wheat Yellow / Stripe Rust","nameHi":"गेहूं का पीला रतुआ"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET 
    confidence = EXCLUDED.confidence,
    status = EXCLUDED.status;
`;
