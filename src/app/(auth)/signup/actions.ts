
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function signup(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const supabase = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const username = formData.get('username') as string;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Attempt to sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
            phone: phone,
            username: username,
            full_name: username, // Also save username as full_name initially
        }
    }
  });

  if (authError) {
    if (authError.message.includes('User already registered')) {
        return {
            message: 'Потребител с този имейл вече съществува. Моля, проверете имейла си за линк за потвърждение или опитайте да влезете в системата.',
        };
    }
    return {
        error: authError.message,
    };
  }
  
  if (authData.user) {
     // If the user is new (identities is not empty), we create their profile.
     // If they already exist but are unconfirmed, identities will be empty, and we don't need to do anything here.
    if (authData.user.identities && authData.user.identities.length > 0) {
        const { error: rpcError } = await supabase.rpc('create_user_profile', {
            user_id: authData.user.id,
            email: email,
            phone: phone,
            username: username,
        });

        if (rpcError) {
            console.error('Error creating profile via RPC after signup:', rpcError.message);
            // Don't block the user, but log the issue. The confirmation email should still go out.
        }
    }

    return {
        message: 'Успешна регистрация! Моля, проверете имейла си за линк за потвърждение.',
    }
  }

  // Fallback case
  return {
    error: 'Възникна неочаквана грешка по време на регистрацията. Моля, опитайте отново.',
  }
}
