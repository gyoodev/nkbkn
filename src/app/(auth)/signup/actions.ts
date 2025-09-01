
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function signup(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const supabase = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return {
        error: authError.message,
    };
  }

  if (authData.user) {
    const { error: profileError } = await supabase.from('profiles').update({
        phone: phone,
    }).eq('id', authData.user.id);
    
    if(profileError) {
        // Log the error but don't block the user from signing up
        console.error('Error updating profile with phone number:', profileError.message);
    }
  }


  return {
    message: 'Check your email for a confirmation link.',
  }
}
