
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function forgotPassword(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const { supabase } = createServerClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin}/auth/update-password`,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {
    message: 'Ако съществува акаунт с този имейл, ще получите линк за възстановяване.',
  };
}
