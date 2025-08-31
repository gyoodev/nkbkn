
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateContent(
  key: string,
  content: string
): Promise<{ error: string | null }> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Трябва да сте влезли в системата.' };
  }

  // Optional: Check for admin role if you want to be extra sure,
  // though RLS should handle this.
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  // if (profile?.role !== 'admin') {
  //   return { error: 'Нямате права за тази операция.' };
  // }
  
  const { error } = await supabase
    .from('site_content')
    .update({ content: content })
    .eq('key', key);
    
  if (error) {
    console.error('Error updating site content:', error);
    return { error: `Грешка при обновяване на съдържанието: ${error.message}` };
  }

  // Revalidate the path of the page that uses this content
  if (key.startsWith('about_')) {
    revalidatePath('/about');
  }

  return { error: null };
}
