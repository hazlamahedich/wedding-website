-- Create RSVP table
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  attending TEXT NOT NULL,
  number_of_guests INTEGER NOT NULL,
  dietary_restrictions TEXT,
  message TEXT,
  needs_accommodation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow anonymous inserts" ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy to allow reads only for authenticated users
CREATE POLICY "Allow authenticated reads" ON public.rsvps
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS rsvps_email_idx ON public.rsvps (email);

-- Add a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_rsvps_updated_at
BEFORE UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 