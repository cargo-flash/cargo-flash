-- ============================================
-- CARGO FLASH - MIGRATION: Add Missing Fields
-- Execute this in Supabase SQL Editor
-- ============================================

-- 1. Add current position fields to deliveries table
-- (for real-time tracking of vehicle location)
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS current_lat DECIMAL(10, 8);
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS current_lng DECIMAL(11, 8);

-- 2. Add declared value for insurance calculations
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS declared_value DECIMAL(10, 2);

-- 3. Add vehicle plate (separate from vehicle model)
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS driver_vehicle_plate TEXT;

-- 4. Add progress_percent to delivery_history
-- (tracks delivery progress percentage at each update point)
ALTER TABLE delivery_history ADD COLUMN IF NOT EXISTS progress_percent DECIMAL(5, 2);

-- 5. Add progress_percent to scheduled_events (used during simulation)
ALTER TABLE scheduled_events ADD COLUMN IF NOT EXISTS progress_percent DECIMAL(5, 2);

-- ============================================
-- VERIFY: Check if columns were added
-- ============================================
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'deliveries' 
AND column_name IN ('current_lat', 'current_lng', 'declared_value', 'driver_vehicle_plate');

SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'delivery_history' 
AND column_name = 'progress_percent';

-- ============================================
-- Done! Your database now has the required fields
-- ============================================
