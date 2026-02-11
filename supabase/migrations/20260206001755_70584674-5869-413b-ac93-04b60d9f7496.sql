-- Create packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_months INTEGER DEFAULT 12,
  features JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT,
  description_en TEXT,
  icon TEXT DEFAULT 'BookOpen',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view active packages" 
ON public.packages FOR SELECT 
USING (is_active = true);

CREATE POLICY "Public can view active services" 
ON public.services FOR SELECT 
USING (is_active = true);

-- Admin policies (admins can do everything)
CREATE POLICY "Admins can manage packages" 
ON public.packages FOR ALL 
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Admins can manage services" 
ON public.services FOR ALL 
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND is_active = true)
);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.packages (title, title_en, description, price, duration_months, features, is_featured, sort_order) VALUES
('الباقة الأساسية', 'Basic Package', 'باقة مثالية للبداية في التعليم الطبي المستمر', 500, 6, '["الوصول لـ 10 دورات", "شهادات معتمدة", "دعم فني"]', false, 1),
('الباقة المتقدمة', 'Advanced Package', 'باقة شاملة للمتخصصين', 1200, 12, '["الوصول لجميع الدورات", "شهادات معتمدة", "دعم فني على مدار الساعة", "محتوى حصري"]', true, 2),
('الباقة المؤسسية', 'Enterprise Package', 'حلول مخصصة للمؤسسات الطبية', 5000, 12, '["وصول غير محدود", "تقارير متقدمة", "مدير حساب مخصص", "تدريب مخصص"]', false, 3);

INSERT INTO public.services (title, title_en, description, icon, sort_order) VALUES
('دورات تعليمية', 'Educational Courses', 'دورات طبية معتمدة من أفضل الخبراء', 'GraduationCap', 1),
('شهادات معتمدة', 'Certified Credentials', 'احصل على شهادات معترف بها دولياً', 'Award', 2),
('مجتمع طبي', 'Medical Community', 'تواصل مع زملائك من مختلف التخصصات', 'Users', 3),
('محتوى محدث', 'Updated Content', 'محتوى يتم تحديثه باستمرار', 'RefreshCw', 4);