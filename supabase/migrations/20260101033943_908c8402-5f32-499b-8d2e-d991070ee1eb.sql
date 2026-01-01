-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create design_systems table for storing user design systems
CREATE TABLE public.design_systems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  design_system_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.design_systems ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own designs
CREATE POLICY "Users can view own designs"
ON public.design_systems
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to insert their own designs
CREATE POLICY "Users can create own designs"
ON public.design_systems
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own designs
CREATE POLICY "Users can update own designs"
ON public.design_systems
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy for users to delete their own designs
CREATE POLICY "Users can delete own designs"
ON public.design_systems
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_design_systems_updated_at
BEFORE UPDATE ON public.design_systems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();