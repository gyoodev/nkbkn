-- Horses are public data and don't need to be tied to a user
-- so we remove the user_id column if it exists

ALTER TABLE public.horses
DROP COLUMN IF EXISTS user_id;

-- Enable Row Level Security
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all users to read horses" ON public.horses;
DROP POLICY IF EXISTS "Allow authenticated users to manage horses" ON public.horses;


-- Create policy for read access for everyone
CREATE POLICY "Allow all users to read horses"
ON public.horses
FOR SELECT
USING (true);

-- Create policy for authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users to manage horses"
ON public.horses
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
