
'use server';

import { createServerClient } from '@/lib/supabase/server';

export async function signup(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const supabase = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const username = formData.get('username') as string;

  // First, sign up the user in the auth schema
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            phone: phone,
            email: email,
            username: username,
        }
    }
  });

  if (authError) {
    return {
        error: authError.message,
    };
  }

  // Then, if the user was created successfully, create their profile
  // using an RPC call to ensure data consistency.
  if (authData.user) {
    const { error: rpcError } = await supabase.rpc('create_user_profile', {
        user_id: authData.user.id,
        email: email,
        phone: phone,
        username: username,
    });
    
    if(rpcError) {
        // Log the error but don't block the user from signing up.
        // The important part is that the auth user is created.
        console.error('Error creating profile via RPC:', rpcError.message);
    }
  }

  return {
    message: 'Check your email for a confirmation link.',
  }
}
