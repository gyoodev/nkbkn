
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin')
    throw new Error('Administrator privileges required');
}

export async function updateContent(
  key: string,
  content: string
): Promise<{ error: string | null }> {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { error: error.message };
  }
  
  const supabase = createServerClient();
  
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


export async function updateDevBannerStatus(
  isVisible: boolean
): Promise<{ error: string | null }> {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { error: error.message };
  }
  const supabase = createServerClient();
  
  const record = { 
    key: 'dev_banner_visible',
    content: String(isVisible)
  };

  const { data, error } = await supabase
    .from('site_content')
    .update(record)
    .eq('key', record.key)
    .select();

  if (error) {
    console.error('Error updating dev banner status:', error);
    return { error: `Грешка при обновяване на статуса: ${error.message}` };
  }

  if (!data || data.length === 0) {
    // Row doesn't exist, insert it
    const { error: insertError } = await supabase
      .from('site_content')
      .insert(record);
      
    if (insertError) {
      console.error('Error inserting dev banner status:', insertError);
      return { error: `Грешка при създаване на настройката: ${insertError.message}` };
    }
  }
    
  revalidatePath('/'); // Revalidate root layout
  revalidatePath('/admin/content');

  return { error: null };
}
