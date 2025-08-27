
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const FormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(20).optional(),
  fullName: z.string().max(50).optional(),
  website: z.string().url("Please enter a valid URL.").optional(),
});

type State = {
  message: string;
  error: boolean;
};

export async function updateProfile(prevState: State, formData: FormData): Promise<State> {
  const { supabase } = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: 'Not authenticated.',
      error: true,
    };
  }
  
  const validatedFields = FormSchema.safeParse({
    username: formData.get('username') || undefined,
    fullName: formData.get('fullName') || undefined,
    website: formData.get('website') || undefined,
  });
  
  if (!validatedFields.success) {
      return {
        message: validatedFields.error.flatten().fieldErrors.toString(),
        error: true,
    };
  }

  const { username, fullName, website } = validatedFields.data;

  const { error } = await supabase.from('profiles').update({
    username,
    full_name: fullName,
    website,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id);

  if (error) {
    return {
      message: error.message,
      error: true,
    };
  }

  revalidatePath('/profile');
  return {
    message: 'Профилът е актуализиран успешно!',
    error: false,
  };
}
