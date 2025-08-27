
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function signup(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const { supabase } = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
        error: error.message,
    };
  }

  return {
    message: 'Check your email for a confirmation link.',
  }
}
