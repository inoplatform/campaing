-- Create countries table with WhatsApp numbers
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- ISO country code (e.g., 'US', 'UK', 'AE')
  flag TEXT NOT NULL, -- Emoji flag
  whatsapp_number TEXT NOT NULL, -- Full WhatsApp number with country code
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "countries_select_all" ON countries
  FOR SELECT
  USING (is_active = true);

-- Create policies for authenticated users to manage countries
CREATE POLICY "countries_insert_authenticated" ON countries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "countries_update_authenticated" ON countries
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "countries_delete_authenticated" ON countries
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample countries with WhatsApp numbers
INSERT INTO countries (name, code, flag, whatsapp_number, currency) VALUES
  ('United States', 'US', '🇺🇸', '1234567890', 'USD'),
  ('United Kingdom', 'GB', '🇬🇧', '447123456789', 'GBP'),
  ('United Arab Emirates', 'AE', '🇦🇪', '971501234567', 'AED'),
  ('Saudi Arabia', 'SA', '🇸🇦', '966501234567', 'SAR'),
  ('Egypt', 'EG', '🇪🇬', '201012345678', 'EGP'),
  ('Germany', 'DE', '🇩🇪', '491701234567', 'EUR'),
  ('France', 'FR', '🇫🇷', '33612345678', 'EUR'),
  ('Canada', 'CA', '🇨🇦', '14161234567', 'CAD'),
  ('Australia', 'AU', '🇦🇺', '61412345678', 'AUD'),
  ('India', 'IN', '🇮🇳', '919876543210', 'INR')
ON CONFLICT (code) DO NOTHING;
