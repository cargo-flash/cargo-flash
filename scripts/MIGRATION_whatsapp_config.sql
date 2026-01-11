-- ============================================
-- WHATSAPP CONFIGURATION TABLE
-- Run this in Supabase SQL Editor
-- ============================================

-- Create whatsapp_config table
CREATE TABLE IF NOT EXISTS whatsapp_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT DEFAULT 'disabled' CHECK (provider IN ('disabled', 'z-api', 'evolution-api')),
    
    -- Z-API credentials
    z_api_instance_id TEXT DEFAULT '',
    z_api_token TEXT DEFAULT '',
    z_api_security_token TEXT DEFAULT '',
    
    -- Evolution API credentials
    evolution_api_url TEXT DEFAULT '',
    evolution_api_key TEXT DEFAULT '',
    evolution_instance TEXT DEFAULT '',
    
    -- Notification settings
    notify_on_received BOOLEAN DEFAULT true,
    notify_on_collected BOOLEAN DEFAULT true,
    notify_on_in_transit BOOLEAN DEFAULT false,
    notify_on_out_for_delivery BOOLEAN DEFAULT true,
    notify_on_delivered BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access" ON whatsapp_config
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Insert default config if not exists
INSERT INTO whatsapp_config (provider)
SELECT 'disabled'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_config);

-- Add index
CREATE INDEX IF NOT EXISTS idx_whatsapp_config_provider ON whatsapp_config(provider);

-- Grant permissions
GRANT ALL ON whatsapp_config TO service_role;
GRANT SELECT ON whatsapp_config TO authenticated;
