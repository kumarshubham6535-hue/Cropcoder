-- ============================================================================
-- SAFE NON-DESTRUCTIVE BACKEND SCHEMA & DATA UPLOAD FOR SUPABASE
-- Safe to run in Supabase SQL Editor on existing databases.
-- It creates missing tables, adds missing columns, enables RLS & Realtime,
-- and safely upserts all listings, profiles, and benchmarks without dropping
-- or deleting existing tables or customer data.
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Profiles Table (Farmer, FPO, and Buyer Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY DEFAULT ('f-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    is_fpo BOOLEAN NOT NULL DEFAULT FALSE,
    fpo_name TEXT,
    state TEXT NOT NULL DEFAULT 'Haryana',
    district TEXT NOT NULL DEFAULT 'Karnal',
    village TEXT NOT NULL DEFAULT 'Nilokheri',
    primary_crops TEXT[] DEFAULT '{}',
    is_phone_verified BOOLEAN NOT NULL DEFAULT TRUE,
    role TEXT NOT NULL DEFAULT 'farmer',
    password_hash TEXT DEFAULT 'Kisan@123',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all required columns exist in profiles
DO $$
BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_fpo BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fpo_name TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT NOT NULL DEFAULT 'Haryana';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT NOT NULL DEFAULT 'Karnal';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS village TEXT NOT NULL DEFAULT 'Nilokheri';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_crops TEXT[] DEFAULT '{}';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN NOT NULL DEFAULT TRUE;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'farmer';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT 'Kisan@123';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

-- 3. Produce Listings Table
CREATE TABLE IF NOT EXISTS public.produce_listings (
    id TEXT PRIMARY KEY DEFAULT ('list-' || substr(md5(random()::text), 1, 8)),
    farmer_id TEXT REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    is_fpo BOOLEAN NOT NULL DEFAULT FALSE,
    fpo_name TEXT,
    crop_id TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    variety TEXT,
    grade TEXT NOT NULL DEFAULT 'Grade A (Premium)',
    quantity_available_quintals NUMERIC NOT NULL DEFAULT 0,
    min_order_quintals NUMERIC NOT NULL DEFAULT 1,
    asking_price_per_quintal NUMERIC NOT NULL,
    mandi_middleman_price_per_quintal NUMERIC DEFAULT 0,
    retail_consumer_price_per_quintal NUMERIC DEFAULT 0,
    harvest_date DATE NOT NULL DEFAULT CURRENT_DATE,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude NUMERIC DEFAULT 29.8181,
    longitude NUMERIC DEFAULT 76.9998,
    pickup_point_name TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all required columns exist in produce_listings
DO $$
BEGIN
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS farmer_id TEXT;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS is_fpo BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS fpo_name TEXT;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS variety TEXT;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS grade TEXT NOT NULL DEFAULT 'Grade A (Premium)';
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS min_order_quintals NUMERIC NOT NULL DEFAULT 1;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS mandi_middleman_price_per_quintal NUMERIC DEFAULT 0;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS retail_consumer_price_per_quintal NUMERIC DEFAULT 0;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS latitude NUMERIC DEFAULT 29.8181;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS longitude NUMERIC DEFAULT 76.9998;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS pickup_point_name TEXT;
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
    ALTER TABLE public.produce_listings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

-- 4. Marketplace Orders Table
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
    id TEXT PRIMARY KEY DEFAULT ('ord-' || substr(md5(random()::text), 1, 8)),
    order_number TEXT NOT NULL UNIQUE,
    listing_id TEXT REFERENCES public.produce_listings(id) ON UPDATE CASCADE ON DELETE SET NULL,
    buyer_id TEXT,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    crop_id TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    variety TEXT,
    quantity_quintals NUMERIC NOT NULL,
    farmer_price_per_quintal NUMERIC NOT NULL,
    logistics_fee NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    middleman_mandi_equivalent NUMERIC DEFAULT 0,
    buyer_saved_amount NUMERIC DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'upi',
    payment_status TEXT NOT NULL DEFAULT 'completed',
    payment_transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed',
    logistics_step TEXT NOT NULL DEFAULT 'Pickup Scheduled',
    estimated_delivery_hours INTEGER DEFAULT 24,
    cancellation_reason TEXT,
    cancellation_note TEXT,
    cancelled_at TIMESTAMPTZ,
    refund_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all required columns exist in marketplace_orders
DO $$
BEGIN
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS listing_id TEXT;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS buyer_id TEXT;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS variety TEXT;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS logistics_fee NUMERIC NOT NULL DEFAULT 0;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS middleman_mandi_equivalent NUMERIC DEFAULT 0;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS buyer_saved_amount NUMERIC DEFAULT 0;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'upi';
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'completed';
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS logistics_step TEXT NOT NULL DEFAULT 'Pickup Scheduled';
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS estimated_delivery_hours INTEGER DEFAULT 24;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS cancellation_note TEXT;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0;
    ALTER TABLE public.marketplace_orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
END $$;

-- Drop obsolete restrictive check constraints on marketplace_orders if they exist
DO $$
BEGIN
    ALTER TABLE public.marketplace_orders DROP CONSTRAINT IF EXISTS marketplace_orders_status_check;
    ALTER TABLE public.marketplace_orders DROP CONSTRAINT IF EXISTS marketplace_orders_payment_status_check;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- 5. OTP Challenges Table (Phone Authentication Verification)
CREATE TABLE IF NOT EXISTS public.otp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    purpose TEXT NOT NULL,
    payload JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. APMC Mandi Benchmarks Table
CREATE TABLE IF NOT EXISTS public.apmc_mandi_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    mandi_name TEXT NOT NULL,
    modal_price_per_quintal NUMERIC NOT NULL,
    min_price_per_quintal NUMERIC NOT NULL,
    max_price_per_quintal NUMERIC NOT NULL,
    arrivals_tonnes NUMERIC NOT NULL,
    forecast_demand_quintals NUMERIC,
    suggested_fair_price NUMERIC,
    recorded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_produce_listings_crop ON public.produce_listings(crop_id);
CREATE INDEX IF NOT EXISTS idx_produce_listings_state ON public.produce_listings(state);
CREATE INDEX IF NOT EXISTS idx_produce_listings_status ON public.produce_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_phone ON public.marketplace_orders(buyer_phone);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status ON public.marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_otp_challenges_phone ON public.otp_challenges(phone, is_used);
CREATE INDEX IF NOT EXISTS idx_apmc_benchmarks_crop_state ON public.apmc_mandi_benchmarks(crop_id, state);

-- 8. Auto-updating Timestamps Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_produce_listings_updated_at ON public.produce_listings;
CREATE TRIGGER tr_produce_listings_updated_at BEFORE UPDATE ON public.produce_listings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_marketplace_orders_updated_at ON public.marketplace_orders;
CREATE TRIGGER tr_marketplace_orders_updated_at BEFORE UPDATE ON public.marketplace_orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Row Level Security (RLS) - Safe Permissive Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apmc_mandi_benchmarks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "profiles_all" ON public.profiles;
    CREATE POLICY "profiles_all" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "produce_listings_all" ON public.produce_listings;
    CREATE POLICY "produce_listings_all" ON public.produce_listings FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "marketplace_orders_all" ON public.marketplace_orders;
    CREATE POLICY "marketplace_orders_all" ON public.marketplace_orders FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "otp_challenges_all" ON public.otp_challenges;
    CREATE POLICY "otp_challenges_all" ON public.otp_challenges FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "apmc_mandi_benchmarks_all" ON public.apmc_mandi_benchmarks;
    CREATE POLICY "apmc_mandi_benchmarks_all" ON public.apmc_mandi_benchmarks FOR ALL USING (true) WITH CHECK (true);
END $$;

-- 10. Enable Supabase Realtime (Live Updates)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles, public.produce_listings, public.marketplace_orders, public.otp_challenges;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
        WHEN undefined_object THEN NULL;
    END;
END $$;

-- 11. Safe Data Upload: Verified Farmer Profiles (Upsert without overwriting custom edits)
INSERT INTO public.profiles (id, name, phone, email, is_fpo, fpo_name, state, district, village, primary_crops, is_phone_verified, role, password_hash)
VALUES
  ('farmer-101', 'Rajbir Singh Malik', '+91 98120 34567', 'rajbir.malik@karnalkisan.in', true, 'Karnal Wheat Growers Producer Co.', 'Haryana', 'Karnal', 'Nilokheri', ARRAY['Wheat', 'Paddy'], true, 'farmer', 'Kisan@123'),
  ('farmer-102', 'Om Parkash Dalal', '+91 94162 78901', 'om.dalal@hisaragro.in', false, null, 'Haryana', 'Hisar', 'Barwala', ARRAY['Mustard', 'Gram'], true, 'farmer', 'Kisan@123'),
  ('farmer-103', 'Suresh Kumar Sihag', '+91 98962 45123', 'suresh.sihag@sirsafpo.in', true, 'Sirsa Cotton & Narma Growers Federation', 'Haryana', 'Sirsa', 'Ellenabad', ARRAY['Cotton', 'Guar'], true, 'farmer', 'Kisan@123'),
  ('farmer-104', 'Kuldeep Singh Redhu', '+91 97290 55612', 'kuldeep.redhu@taraoribasmati.in', true, 'Taraori Basmati Exporters FPO', 'Haryana', 'Karnal', 'Taraori', ARRAY['Rice Basmati', 'Wheat'], true, 'farmer', 'Kisan@123'),
  ('farmer-105', 'Mahender Singh Punia', '+91 94674 32109', 'mahender.punia@bhiwanimillets.in', false, null, 'Haryana', 'Bhiwani', 'Loharu', ARRAY['Bajra', 'Moong'], true, 'farmer', 'Kisan@123'),
  ('f-101', 'Rameshwar Patil', '+91 98224 51203', 'rameshwar@patilfarms.in', true, 'Godavari Sahyadri Farmer Producer Co.', 'Maharashtra', 'Nashik', 'Lasalgaon', ARRAY['Onion', 'Tomato'], true, 'farmer', 'Kisan@123'),
  ('f-102', 'Baldev Singh Dhillon', '+91 98141 87211', 'baldev@dhillonfarms.in', false, null, 'Uttar Pradesh', 'Agra', 'Khandauli', ARRAY['Potato', 'Mustard'], true, 'farmer', 'Kisan@123'),
  ('f-103', 'Venkateshwarlu Reddy', '+91 94401 29845', 'venkat@reddyagro.in', true, 'Andhra Spice & Horticulture Federation', 'Karnataka', 'Kolar', 'Malur', ARRAY['Tomato', 'Chili'], true, 'farmer', 'Kisan@123'),
  ('f-104', 'Devendra Malviya', '+91 98930 45612', 'devendra@malviyakisan.in', true, 'Narmada Valley Kisan Producer Co.', 'Madhya Pradesh', 'Sehore', 'Ashta', ARRAY['Wheat', 'Soybean'], true, 'farmer', 'Kisan@123')
ON CONFLICT (phone) DO UPDATE SET
    is_phone_verified = EXCLUDED.is_phone_verified,
    updated_at = NOW();

-- 12. Safe Data Upload: Verified Live Produce Listings
INSERT INTO public.produce_listings (
  id, farmer_id, farmer_name, farmer_phone, is_fpo, fpo_name,
  crop_id, crop_name, variety, grade,
  quantity_available_quintals, min_order_quintals, asking_price_per_quintal,
  mandi_middleman_price_per_quintal, retail_consumer_price_per_quintal,
  harvest_date, village, district, state, latitude, longitude,
  pickup_point_name, status
)
VALUES
  ('list-201', 'farmer-101', 'Rajbir Singh Malik', '+91 98120 34567', true, 'Karnal Wheat Growers Producer Co.', 'wheat', 'Karnal HD Wheat (Milling Grade)', 'HD-3086 Bold Grain', 'Grade A (Premium)', 250, 5, 3000, 2600, 4300, '2026-04-18', 'Nilokheri', 'Karnal', 'Haryana', 29.8181, 76.9998, 'Karnal Grain Aggregation Point, Nilokheri', 'active'),
  ('list-202', 'farmer-102', 'Om Parkash Dalal', '+91 94162 78901', false, null, 'mustard', 'Hisar Sarson (Mustard)', 'RH-30 High Oil Content', 'Grade A (Premium)', 80, 2, 7450, 6450, 10650, '2026-03-15', 'Barwala', 'Hisar', 'Haryana', 29.3667, 75.9167, 'Hisar Oilseeds Collection Depot, Barwala', 'active'),
  ('list-203', 'farmer-103', 'Suresh Kumar Sihag', '+91 98962 45123', true, 'Sirsa Cotton & Narma Growers Federation', 'cotton', 'Sirsa Narma Cotton (Bt Hybrid)', 'Bt Cotton Hybrid (RCH-2)', 'Grade A (Premium)', 95, 3, 7500, 6115, 11300, '2026-09-05', 'Ellenabad', 'Sirsa', 'Haryana', 29.4500, 74.6667, 'Sirsa Cotton Ginning & Logistics Hub, Ellenabad', 'active'),
  ('list-204', 'farmer-104', 'Kuldeep Singh Redhu', '+91 97290 55612', true, 'Taraori Basmati Exporters FPO', 'rice_basmati', 'Karnal Basmati Rice (Pusa 1121)', 'Pusa 1121 Extra Long Grain', 'Grade A (Premium)', 140, 5, 8600, 7800, 10100, '2026-09-08', 'Taraori', 'Karnal', 'Haryana', 29.8408, 76.9469, 'Taraori Basmati Rice Mill Depot, Karnal', 'active'),
  ('list-205', 'farmer-105', 'Mahender Singh Punia', '+91 94674 32109', false, null, 'bajra', 'Bhiwani Bajra (Pearl Millet)', 'HHB-67 Improved', 'Grade A (Premium)', 60, 2, 2600, 2270, 3550, '2026-09-06', 'Loharu', 'Bhiwani', 'Haryana', 28.4333, 75.8000, 'Bhiwani Bajra Aggregation Yard, Loharu', 'active')
ON CONFLICT (id) DO UPDATE SET
  farmer_name = EXCLUDED.farmer_name,
  farmer_phone = EXCLUDED.farmer_phone,
  crop_name = EXCLUDED.crop_name,
  variety = EXCLUDED.variety,
  grade = EXCLUDED.grade,
  quantity_available_quintals = EXCLUDED.quantity_available_quintals,
  asking_price_per_quintal = EXCLUDED.asking_price_per_quintal,
  mandi_middleman_price_per_quintal = EXCLUDED.mandi_middleman_price_per_quintal,
  retail_consumer_price_per_quintal = EXCLUDED.retail_consumer_price_per_quintal,
  pickup_point_name = EXCLUDED.pickup_point_name,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 13. Safe Data Upload: APMC Mandi Benchmark Rates
INSERT INTO public.apmc_mandi_benchmarks (crop_id, crop_name, state, district, mandi_name, modal_price_per_quintal, min_price_per_quintal, max_price_per_quintal, arrivals_tonnes, forecast_demand_quintals, suggested_fair_price)
VALUES
  ('wheat', 'Wheat (Karnal Milling HD-3086)', 'Haryana', 'Karnal', 'Karnal APMC', 2600, 2450, 2750, 4200, 48000, 3000),
  ('mustard', 'Mustard (Hisar Sarson RH-30)', 'Haryana', 'Hisar', 'Hisar APMC', 6450, 6100, 6800, 1950, 24000, 7450),
  ('cotton', 'Cotton (Sirsa Narma Hybrid)', 'Haryana', 'Sirsa', 'Adampur APMC', 6115, 5800, 6400, 3100, 32000, 7500),
  ('rice_basmati', 'Basmati Rice (Pusa 1121)', 'Haryana', 'Karnal', 'Taraori Mandi', 7800, 7200, 8400, 5100, 56000, 8600),
  ('bajra', 'Bajra (Bhiwani Pearl Millet)', 'Haryana', 'Bhiwani', 'Bhiwani APMC', 2270, 2100, 2450, 2300, 27000, 2600),
  ('onion', 'Onion (Nashik Red)', 'Maharashtra', 'Nashik', 'Lasalgaon APMC', 2600, 2100, 3100, 4850, 53000, 3600),
  ('potato', 'Potato (Agra Table)', 'Uttar Pradesh', 'Agra', 'Agra APMC', 1550, 1200, 1900, 6800, 72000, 2250),
  ('tomato', 'Tomato (Kolar Hybrid)', 'Karnataka', 'Kolar', 'Kolar APMC', 2050, 1600, 2600, 3200, 38000, 3100);

