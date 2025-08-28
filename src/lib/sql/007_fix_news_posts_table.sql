-- Attempt to drop the column if it exists with a wrong type.
-- This might fail if the column doesn't exist, which is fine.
DO $$
BEGIN
   IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'news_posts' AND column_name = 'user_id' AND udt_name != 'uuid'
   )
   THEN
      ALTER TABLE public.news_posts DROP COLUMN user_id;
   END IF;
END $$;

-- Add the user_id column with the correct uuid type and foreign key constraint, if it doesn't exist.
DO $$
BEGIN
   IF NOT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'news_posts' AND column_name = 'user_id'
   )
   THEN
      ALTER TABLE public.news_posts
      ADD COLUMN user_id UUID REFERENCES auth.users(id);
   END IF;
END $$;
