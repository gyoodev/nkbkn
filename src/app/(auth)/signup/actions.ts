
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function signup(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const supabase = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;

  // First, sign up the user in the auth schema
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            phone: phone,
            email: email, // Passing email and phone here to be available in the trigger
        }
    }
  });

  if (authError) {
    return {
        error: authError.message,
    };
  }

  // Then, if the user was created successfully, update their profile.
  // A trigger on the auth.users table should have already created a profile row.
  if (authData.user) {
    const { error: profileError } = await supabase.from('profiles').update({
        phone: phone,
        email: email, // Explicitly update the email in the profiles table as well
    }).eq('id', authData.user.id);
    
    if(profileError) {
        // Log the error but don't block the user from signing up.
        // This could happen if the trigger hasn't run yet, for example.
        // The important part is that the auth user is created.
        console.error('Error updating profile with phone and email:', profileError.message);
    }
  }


  return {
    message: 'Check your email for a confirmation link.',
  }
}
