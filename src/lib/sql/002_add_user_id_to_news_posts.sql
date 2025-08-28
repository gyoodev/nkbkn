-- 002_add_user_id_to_news_posts.sql
-- This script adds the user_id column to the news_posts table if it doesn't exist.

alter table public.news_posts
add column if not exists user_id uuid references auth.users (id);
