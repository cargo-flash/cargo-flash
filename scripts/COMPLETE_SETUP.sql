-- ============================================
-- CARGO FLASH - COMPLETE DATABASE SETUP
-- Sistema de Rastreamento de Entregas
-- ============================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA: tracking_admins
-- Administradores do sistema
-- ============================================
CREATE TABLE IF NOT EXISTS tracking_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'operator')),
  is_active BOOLEAN DEFAULT true,
  reset_token TEXT,
  reset_token_expires TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: deliveries
-- Entregas com dados completos
-- ============================================
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'collected', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned')),
  current_location TEXT,
  current_lat DECIMAL(10, 8),
  current_lng DECIMAL(11, 8),
  
  -- Remetente
  sender_name TEXT,
  sender_email TEXT,
  sender_phone TEXT,
  origin_address TEXT,
  origin_city TEXT,
  origin_state TEXT,
  origin_zip TEXT,
  origin_lat DECIMAL(10, 8),
  origin_lng DECIMAL(11, 8),
  
  -- Destinatário
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  destination_address TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_state TEXT NOT NULL,
  destination_zip TEXT,
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  
  -- Pacote
  package_description TEXT,
  package_weight DECIMAL(10,2),
  declared_value DECIMAL(10,2),
  
  -- Comprovante
  proof_of_delivery_url TEXT,
  delivered_to TEXT,
  delivery_notes TEXT,
  
  -- Motorista (opcional)
  driver_name TEXT,
  driver_phone TEXT,
  driver_vehicle TEXT,
  driver_vehicle_plate TEXT,
  
  -- Datas
  estimated_delivery DATE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: delivery_history
-- Histórico de movimentações
-- ============================================
CREATE TABLE IF NOT EXISTS delivery_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  city TEXT,
  state TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  description TEXT,
  progress_percent DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: api_keys
-- Chaves de API para integração WooCommerce
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_preview TEXT NOT NULL,
  created_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: scheduled_events
-- Eventos agendados para simulação
-- ============================================
CREATE TABLE IF NOT EXISTS scheduled_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('collection', 'departure', 'arrival', 'in_transit', 'out_for_delivery', 'delivery_attempt', 'delivered')),
  new_status TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  description TEXT NOT NULL,
  progress_percent DECIMAL(5, 2),
  executed BOOLEAN DEFAULT false,
  executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: simulation_config
-- Configuração do motor de simulação
-- ============================================
CREATE TABLE IF NOT EXISTS simulation_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_company_name TEXT DEFAULT 'Centro de Distribuição Principal',
  origin_address TEXT DEFAULT 'Rua Principal, 1000',
  origin_city TEXT DEFAULT 'São Paulo',
  origin_state TEXT DEFAULT 'SP',
  origin_zip TEXT DEFAULT '01310-100',
  origin_lat DECIMAL(10, 8) DEFAULT -23.5505,
  origin_lng DECIMAL(11, 8) DEFAULT -46.6333,
  min_delivery_days INTEGER DEFAULT 15,
  max_delivery_days INTEGER DEFAULT 19,
  update_start_hour INTEGER DEFAULT 6,
  update_end_hour INTEGER DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: admin_activity_logs
-- Logs de auditoria
-- ============================================
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID,
  admin_name TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: notification_settings
-- Configurações de notificação por email
-- ============================================
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  smtp_host TEXT,
  smtp_port INTEGER DEFAULT 587,
  smtp_user TEXT,
  smtp_password TEXT,
  from_email TEXT DEFAULT 'naoresponder@cargoflash.com.br',
  from_name TEXT DEFAULT 'Cargo Flash',
  notify_on_status_change BOOLEAN DEFAULT true,
  notify_on_delivery BOOLEAN DEFAULT true,
  notify_on_delay BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_deliveries_tracking_code ON deliveries(tracking_code);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON deliveries(created_at);
