-- 003_setup_news_posts_rls.sql

-- First, ensure RLS is enabled on the table
alter table public.news_posts enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Enable read access for all users" on public.news_posts;
drop policy if exists "Enable insert for authenticated users only" on public.news_posts;
drop policy if exists "Enable update for users based on user_id" on public.news_posts;
drop policy if exists "Enable delete for users based on user_id" on public.news_posts;


-- Create policies
create policy "Enable read access for all users"
on public.news_posts
for select
using (true);

create policy "Enable insert for authenticated users only"
on public.news_posts
for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for users based on user_id"
on public.news_posts
for update
using (auth.uid() = user_id or check_if_user_is_admin(auth.uid()))
with check (auth.uid() = user_id or check_if_user_is_admin(auth.uid()));

create policy "Enable delete for users based on user_id"
on public.news_posts
for delete
using (auth.uid() = user_id or check_if_user_is_admin(auth.uid()));


-- Helper function to check if a user is an admin
create or replace function check_if_user_is_admin(user_id uuid)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1
    from public.profiles
    where profiles.id = user_id and profiles.role = 'admin'
  );
end;
$$;
