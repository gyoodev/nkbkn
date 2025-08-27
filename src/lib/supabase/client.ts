
'use client'

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anonymous key are required. Please set them in your .env file.');
  }

  return createSupabaseBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
