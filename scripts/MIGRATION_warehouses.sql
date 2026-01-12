-- ============================================
-- WAREHOUSES TABLE
-- Support for multiple origins/warehouses
-- Run this in Supabase SQL Editor
-- ============================================

-- Create warehouses table
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    
    -- Warehouse identification
    name TEXT NOT NULL,
    code TEXT, -- Optional internal code
    
    -- Address
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state CHAR(2) NOT NULL,
    zip TEXT,
    
    -- Coordinates for route calculation
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    
    -- Settings
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Contact (optional)
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

-- Policy: Service role full access
CREATE POLICY "Service role full access on warehouses" ON warehouses
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_warehouses_api_key ON warehouses(api_key_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_default ON warehouses(api_key_id, is_default) WHERE is_default = true;

-- Function to ensure only one default warehouse per API key
CREATE OR REPLACE FUNCTION ensure_single_default_warehouse()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE warehouses 
        SET is_default = false 
        WHERE api_key_id = NEW.api_key_id 
        AND id != NEW.id 
        AND is_default = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single default
DROP TRIGGER IF EXISTS trigger_single_default_warehouse ON warehouses;
CREATE TRIGGER trigger_single_default_warehouse
    BEFORE INSERT OR UPDATE ON warehouses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_default_warehouse();

-- Grant permissions
GRANT ALL ON warehouses TO service_role;
GRANT SELECT ON warehouses TO authenticated;
