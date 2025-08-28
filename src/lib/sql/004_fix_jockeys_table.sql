-- Drop the existing user_id column if it exists and is of the wrong type
ALTER TABLE public.jockeys
DROP COLUMN IF EXISTS user_id;

-- Add the user_id column with the correct UUID type and reference
ALTER TABLE public.jockeys
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable Row Level Security
ALTER TABLE public.jockeys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all users to read jockeys" ON public.jockeys;
DROP POLICY IF EXISTS "Allow authenticated users to manage jockeys" ON public.jockeys;

-- Create policy for read access for everyone
CREATE POLICY "Allow all users to read jockeys"
ON public.jockeys
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users to manage jockeys"
ON public.jockeys
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
