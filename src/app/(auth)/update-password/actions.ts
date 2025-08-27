
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function updatePassword(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const supabase = createServerClient();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
      return { error: 'Паролите не съвпадат.' };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      error: error.message,
    };
  }

  return {
      message: 'Паролата ви е променена успешно.'
  }
}
