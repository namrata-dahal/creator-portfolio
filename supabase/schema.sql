-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brand TEXT NOT NULL,
  website TEXT,
  objective TEXT NOT NULL,
  format TEXT NOT NULL,
  budget TEXT NOT NULL,
  platforms TEXT[] NOT NULL,
  timeline TEXT NOT NULL,
  usage TEXT NOT NULL,
  details TEXT NOT NULL,
  consent BOOLEAN NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'reviewing', 'replied', 'booked', 'declined', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submissions)
DROP POLICY IF EXISTS "Allow public insert" ON public.inquiries;
CREATE POLICY "Allow public insert" ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No read policy: requests are read only from the Supabase dashboard, which bypasses RLS.
-- Anyone can create a Supabase account with the public key, so "authenticated" must never be granted SELECT.
DROP POLICY IF EXISTS "Allow authenticated read" ON public.inquiries;

-- Visitors may only fill in form fields; status and created_at keep their defaults.
REVOKE ALL ON public.inquiries FROM anon, authenticated;
GRANT INSERT (id, name, email, brand, website, objective, format, budget, platforms, timeline, usage, details, consent)
  ON public.inquiries TO anon, authenticated;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON public.inquiries(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- Make the Data API pick up the new table immediately
NOTIFY pgrst, 'reload schema';
