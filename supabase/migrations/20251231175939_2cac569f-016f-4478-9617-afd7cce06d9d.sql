-- Create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create diseases table to store AI-generated disease information
CREATE TABLE public.diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  symptoms TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  overview TEXT,
  causes TEXT[] DEFAULT '{}',
  early_symptoms TEXT[] DEFAULT '{}',
  advanced_symptoms TEXT[] DEFAULT '{}',
  homeopathic_perspective TEXT,
  medicines JSONB DEFAULT '[]',
  lifestyle_tips TEXT[] DEFAULT '{}',
  when_to_consult TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;

-- Allow public read access (educational content)
CREATE POLICY "Diseases are publicly readable"
ON public.diseases
FOR SELECT
USING (true);

-- Create index for faster searches
CREATE INDEX idx_diseases_name ON public.diseases USING gin(to_tsvector('english', name));
CREATE INDEX idx_diseases_category ON public.diseases(category);
CREATE INDEX idx_diseases_slug ON public.diseases(slug);

-- Create updated_at trigger
CREATE TRIGGER update_diseases_updated_at
BEFORE UPDATE ON public.diseases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();