-- Create admins table for admin access management
CREATE TABLE public.admins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can read their own admin record
CREATE POLICY "Admins can view own record"
ON public.admins
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add comment to table
COMMENT ON TABLE public.admins IS 'Admin users for the CME platform';