CREATE INDEX IF NOT EXISTS idx_delivery_history_delivery_id ON delivery_history(delivery_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_events_delivery_id ON scheduled_events(delivery_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_events_scheduled_for ON scheduled_events(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_events_executed ON scheduled_events(executed);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública de entregas (via tracking_code)
CREATE POLICY "Acesso público às entregas" ON deliveries
  FOR SELECT USING (true);

CREATE POLICY "Acesso público ao histórico" ON delivery_history
  FOR SELECT USING (true);

-- Política para acesso total via service_role (backend)
CREATE POLICY "Service role full access deliveries" ON deliveries
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access history" ON delivery_history
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access admins" ON tracking_admins
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access api_keys" ON api_keys
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access events" ON scheduled_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access config" ON simulation_config
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access logs" ON admin_activity_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access notifications" ON notification_settings
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para gerar código de rastreamento
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    code := 'CF' || LPAD(FLOOR(RANDOM() * 1000000000)::TEXT, 9, '0') || 'BR';
    SELECT COUNT(*) INTO exists_count FROM deliveries WHERE tracking_code = code;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tracking_admins_updated_at
  BEFORE UPDATE ON tracking_admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_simulation_config_updated_at
  BEFORE UPDATE ON simulation_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Admin padrão (senha: admin123)
INSERT INTO tracking_admins (email, password_hash, full_name, role) 
VALUES (
  'admin@cargoflash.com.br',
  '$2a$12$eHIb9cR/2RzAvNk3hBCTnu/TK1m3Q2Xu0xZqkhoCfeVQMoGWwkanC',
  'Administrador Sistema',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Configuração padrão de simulação
INSERT INTO simulation_config (
  origin_company_name,
  origin_address,
  origin_city,
  origin_state,
  origin_zip,
  origin_lat,
  origin_lng,
  min_delivery_days,
  max_delivery_days,
  update_start_hour,
  update_end_hour
) VALUES (
  'Cargo Flash - Centro de Distribuição',
  'Av. das Nações Unidas, 12901',
  'São Paulo',
  'SP',
  '04578-910',
  -23.6228,
  -46.6998,
  15,
  19,
  6,
  20
) ON CONFLICT DO NOTHING;

-- Configuração padrão de notificações
INSERT INTO notification_settings (
  smtp_host,
  smtp_port,
  from_email,
  from_name
) VALUES (
  'smtp.gmail.com',
  587,
  'naoresponder@cargoflash.com.br',
  'Cargo Flash'
) ON CONFLICT DO NOTHING;

-- ============================================
-- ENTREGAS DE EXEMPLO
-- ============================================

-- Entrega 1: Entregue
INSERT INTO deliveries (
  tracking_code, status, current_location,
  sender_name, sender_email, sender_phone,
  origin_address, origin_city, origin_state, origin_zip, origin_lat, origin_lng,
  recipient_name, recipient_email, recipient_phone,
  destination_address, destination_city, destination_state, destination_zip, destination_lat, destination_lng,
  package_description, package_weight,
  driver_name, driver_phone, driver_vehicle,
  estimated_delivery, delivered_at,
  delivered_to, proof_of_delivery_url
) VALUES (
  'CF123456789BR', 'delivered', 'Ribeirão Preto, SP',
  'Loja Online LTDA', 'loja@exemplo.com', '11999999999',
  'Av. das Nações Unidas, 12901', 'São Paulo', 'SP', '04578-910', -23.6228, -46.6998,
  'Maria Silva Santos', 'maria@email.com', '16988887777',
  'Rua das Flores, 456', 'Ribeirão Preto', 'SP', '14090-000', -21.1767, -47.8208,
  'Smartphone Samsung Galaxy S24', 0.5,
  'Carlos Oliveira', '16999996666', 'Fiorino Branca ABC-1234',
  CURRENT_DATE - INTERVAL '2 days', NOW() - INTERVAL '1 day',
  'Maria Silva', 'https://storage.exemplo.com/proofs/cf123.jpg'
);

-- Histórico da entrega 1
INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'pending', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Pedido recebido no sistema', NOW() - INTERVAL '5 days'
FROM deliveries WHERE tracking_code = 'CF123456789BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'collected', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Pacote coletado e processado', NOW() - INTERVAL '4 days'
FROM deliveries WHERE tracking_code = 'CF123456789BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'in_transit', 'Campinas', 'Campinas', 'SP', -22.9064, -47.0616, 'Em trânsito para Ribeirão Preto', NOW() - INTERVAL '3 days'
FROM deliveries WHERE tracking_code = 'CF123456789BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'in_transit', 'Ribeirão Preto', 'Ribeirão Preto', 'SP', -21.1767, -47.8208, 'Chegou ao centro de distribuição local', NOW() - INTERVAL '2 days'
FROM deliveries WHERE tracking_code = 'CF123456789BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'out_for_delivery', 'Ribeirão Preto', 'Ribeirão Preto', 'SP', -21.1767, -47.8208, 'Pacote saiu para entrega com Carlos Oliveira', NOW() - INTERVAL '1 day 2 hours'
FROM deliveries WHERE tracking_code = 'CF123456789BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'delivered', 'Rua das Flores, 456', 'Ribeirão Preto', 'SP', -21.1767, -47.8208, 'Entregue para Maria Silva', NOW() - INTERVAL '1 day'
FROM deliveries WHERE tracking_code = 'CF123456789BR';

-- Entrega 2: Em trânsito
INSERT INTO deliveries (
  tracking_code, status, current_location,
  sender_name, sender_email, sender_phone,
  origin_address, origin_city, origin_state, origin_zip, origin_lat, origin_lng,
  recipient_name, recipient_email, recipient_phone,
  destination_address, destination_city, destination_state, destination_zip, destination_lat, destination_lng,
  package_description, package_weight,
  estimated_delivery
) VALUES (
  'CF987654321BR', 'in_transit', 'Curitiba, PR',
  'Tech Store', 'contato@techstore.com', '11988881111',
  'Av. das Nações Unidas, 12901', 'São Paulo', 'SP', '04578-910', -23.6228, -46.6998,
  'João Pedro Costa', 'joao.costa@email.com', '41999998888',
  'Av. Batel, 1500', 'Curitiba', 'PR', '80420-090', -25.4411, -49.2767,
  'Notebook Dell Inspiron 15', 2.5,
  CURRENT_DATE + INTERVAL '3 days'
);

-- Histórico da entrega 2
INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'pending', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Pedido recebido', NOW() - INTERVAL '2 days'
FROM deliveries WHERE tracking_code = 'CF987654321BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'collected', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Pacote coletado', NOW() - INTERVAL '1 day 12 hours'
FROM deliveries WHERE tracking_code = 'CF987654321BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'in_transit', 'Curitiba', 'Curitiba', 'PR', -25.4411, -49.2767, 'Em trânsito - Chegou em Curitiba', NOW() - INTERVAL '6 hours'
FROM deliveries WHERE tracking_code = 'CF987654321BR';

-- Entrega 3: Saiu para entrega
INSERT INTO deliveries (
  tracking_code, status, current_location,
  sender_name, sender_email, sender_phone,
  origin_address, origin_city, origin_state, origin_zip, origin_lat, origin_lng,
  recipient_name, recipient_email, recipient_phone,
  destination_address, destination_city, destination_state, destination_zip, destination_lat, destination_lng,
  package_description, package_weight,
  driver_name, driver_phone, driver_vehicle,
  estimated_delivery
) VALUES (
  'CF555888999BR', 'out_for_delivery', 'Belo Horizonte, MG',
  'Moda Fashion', 'vendas@modafashion.com', '11977776666',
  'Av. das Nações Unidas, 12901', 'São Paulo', 'SP', '04578-910', -23.6228, -46.6998,
  'Ana Carolina Lima', 'ana.lima@email.com', '31988889999',
  'Rua da Bahia, 2000', 'Belo Horizonte', 'MG', '30160-012', -19.9167, -43.9345,
  'Vestido de Festa + Acessórios', 1.2,
  'Roberto Mendes', '31999995555', 'Moto Honda CG-160',
  CURRENT_DATE
);

-- Histórico da entrega 3
INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'pending', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Pedido registrado', NOW() - INTERVAL '4 days'
FROM deliveries WHERE tracking_code = 'CF555888999BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'collected', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Pacote coletado', NOW() - INTERVAL '3 days'
FROM deliveries WHERE tracking_code = 'CF555888999BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'in_transit', 'Belo Horizonte', 'Belo Horizonte', 'MG', -19.9167, -43.9345, 'Chegou em BH', NOW() - INTERVAL '1 day'
FROM deliveries WHERE tracking_code = 'CF555888999BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'out_for_delivery', 'Belo Horizonte', 'Belo Horizonte', 'MG', -19.9167, -43.9345, 'Saiu para entrega com Roberto Mendes', NOW() - INTERVAL '2 hours'
FROM deliveries WHERE tracking_code = 'CF555888999BR';

-- Entrega 4: Aguardando coleta
INSERT INTO deliveries (
  tracking_code, status, current_location,
  sender_name, sender_email, sender_phone,
  origin_address, origin_city, origin_state, origin_zip, origin_lat, origin_lng,
  recipient_name, recipient_email, recipient_phone,
  destination_address, destination_city, destination_state, destination_zip, destination_lat, destination_lng,
  package_description, package_weight,
  estimated_delivery
) VALUES (
  'CF111222333BR', 'pending', 'São Paulo, SP',
  'Eletrônicos Brasil', 'atendimento@eletronicos.com', '11966665555',
  'Av. das Nações Unidas, 12901', 'São Paulo', 'SP', '04578-910', -23.6228, -46.6998,
  'Fernando Oliveira', 'fernando@email.com', '21977778888',
  'Av. Atlântica, 500', 'Rio de Janeiro', 'RJ', '22021-000', -22.9707, -43.1824,
  'Smart TV LG 55 polegadas', 15.0,
  CURRENT_DATE + INTERVAL '10 days'
);

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'pending', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Aguardando coleta no remetente', NOW() - INTERVAL '1 hour'
FROM deliveries WHERE tracking_code = 'CF111222333BR';

-- Entrega 5: Falha na entrega
INSERT INTO deliveries (
  tracking_code, status, current_location,
  sender_name, sender_email, sender_phone,
  origin_address, origin_city, origin_state, origin_zip, origin_lat, origin_lng,
  recipient_name, recipient_email, recipient_phone,
  destination_address, destination_city, destination_state, destination_zip, destination_lat, destination_lng,
  package_description, package_weight,
  driver_name, driver_phone,
  estimated_delivery, delivery_notes
) VALUES (
  'CF444555666BR', 'failed', 'Porto Alegre, RS',
  'Casa & Jardim', 'vendas@casaejardim.com', '11955554444',
  'Av. das Nações Unidas, 12901', 'São Paulo', 'SP', '04578-910', -23.6228, -46.6998,
  'Luciana Martins', 'luciana@email.com', '51988887777',
  'Rua dos Andradas, 1000', 'Porto Alegre', 'RS', '90020-015', -30.0277, -51.2287,
  'Conjunto de Panelas Tramontina', 8.0,
  'Marcos Silva', '51999994444',
  CURRENT_DATE - INTERVAL '1 day',
  'Destinatário ausente. Nova tentativa agendada.'
);

-- Histórico da entrega 5
INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'pending', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Pedido recebido', NOW() - INTERVAL '7 days'
FROM deliveries WHERE tracking_code = 'CF444555666BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'collected', 'Centro de Distribuição', 'São Paulo', 'SP', -23.6228, -46.6998, 'Coletado', NOW() - INTERVAL '6 days'
FROM deliveries WHERE tracking_code = 'CF444555666BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'in_transit', 'Porto Alegre', 'Porto Alegre', 'RS', -30.0277, -51.2287, 'Chegou em Porto Alegre', NOW() - INTERVAL '2 days'
FROM deliveries WHERE tracking_code = 'CF444555666BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'out_for_delivery', 'Porto Alegre', 'Porto Alegre', 'RS', -30.0277, -51.2287, 'Saiu para entrega', NOW() - INTERVAL '1 day 4 hours'
FROM deliveries WHERE tracking_code = 'CF444555666BR';

INSERT INTO delivery_history (delivery_id, status, location, city, state, lat, lng, description, created_at)
SELECT id, 'failed', 'Rua dos Andradas, 1000', 'Porto Alegre', 'RS', -30.0277, -51.2287, 'Tentativa de entrega falhou - Destinatário ausente', NOW() - INTERVAL '1 day 2 hours'
FROM deliveries WHERE tracking_code = 'CF444555666BR';

-- ============================================
-- TABELA: contact_messages
-- Mensagens do formulário de contato
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  admin_notes TEXT,
  replied_by UUID REFERENCES tracking_admins(id),
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: webhook_logs
-- Logs de webhooks para debug de integrações
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  request_body JSONB,
  response_body JSONB,
  status_code INTEGER,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  ip_address TEXT,
  api_key_id UUID REFERENCES api_keys(id),
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- ============================================
-- TABELA: notification_config
-- Configuração de notificações WhatsApp/SMS
-- ============================================
CREATE TABLE IF NOT EXISTS notification_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT DEFAULT 'log' CHECK (provider IN ('log', 'zapi', 'twilio')),
  enabled BOOLEAN DEFAULT false,
  
  -- Eventos que disparam notificação
  notify_on_created BOOLEAN DEFAULT true,
  notify_on_collected BOOLEAN DEFAULT false,
  notify_on_transit BOOLEAN DEFAULT false,
  notify_on_out_for_delivery BOOLEAN DEFAULT true,
  notify_on_delivered BOOLEAN DEFAULT true,
  notify_on_failed BOOLEAN DEFAULT true,
  
  -- Z-API (WhatsApp Brasil)
  zapi_instance_id TEXT,
  zapi_token TEXT,
  
  -- Twilio (SMS + WhatsApp)
  twilio_account_sid TEXT,
  twilio_auth_token TEXT,
  twilio_phone_number TEXT,
  twilio_whatsapp_number TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA: notification_logs
-- Logs de notificações enviadas
-- ============================================
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID REFERENCES deliveries(id),
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  external_id TEXT,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_delivery ON notification_logs(delivery_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at DESC);

-- ============================================
-- FIM DO SETUP
-- ============================================
