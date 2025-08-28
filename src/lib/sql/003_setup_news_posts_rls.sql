-- Enable Row Level Security
alter table news_posts enable row level security;

-- Drop existing policies if they exist, to avoid conflicts
drop policy if exists "Authenticated users can insert news posts" on news_posts;
drop policy if exists "Users can update their own news posts" on news_posts;
drop policy if exists "Users can delete their own news posts" on news_posts;
drop policy if exists "Allow public read access to news posts" on news_posts;

-- Create new, simpler policies
-- 1. Allow public read access to everyone
create policy "Allow public read access to news posts"
  on news_posts for select
  using ( true );

-- 2. Allow authenticated users to insert new posts
create policy "Authenticated users can insert news posts"
  on news_posts for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- 3. Allow authenticated users to update any post
create policy "Authenticated users can update any post"
  on news_posts for update
  to authenticated
  using ( true )
  with check ( true );
  
-- 4. Allow authenticated users to delete any post
create policy "Authenticated users can delete any post"
  on news_posts for delete
  to authenticated
  using ( true );
