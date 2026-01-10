-- ============================================
-- NOTIFICATION CONFIG TABLE
-- Execute no Supabase SQL Editor
-- ============================================

-- Create notification_config table
CREATE TABLE IF NOT EXISTS notification_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'log', -- 'log', 'twilio'
    enabled BOOLEAN NOT NULL DEFAULT false,
    
    -- Twilio Configuration
    twilio_account_sid TEXT,
    twilio_auth_token TEXT,
    twilio_phone_number TEXT,      -- For SMS
    twilio_whatsapp_number TEXT,   -- For WhatsApp (e.g., +14155238886)
    
    -- Notification Preferences
    notify_on_create BOOLEAN NOT NULL DEFAULT true,
    notify_on_status_change BOOLEAN NOT NULL DEFAULT true,
    notify_on_delivery BOOLEAN NOT NULL DEFAULT true,
    preferred_channel TEXT NOT NULL DEFAULT 'whatsapp', -- 'whatsapp' or 'sms'
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE notification_config ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated service role can access
CREATE POLICY "Service role full access on notification_config"
    ON notification_config
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Insert default configuration
INSERT INTO notification_config (provider, enabled)
VALUES ('log', false)
ON CONFLICT DO NOTHING;

-- Create notification_logs table for tracking sent messages
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    channel TEXT NOT NULL, -- 'sms' or 'whatsapp'
    provider TEXT NOT NULL,
    message_id TEXT,
    status TEXT NOT NULL, -- 'sent', 'failed'
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Policy for notification_logs
CREATE POLICY "Service role full access on notification_logs"
    ON notification_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notification_logs_delivery_id ON notification_logs(delivery_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_notification_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notification_config_updated_at
    BEFORE UPDATE ON notification_config
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_config_updated_at();

-- Grant permissions
GRANT ALL ON notification_config TO authenticated;
GRANT ALL ON notification_config TO service_role;
GRANT ALL ON notification_logs TO authenticated;
GRANT ALL ON notification_logs TO service_role;

SELECT 'Notification tables created successfully!' as result;
