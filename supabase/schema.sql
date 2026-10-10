-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
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
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submissions)
CREATE POLICY "Allow public insert" ON inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read (for admin dashboard)
CREATE POLICY "Allow authenticated read" ON inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
