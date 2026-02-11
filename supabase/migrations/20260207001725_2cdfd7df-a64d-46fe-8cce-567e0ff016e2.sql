
-- Create settings table (key-value store)
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Public can view settings"
  ON public.settings
  FOR SELECT
  USING (true);

-- Admins can manage settings
CREATE POLICY "Admins can manage settings"
  ON public.settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (key, value, label) VALUES
  ('custom_min_hours', '10', 'أقل عدد ساعات مخصصة'),
  ('custom_max_hours', '100', 'أكبر عدد ساعات مخصصة'),
  ('custom_price_per_hour', '40', 'سعر الساعة (ريال)'),
  ('whatsapp_number', '966500000000', 'رقم الواتساب'),
  ('phone_number', '966500000000', 'رقم الاتصال'),
  ('email', 'info@ofuq.com', 'البريد الإلكتروني');
