-- Add images array column to facilities table for multi-image support
ALTER TABLE public.facilities 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Add additional detail fields for enhanced facility information
ALTER TABLE public.facilities 
ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}';

ALTER TABLE public.facilities 
ADD COLUMN IF NOT EXISTS operating_hours text DEFAULT NULL;

ALTER TABLE public.facilities 
ADD COLUMN IF NOT EXISTS capacity text DEFAULT NULL;