
-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can view active reviews
CREATE POLICY "Public can view active reviews"
ON public.reviews
FOR SELECT
USING (is_active = true);

-- Admins can manage reviews
CREATE POLICY "Admins can manage reviews"
ON public.reviews
FOR ALL
USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.is_active = true))
WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.is_active = true));

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public) VALUES ('reviews', 'reviews', true);

-- Public can view review images
CREATE POLICY "Public can view review images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'reviews');

-- Admins can upload review images
CREATE POLICY "Admins can upload review images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'reviews' AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.is_active = true));

-- Admins can delete review images
CREATE POLICY "Admins can delete review images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'reviews' AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.is_active = true));

-- Trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
