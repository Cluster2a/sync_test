-- Create the Contacts table
CREATE TABLE public.Contacts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  email TEXT,
  name TEXT,
  company TEXT,
  service_interest TEXT,
  current_marketplace TEXT,
  message TEXT
);

-- Enable Row Level Security
ALTER TABLE public.Contacts ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to insert contacts (since this is a public contact form)
CREATE POLICY "Anyone can insert contacts" 
ON public.Contacts 
FOR INSERT 
WITH CHECK (true);

-- Create a policy to allow authenticated users to view contacts (for admin purposes)
CREATE POLICY "Only authenticated users can view contacts" 
ON public.Contacts 
FOR SELECT 
USING (auth.role() = 'authenticated');