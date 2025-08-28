-- Drop the existing user_id column if it exists and is of the wrong type
ALTER TABLE public.trainers
DROP COLUMN IF EXISTS user_id;

-- Add the user_id column with the correct UUID type and reference
ALTER TABLE public.trainers
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enable Row Level Security
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all users to read trainers" ON public.trainers;
DROP POLICY IF EXISTS "Allow authenticated users to manage trainers" ON public.trainers;

-- Create policy for read access for everyone
CREATE POLICY "Allow all users to read trainers"
ON public.trainers
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users to manage trainers"
ON public.trainers
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
