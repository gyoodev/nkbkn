
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
        emailRedirectTo: `${new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').origin}/auth/callback`,
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
  
  if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
    // This case handles when the user already exists but is not confirmed.
    // Supabase doesn't resend the confirmation email automatically on sign-up attempts.
    return {
        message: 'Потребител с този имейл вече съществува. Моля, проверете имейла си за линк за потвърждение.',
    };
  }
  
  if (authData.user) {
     // Create a profile for the new user.
    const { error: rpcError } = await supabase.rpc('create_user_profile', {
        user_id: authData.user.id,
        email: email,
        phone: phone,
        username: username,
    });
    if (rpcError) {
        console.error('Error creating profile via RPC after signup:', rpcError.message);
        // Do not block the user if profile creation fails, but log the error.
        // We will show them the confirmation message anyway.
    }
  }

  // Fallback case
  return {
    message: 'Регистрацията е успешна! Моля, проверете имейла си, за да потвърдите своя акаунт.',
  }
}
