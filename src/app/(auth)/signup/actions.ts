
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const supabase = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const username = formData.get('username') as string;
  
  // Attempt to sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
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
            error: 'Потребител с този имейл вече съществува. Моля, опитайте да влезете в системата.',
        };
    }
    return {
        error: authError.message,
    };
  }
  
  if (authData.user) {
    const { error: rpcError } = await supabase.rpc('create_user_profile', {
        user_id: authData.user.id,
        email: email,
        phone: phone,
        username: username,
    });

    if (rpcError) {
        console.error('Error creating profile via RPC after signup:', rpcError.message);
        // We can still try to log the user in even if profile creation fails.
        // It's better than blocking them completely.
    }

    // Since we are not requiring email confirmation, we can log the user in directly.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { error: `Регистрацията беше успешна, но възникна грешка при вписване: ${signInError.message}` };
    }
    
    redirect('/profile');

  }

  // Fallback case
  return {
    error: 'Възникна неочаквана грешка по време на регистрацията. Моля, опитайте отново.',
  }
}
