-- ==============================================================================
-- KisanDirect - Supabase PostgreSQL Schema & Seed Migration Script
-- Version: 2.0 (Updated with complete applet types, RLS, Indexes & Triggers)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DROP TABLES IF CLEAN RESET IS NEEDED (IN ORDER OF DEPENDENCIES)
DROP TABLE IF EXISTS marketplace_orders CASCADE;
DROP TABLE IF EXISTS produce_listings CASCADE;
DROP TABLE IF EXISTS farmer_profiles CASCADE;
DROP TABLE IF EXISTS crop_forecasts CASCADE;
DROP TABLE IF EXISTS historical_market_data CASCADE;

-- ------------------------------------------------------------------------------
-- TABLE 1: farmer_profiles
-- Stores individual farmers and Farmer Producer Organizations (FPOs)
-- ------------------------------------------------------------------------------
CREATE TABLE farmer_profiles (
  id TEXT PRIMARY KEY DEFAULT ('farmer-' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_fpo BOOLEAN NOT NULL DEFAULT false,
  fpo_name TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  village TEXT NOT NULL,
  primary_crops TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for geographical searches
CREATE INDEX idx_farmer_profiles_location ON farmer_profiles(state, district);

-- ------------------------------------------------------------------------------
-- TABLE 2: produce_listings
-- Stores harvest lots listed by farmers with geo-coordinates and price benchmarks
-- ------------------------------------------------------------------------------
CREATE TABLE produce_listings (
  id TEXT PRIMARY KEY DEFAULT ('list-' || substr(md5(random()::text), 1, 8)),
  farmer_id TEXT REFERENCES farmer_profiles(id) ON DELETE CASCADE,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  is_fpo BOOLEAN NOT NULL DEFAULT false,
  fpo_name TEXT,
  crop_id TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  variety TEXT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('Grade A (Premium)', 'Grade B (Standard)', 'Grade C (Processing)')),
  quantity_available_quintals NUMERIC(10, 2) NOT NULL CHECK (quantity_available_quintals >= 0),
  min_order_quintals NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (min_order_quintals > 0),
  asking_price_per_quintal NUMERIC(10, 2) NOT NULL CHECK (asking_price_per_quintal > 0),
  mandi_middleman_price_per_quintal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  retail_consumer_price_per_quintal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  harvest_date DATE NOT NULL,
  location JSONB NOT NULL DEFAULT '{"village": "", "district": "", "state": "", "lat": 0, "lng": 0}'::jsonb,
  pickup_point_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold_out')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes for searching and filtering marketplace inventory
CREATE INDEX idx_produce_listings_status ON produce_listings(status);
CREATE INDEX idx_produce_listings_crop_id ON produce_listings(crop_id);
CREATE INDEX idx_produce_listings_location ON produce_listings USING GIN (location);
CREATE INDEX idx_produce_listings_created_at ON produce_listings(created_at DESC);

-- ------------------------------------------------------------------------------
-- TABLE 3: marketplace_orders
-- Records direct farmgate purchases, logistics metrics, savings & status tracking
-- ------------------------------------------------------------------------------
CREATE TABLE marketplace_orders (
  id TEXT PRIMARY KEY DEFAULT ('ord-' || substr(md5(random()::text), 1, 8)),
  order_number TEXT UNIQUE NOT NULL,
  listing_id TEXT REFERENCES produce_listings(id) ON DELETE SET NULL,
  crop_name TEXT NOT NULL,
  farmer_name TEXT NOT NULL,
  farmer_phone TEXT NOT NULL,
  farmer_pickup_location TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  buyer_type TEXT NOT NULL CHECK (buyer_type IN ('individual', 'bulk')),
  delivery_address JSONB NOT NULL DEFAULT '{"district": "", "state": "", "addressLine": "", "pincode": ""}'::jsonb,
  quantity_quintals NUMERIC(10, 2) NOT NULL CHECK (quantity_quintals > 0),
  price_per_quintal NUMERIC(10, 2) NOT NULL CHECK (price_per_quintal > 0),
  produce_total NUMERIC(12, 2) NOT NULL,
  logistics_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL,
  traditional_chain_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  consumer_savings NUMERIC(12, 2) NOT NULL DEFAULT 0,
  farmer_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0,
  farmer_gain_vs_mandi NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'aggregated', 'in_transit', 'delivered', 'cancelled')),
  estimated_delivery_days INT NOT NULL DEFAULT 2,
  logistics_step TEXT NOT NULL DEFAULT 'Order placed, aggregation assigned',
  is_scheduled_pickup BOOLEAN NOT NULL DEFAULT false,
  scheduled_date DATE,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  cancellation_note TEXT,
  refund_amount NUMERIC(12, 2),
  refund_status TEXT CHECK (refund_status IN ('initiated', 'refunded', 'credited')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_marketplace_orders_status ON marketplace_orders(status);
CREATE INDEX idx_marketplace_orders_buyer_phone ON marketplace_orders(buyer_phone);
CREATE INDEX idx_marketplace_orders_created_at ON marketplace_orders(created_at DESC);

-- ------------------------------------------------------------------------------
-- TABLE 4: crop_forecasts (AI Price & Demand Predictions)
-- ------------------------------------------------------------------------------
CREATE TABLE crop_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id TEXT NOT NULL,
  crop_name_en TEXT NOT NULL,
  crop_name_hi TEXT,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  current_mandi_price NUMERIC(10, 2) NOT NULL,
  predicted_demand_quintals NUMERIC(12, 2) NOT NULL,
  demand_trend TEXT NOT NULL CHECK (demand_trend IN ('rising', 'steady', 'declining')),
  suggested_farmer_price NUMERIC(10, 2) NOT NULL,
  recommended_consumer_price NUMERIC(10, 2) NOT NULL,
  farmer_margin_gain_percent NUMERIC(5, 2) NOT NULL,
  consumer_price_drop_percent NUMERIC(5, 2) NOT NULL,
  confidence_score NUMERIC(5, 2) NOT NULL,
  seasonal_notes_en TEXT,
  seasonal_notes_hi TEXT,
  next_3_months_forecast JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(crop_id, state, district)
);

CREATE INDEX idx_crop_forecasts_lookup ON crop_forecasts(crop_id, state, district);

-- ------------------------------------------------------------------------------
-- TABLE 5: historical_market_data (Monthly mandi, direct & retail price trends)
-- ------------------------------------------------------------------------------
CREATE TABLE historical_market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  month TEXT NOT NULL,
  avg_mandi_price NUMERIC(10, 2) NOT NULL,
  direct_farmer_price NUMERIC(10, 2) NOT NULL,
  consumer_retail_price NUMERIC(10, 2) NOT NULL,
  demand_volume_quintals NUMERIC(12, 2) NOT NULL,
  supply_volume_quintals NUMERIC(12, 2) NOT NULL,
  arrival_tons NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_historical_market_data ON historical_market_data(crop_id, state, district);

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Configure public access for the exchange applet demo / multi-user access
-- ------------------------------------------------------------------------------
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_market_data ENABLE ROW LEVEL SECURITY;

-- Allow anonymous / authenticated read access for marketplace browsing & analytics
CREATE POLICY "Allow public read access on farmer_profiles" ON farmer_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on produce_listings" ON produce_listings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on marketplace_orders" ON marketplace_orders FOR SELECT USING (true);
CREATE POLICY "Allow public read access on crop_forecasts" ON crop_forecasts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on historical_market_data" ON historical_market_data FOR SELECT USING (true);

-- Allow inserting and updating listings, profiles, and placing/updating orders
CREATE POLICY "Allow public insert on farmer_profiles" ON farmer_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on farmer_profiles" ON farmer_profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on produce_listings" ON produce_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on produce_listings" ON produce_listings FOR UPDATE USING (true);

CREATE POLICY "Allow public insert on marketplace_orders" ON marketplace_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on marketplace_orders" ON marketplace_orders FOR UPDATE USING (true);

-- ------------------------------------------------------------------------------
-- 7. AUTO-UPDATE TIMESTAMP TRIGGER FUNCTION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_farmer_profiles_modtime
BEFORE UPDATE ON farmer_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produce_listings_modtime
BEFORE UPDATE ON produce_listings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_orders_modtime
BEFORE UPDATE ON marketplace_orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- 8. SEED DATA INITIALIZATION
-- Pre-populates the database with initial realistic farmgate listings & orders
-- ------------------------------------------------------------------------------

INSERT INTO farmer_profiles (id, name, phone, is_fpo, fpo_name, state, district, village, primary_crops)
VALUES
('farmer-01', 'Rameshwar Patil', '+91 98224 51203', true, 'Godavari Sahyadri Farmer Producer Co.', 'Maharashtra', 'Nashik', 'Lasalgaon', ARRAY['onion', 'grapes', 'pomegranate']),
('farmer-02', 'Baldev Singh Dhillon', '+91 98141 87211', false, NULL, 'Uttar Pradesh', 'Agra', 'Khandauli', ARRAY['potato', 'mustard', 'wheat']),
('farmer-03', 'Venkateshwarlu Reddy', '+91 94401 29845', true, 'Andhra Spice & Horticulture Federation', 'Karnataka', 'Kolar', 'Malur', ARRAY['tomato', 'chilli', 'capsicum']),
('farmer-04', 'Devendra Malviya', '+91 98930 45612', true, 'Narmada Valley Kisan Producer Co.', 'Madhya Pradesh', 'Sehore', 'Ashta', ARRAY['wheat', 'soybean', 'chana']),
('farmer-05', 'Gurmukh Singh Sandhu', '+91 98765 43210', false, NULL, 'Punjab', 'Kapurthala', 'Sultanpur Lodhi', ARRAY['rice_basmati', 'wheat', 'potato']),
('farmer-06', 'Suresh Chandra Sharma', '+91 94140 88723', true, 'Marwar Mustard & Oilseed Producer Co.', 'Rajasthan', 'Bharatpur', 'Kumher', ARRAY['mustard', 'bajra', 'wheat'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO produce_listings (
  id, farmer_id, farmer_name, farmer_phone, is_fpo, fpo_name,
  crop_id, crop_name, variety, grade,
  quantity_available_quintals, min_order_quintals,
  asking_price_per_quintal, mandi_middleman_price_per_quintal, retail_consumer_price_per_quintal,
  harvest_date, location, pickup_point_name, status, created_at
) VALUES
(
  'list-101', 'farmer-01', 'Rameshwar Patil', '+91 98224 51203', true, 'Godavari Sahyadri Farmer Producer Co.',
  'onion', 'Nashik Red Onion', 'Garwa / High-Solid Red', 'Grade A (Premium)',
  45.00, 1.00, 3600.00, 2600.00, 5200.00,
  '2026-08-18', '{"village": "Lasalgaon", "district": "Nashik", "state": "Maharashtra", "lat": 20.1448, "lng": 74.2255}'::jsonb,
  'Godavari FPO Aggregation Point, Lasalgaon', 'active', '2026-08-20T08:30:00Z'
),
(
  'list-102', 'farmer-02', 'Baldev Singh Dhillon', '+91 98141 87211', false, NULL,
  'potato', 'Agra Kufri Pukhraj Potatoes', 'Kufri Pukhraj (Oval)', 'Grade A (Premium)',
  120.00, 2.00, 2250.00, 1550.00, 3400.00,
  '2026-08-21', '{"village": "Khandauli", "district": "Agra", "state": "Uttar Pradesh", "lat": 27.2798, "lng": 78.0772}'::jsonb,
  'Khandauli Cold Aggregation Point, Agra', 'active', '2026-08-21T10:15:00Z'
),
(
  'list-103', 'farmer-03', 'Venkateshwarlu Reddy', '+91 94401 29845', true, 'Andhra Spice & Horticulture Federation',
  'tomato', 'Kolar Hybrid Fresh Tomatoes', 'Abhinav Firm Round', 'Grade A (Premium)',
  30.00, 1.00, 3100.00, 2050.00, 4800.00,
  '2026-08-23', '{"village": "Malur", "district": "Kolar", "state": "Karnataka", "lat": 13.1378, "lng": 78.1291}'::jsonb,
  'Kolar Agro Collection Center, Malur', 'active', '2026-08-23T06:40:00Z'
),
(
  'list-104', 'farmer-04', 'Devendra Malviya', '+91 98930 45612', true, 'Narmada Valley Kisan Producer Co.',
  'wheat', 'Sehore Sharbati Wheat', 'Sharbati Golden Grain', 'Grade A (Premium)',
  200.00, 5.00, 3650.00, 2900.00, 4900.00,
  '2026-08-15', '{"village": "Ashta", "district": "Sehore", "state": "Madhya Pradesh", "lat": 23.0189, "lng": 76.7214}'::jsonb,
  'Ashta Silo & Grain Collection Hub', 'active', '2026-08-16T11:00:00Z'
),
(
  'list-105', 'farmer-05', 'Gurmukh Singh Sandhu', '+91 98765 43210', false, NULL,
  'rice_basmati', 'Pusa 1121 Basmati Rice', 'Pusa 1121 Extra Long', 'Grade A (Premium)',
  85.00, 3.00, 8200.00, 6800.00, 11500.00,
  '2026-08-12', '{"village": "Sultanpur Lodhi", "district": "Kapurthala", "state": "Punjab", "lat": 31.2185, "lng": 75.1983}'::jsonb,
  'Sandhu Farm Processing Center, Kapurthala', 'active', '2026-08-14T09:20:00Z'
),
(
  'list-106', 'farmer-06', 'Suresh Chandra Sharma', '+91 94140 88723', true, 'Marwar Mustard & Oilseed Producer Co.',
  'mustard', 'High Oil Content Yellow Mustard', 'Pusa Mustard 28', 'Grade A (Premium)',
  60.00, 2.00, 6100.00, 5100.00, 8400.00,
  '2026-08-19', '{"village": "Kumher", "district": "Bharatpur", "state": "Rajasthan", "lat": 27.3194, "lng": 77.3789}'::jsonb,
  'Kumher Mandi Road Collection Center, Bharatpur', 'active', '2026-08-20T14:30:00Z'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO marketplace_orders (
  id, order_number, listing_id, crop_name,
  farmer_name, farmer_phone, farmer_pickup_location,
  buyer_name, buyer_phone, buyer_type, delivery_address,
  quantity_quintals, price_per_quintal, produce_total, logistics_fee, total_amount,
  traditional_chain_cost, consumer_savings, farmer_earnings, farmer_gain_vs_mandi,
  status, estimated_delivery_days, logistics_step, is_scheduled_pickup, created_at
) VALUES
(
  'ord-501', 'KD-202608-8841', 'list-101', 'Nashik Red Onion',
  'Rameshwar Patil', '+91 98224 51203', 'Lasalgaon, Nashik, Maharashtra',
  'Hotel Grand Residency (Chef Anand Verma)', '+91 98112 34567', 'bulk',
  '{"district": "Mumbai Suburban", "state": "Maharashtra", "addressLine": "Plot 42, Bandra Kurla Complex, Bandra East", "pincode": "400051"}'::jsonb,
  5.00, 3600.00, 18000.00, 950.00, 18950.00,
  26000.00, 7050.00, 18000.00, 5000.00,
  'in_transit', 1, 'In transit along Maharashtra Western Agro Corridor (Driver: Sandeep K.)', false, '2026-08-27T09:15:00Z'
),
(
  'ord-502', 'KD-202608-9124', 'list-103', 'Kolar Hybrid Fresh Tomatoes',
  'Venkateshwarlu Reddy', '+91 94401 29845', 'Malur, Kolar, Karnataka',
  'FreshBite Cloud Kitchens', '+91 99001 54321', 'bulk',
  '{"district": "Bengaluru Urban", "state": "Karnataka", "addressLine": "14th Main, HSR Layout Sector 4", "pincode": "560102"}'::jsonb,
  3.00, 3100.00, 9300.00, 600.00, 9900.00,
  14400.00, 4500.00, 9300.00, 3150.00,
  'aggregated', 2, 'Consolidated at Kolar Agro Hub, vehicle dispatch scheduled', true, '2026-08-28T07:45:00Z'
),
(
  'ord-503', 'KD-202608-9310', 'list-102', 'Agra Kufri Pukhraj Potatoes',
  'Baldev Singh Dhillon', '+91 98141 87211', 'Khandauli, Agra, Uttar Pradesh',
  'Rajesh Gupta (Community Buyer Group)', '+91 98101 22334', 'individual',
  '{"district": "South Delhi", "state": "Delhi", "addressLine": "Flat 302, Green Park Extension", "pincode": "110016"}'::jsonb,
  2.00, 2250.00, 4500.00, 380.00, 4880.00,
  6800.00, 1920.00, 4500.00, 1400.00,
  'confirmed', 3, 'Order confirmed with farmer; collection scheduled for route run', false, '2026-08-28T14:20:00Z'
)
ON CONFLICT (id) DO NOTHING;
