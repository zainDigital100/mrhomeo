-- Remove phone column and replace age with date_of_birth

-- First drop the phone column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- Add date_of_birth column
ALTER TABLE public.profiles ADD COLUMN date_of_birth DATE;

-- Drop the age column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS age;