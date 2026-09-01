-- ============================================================================
-- OPTION 1: COMPLETE CLEAN RESET (RECOMMENDED TO CLEAR ALL ERRORS)
-- Run this if you want a fresh, 100% error-free backend with fresh demo data.
-- ============================================================================

-- Drop all existing tables & constraints cleanly
DROP TABLE IF EXISTS public.marketplace_orders CASCADE;
DROP TABLE IF EXISTS public.produce_listings CASCADE;
DROP TABLE IF EXISTS public.otp_challenges CASCADE;
DROP TABLE IF EXISTS public.apmc_mandi_benchmarks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Profiles Table (Farmer & Buyer accounts)
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY DEFAULT ('f-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    is_fpo BOOLEAN NOT NULL DEFAULT FALSE,
    fpo_name TEXT,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Nashik',
    village TEXT NOT NULL DEFAULT 'Lasalgaon',
    primary_crops TEXT[] DEFAULT '{}',
    is_phone_verified BOOLEAN NOT NULL DEFAULT TRUE,
    role TEXT NOT NULL DEFAULT 'farmer',
    password_hash TEXT DEFAULT 'Kisan@123',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Produce Listings Table
CREATE TABLE public.produce_listings (
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
    quantity_available_quintals NUMERIC NOT NULL DEFAULT 0 CHECK (quantity_available_quintals >= 0),
    min_order_quintals NUMERIC NOT NULL DEFAULT 1 CHECK (min_order_quintals >= 1),
    asking_price_per_quintal NUMERIC NOT NULL CHECK (asking_price_per_quintal > 0),
    mandi_middleman_price_per_quintal NUMERIC DEFAULT 0,
    retail_consumer_price_per_quintal NUMERIC DEFAULT 0,
    harvest_date DATE NOT NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude NUMERIC DEFAULT 20.5937,
    longitude NUMERIC DEFAULT 78.9629,
    pickup_point_name TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'paused')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Marketplace Orders Table
CREATE TABLE public.marketplace_orders (
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
    quantity_quintals NUMERIC NOT NULL CHECK (quantity_quintals > 0),
    farmer_price_per_quintal NUMERIC NOT NULL,
    logistics_fee NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    middleman_mandi_equivalent NUMERIC DEFAULT 0,
    buyer_saved_amount NUMERIC DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'upi',
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_transaction_id TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled')),
    logistics_step TEXT NOT NULL DEFAULT 'Pickup Scheduled',
    estimated_delivery_hours INTEGER DEFAULT 24,
    cancellation_reason TEXT,
    cancellation_note TEXT,
    cancelled_at TIMESTAMPTZ,
    refund_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create OTP Challenges Table
CREATE TABLE public.otp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('signup', 'forgot_password', 'profile_update', 'login')),
    payload JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Create APMC Mandi Benchmarks Table
CREATE TABLE public.apmc_mandi_benchmarks (
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

-- 7. High Performance Indexes
CREATE INDEX idx_profiles_phone ON public.profiles(phone);
CREATE INDEX idx_produce_listings_crop ON public.produce_listings(crop_id);
CREATE INDEX idx_produce_listings_state ON public.produce_listings(state);
CREATE INDEX idx_produce_listings_status ON public.produce_listings(status);
CREATE INDEX idx_marketplace_orders_buyer_phone ON public.marketplace_orders(buyer_phone);
CREATE INDEX idx_marketplace_orders_status ON public.marketplace_orders(status);
CREATE INDEX idx_otp_challenges_phone ON public.otp_challenges(phone, is_used);
CREATE INDEX idx_apmc_benchmarks_crop_state ON public.apmc_mandi_benchmarks(crop_id, state);

-- 8. Auto-updating Timestamps Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_produce_listings_updated_at BEFORE UPDATE ON public.produce_listings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_marketplace_orders_updated_at BEFORE UPDATE ON public.marketplace_orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Row Level Security (RLS) Open Policies for Client Access
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apmc_mandi_benchmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_all" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "produce_listings_all" ON public.produce_listings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "marketplace_orders_all" ON public.marketplace_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "otp_challenges_all" ON public.otp_challenges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "apmc_mandi_benchmarks_all" ON public.apmc_mandi_benchmarks FOR ALL USING (true) WITH CHECK (true);

-- 10. Enable Supabase Realtime
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles, public.produce_listings, public.marketplace_orders, public.otp_challenges;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_object THEN NULL;
  END;
END $$;

-- 11. Initial Verified Demo Data
INSERT INTO public.profiles (id, name, phone, is_fpo, fpo_name, state, district, village, primary_crops, is_phone_verified, password_hash)
VALUES
  ('f-101', 'Rameshwar Patil', '+91 98224 51203', true, 'Godavari Sahyadri Farmer Producer Co.', 'Maharashtra', 'Nashik', 'Lasalgaon', ARRAY['Onion', 'Tomato'], true, 'Kisan@123'),
  ('f-102', 'Baldev Singh Dhillon', '+91 98141 87211', false, null, 'Uttar Pradesh', 'Agra', 'Khandauli', ARRAY['Potato', 'Mustard'], true, 'Kisan@123'),
  ('f-103', 'Venkateshwarlu Reddy', '+91 94401 29845', true, 'Andhra Spice & Horticulture Federation', 'Karnataka', 'Kolar', 'Malur', ARRAY['Tomato', 'Chili'], true, 'Kisan@123'),
  ('f-104', 'Devendra Malviya', '+91 98930 45612', true, 'Narmada Valley Kisan Producer Co.', 'Madhya Pradesh', 'Sehore', 'Ashta', ARRAY['Wheat', 'Soybean'], true, 'Kisan@123');

INSERT INTO public.produce_listings (
  id, farmer_id, farmer_name, farmer_phone, is_fpo, fpo_name,
  crop_id, crop_name, variety, grade,
  quantity_available_quintals, min_order_quintals, asking_price_per_quintal,
  mandi_middleman_price_per_quintal, retail_consumer_price_per_quintal,
  harvest_date, village, district, state, latitude, longitude,
  pickup_point_name, status
)
VALUES
  ('list-101', 'f-101', 'Rameshwar Patil', '+91 98224 51203', true, 'Godavari Sahyadri Farmer Producer Co.', 'onion', 'Nashik Red Onion', 'Garwa / High-Solid Red', 'Grade A (Premium)', 45, 1, 3600, 2600, 5200, '2026-08-18', 'Lasalgaon', 'Nashik', 'Maharashtra', 20.1448, 74.2255, 'Godavari FPO Aggregation Point, Lasalgaon', 'active'),
  ('list-102', 'f-102', 'Baldev Singh Dhillon', '+91 98141 87211', false, null, 'potato', 'Agra Kufri Pukhraj Potatoes', 'Kufri Pukhraj (Oval)', 'Grade A (Premium)', 120, 2, 2250, 1550, 3400, '2026-08-21', 'Khandauli', 'Agra', 'Uttar Pradesh', 27.2798, 78.0772, 'Khandauli Cold Aggregation Point, Agra', 'active'),
  ('list-103', 'f-103', 'Venkateshwarlu Reddy', '+91 94401 29845', true, 'Andhra Spice & Horticulture Federation', 'tomato', 'Kolar Hybrid Fresh Tomatoes', 'Abhinav Firm Round', 'Grade A (Premium)', 30, 1, 3100, 2050, 4800, '2026-08-23', 'Malur', 'Kolar', 'Karnataka', 13.1378, 78.1291, 'Kolar Agro Collection Center, Malur', 'active'),
  ('list-104', 'f-104', 'Devendra Malviya', '+91 98930 45612', true, 'Narmada Valley Kisan Producer Co.', 'wheat', 'Sehore Sharbati Wheat', 'Sharbati Golden Grain', 'Grade A (Premium)', 200, 5, 3650, 2900, 5100, '2026-08-15', 'Ashta', 'Sehore', 'Madhya Pradesh', 23.0189, 76.5412, 'Ashta Mandi Road FPO Godown', 'active');

INSERT INTO public.apmc_mandi_benchmarks (crop_id, crop_name, state, district, mandi_name, modal_price_per_quintal, min_price_per_quintal, max_price_per_quintal, arrivals_tonnes, forecast_demand_quintals, suggested_fair_price)
VALUES
  ('onion', 'Onion (Nashik Red)', 'Maharashtra', 'Nashik', 'Lasalgaon APMC', 2600, 2100, 3100, 4850, 53000, 3600),
  ('potato', 'Potato (Agra Table)', 'Uttar Pradesh', 'Agra', 'Agra APMC', 1550, 1200, 1900, 6800, 72000, 2250),
  ('tomato', 'Tomato (Kolar Hybrid)', 'Karnataka', 'Kolar', 'Kolar APMC', 2050, 1600, 2600, 3200, 38000, 3100),
  ('wheat', 'Wheat (Sharbati)', 'Madhya Pradesh', 'Sehore', 'Sehore APMC', 2900, 2500, 3400, 5600, 61000, 3650);
