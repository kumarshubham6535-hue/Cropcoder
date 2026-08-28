-- ==============================================================================
-- KisanDirect - Supabase Database Schema & Migration
-- Project: gzwketwuirwtwrbkhbiz
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- OPTION 1: COMPLETE CLEAN SLATE (Recommended to ensure clean types & constraints)
-- ==============================================================================
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS produce_listings CASCADE;

-- 2. Produce Listings Table (Farmgate Harvest Lots)
CREATE TABLE produce_listings (
    id TEXT PRIMARY KEY,
    crop_name TEXT NOT NULL,
    crop_category TEXT NOT NULL DEFAULT 'vegetable', -- 'vegetable', 'grain', 'fruit', 'pulse', 'spice'
    variety TEXT,
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    pickup_point_name TEXT NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    total_harvest_quintals NUMERIC(10, 2) NOT NULL CHECK (total_harvest_quintals >= 0),
    quantity_available_quintals NUMERIC(10, 2) NOT NULL CHECK (quantity_available_quintals >= 0),
    min_order_quintals NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (min_order_quintals >= 1),
    harvest_date DATE NOT NULL,
    asking_price_per_quintal NUMERIC(10, 2) NOT NULL CHECK (asking_price_per_quintal > 0),
    mandi_middleman_price_per_quintal NUMERIC(10, 2) NOT NULL,
    retail_consumer_price_per_quintal NUMERIC(10, 2) NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Grade A',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold_out', 'inactive', 'archived')),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Marketplace Orders Table (Direct Farm-to-Buyer Dispatches)
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    listing_id TEXT REFERENCES produce_listings(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    farmer_name TEXT NOT NULL,
    farmer_phone TEXT NOT NULL,
    farmer_pickup_location TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    buyer_type TEXT NOT NULL CHECK (buyer_type IN ('individual', 'bulk')),
    delivery_address JSONB NOT NULL, -- { addressLine, district, state, pincode }
    quantity_quintals NUMERIC(10, 2) NOT NULL CHECK (quantity_quintals > 0),
    price_per_quintal NUMERIC(10, 2) NOT NULL CHECK (price_per_quintal > 0),
    produce_total NUMERIC(12, 2) NOT NULL,
    logistics_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    traditional_chain_cost NUMERIC(12, 2) NOT NULL,
    consumer_savings NUMERIC(12, 2) NOT NULL DEFAULT 0,
    farmer_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0,
    farmer_gain_vs_mandi NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'aggregated', 'in_transit', 'delivered', 'cancelled')),
    logistics_step TEXT,
    estimated_delivery_days INTEGER DEFAULT 2,
    is_scheduled_pickup BOOLEAN DEFAULT FALSE,
    scheduled_date DATE,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancellation_note TEXT,
    refund_amount NUMERIC(12, 2),
    refund_status TEXT CHECK (refund_status IN ('initiated', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Performance Indexes
CREATE INDEX idx_produce_listings_status ON produce_listings(status);
CREATE INDEX idx_produce_listings_district ON produce_listings(district);
CREATE INDEX idx_produce_listings_crop ON produce_listings(crop_name);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_listing_id ON orders(listing_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: Allow public read and write access for web demo & publishable key
CREATE POLICY "Allow public read on produce_listings" 
    ON produce_listings FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert on produce_listings" 
    ON produce_listings FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update on produce_listings" 
    ON produce_listings FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public read on orders" 
    ON orders FOR SELECT 
    USING (true);

CREATE POLICY "Allow public insert on orders" 
    ON orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update on orders" 
    ON orders FOR UPDATE 
    USING (true);

CREATE POLICY "Allow public delete on orders" 
    ON orders FOR DELETE 
    USING (true);

-- 7. Seed Initial Verified Produce Listings
INSERT INTO produce_listings (
    id, crop_name, crop_category, variety, farmer_name, farmer_phone, 
    state, district, pickup_point_name, lat, lng, total_harvest_quintals, 
    quantity_available_quintals, min_order_quintals, harvest_date, 
    asking_price_per_quintal, mandi_middleman_price_per_quintal, retail_consumer_price_per_quintal, 
    grade, status, image_url
) VALUES 
(
    'list-101', 'Nashik Red Onion', 'vegetable', 'Garwa Late Kharif', 'Rameshwar Patil (Lasalgaon Farmers Co-op)', 
    '+91 94222 88410', 'Maharashtra', 'Nashik', 'Lasalgaon APMC Gate 2 Cold Cluster', 
    20.1448, 74.2255, 45, 45, 2, '2026-03-24', 2150, 1350, 3600, 'Grade A Export', 'active', NULL
),
(
    'list-102', 'Pimpalgaon Hybrid Tomato', 'vegetable', 'Abhinav 3019', 'Sunita Gaikwad (Sahyadri Agro)', 
    '+91 98220 55192', 'Maharashtra', 'Nashik', 'Pimpalgaon Farmgate Collection Center', 
    20.1706, 73.9856, 30, 30, 1, '2026-03-27', 1850, 950, 3200, 'Grade A Table', 'active', NULL
),
(
    'list-103', 'Agra Kufri Chipsona Potato', 'vegetable', 'Kufri Bahar', 'Baldev Singh (Yamuna Agro Cluster)', 
    '+91 97190 33418', 'Uttar Pradesh', 'Agra', 'Khandauli Cold Storage Bay 4', 
    27.2798, 78.0772, 120, 120, 10, '2026-03-22', 1420, 820, 2400, 'Grade A Processing', 'active', NULL
),
(
    'list-104', 'Karnal 1121 Basmati Rice', 'grain', 'Pusa 1121 Extra Long', 'Harpreet Singh Sandhu (Taraori FPO)', 
    '+91 98120 77310', 'Haryana', 'Karnal', 'Nilokheri Silo Depot', 
    29.8329, 76.9208, 100, 100, 5, '2026-03-20', 7400, 4900, 10800, 'Premium Export Grade', 'active', NULL
),
(
    'list-105', 'Guntur Sannam Red Chilli', 'spice', 'Sannam S4 Dry', 'V. Venkateswarlu (Kisan Pragati FPO)', 
    '+91 99480 11944', 'Andhra Pradesh', 'Guntur', 'Lam Farm Gate Aggregation Depot', 
    16.3067, 80.4365, 25, 25, 1, '2026-03-25', 18600, 12800, 26500, 'Grade A Hot Dry', 'active', NULL
),
(
    'list-106', 'Nagpur Sweet Mandarin Orange', 'fruit', 'Nagpur Orange (GI Tag)', 'Pramodrao Deshmukh (Vidarbha Citrus)', 
    '+91 94231 66205', 'Maharashtra', 'Nagpur', 'Katol Cold Consolidation Hub', 
    21.2727, 78.5833, 60, 0, 5, '2026-03-18', 4200, 2600, 7200, 'GI Tagged Premium', 'sold_out', NULL
)
ON CONFLICT (id) DO NOTHING;
