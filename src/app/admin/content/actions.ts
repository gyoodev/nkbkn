
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

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
  
  const settingsPath = path.join(process.cwd(), 'src', 'config', 'settings.json');

  try {
    const fileContent = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(fileContent);
    settings.dev_banner_visible = isVisible;
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');

    revalidatePath('/'); // Revalidate root layout to show/hide banner
    revalidatePath('/admin/content');

    return { error: null };
  } catch(error: any) {
     console.error('Failed to update settings.json:', error);
     return { error: `Грешка при запис на файла: ${error.message}` };
  }
}
