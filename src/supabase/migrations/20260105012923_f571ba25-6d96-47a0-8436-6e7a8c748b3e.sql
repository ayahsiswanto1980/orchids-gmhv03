-- Add images array and additional fields to rooms table for enhanced room details
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS capacity text DEFAULT NULL;

ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS room_size text DEFAULT NULL;

ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS bed_type text DEFAULT NULL;