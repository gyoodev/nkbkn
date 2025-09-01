
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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

  const { data, error: selectError } = await supabase
    .from('site_content')
    .select('key')
    .eq('key', 'dev_banner_visible')
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine. Log other errors.
      console.error('Failed to check for banner status:', selectError);
      return { error: `Грешка при проверка в базата данни: ${selectError.message}` };
  }

  if (data) {
    // Row exists, so update it
    const { error: updateError } = await supabase
        .from('site_content')
        .update({ content: isVisible.toString() })
        .eq('key', 'dev_banner_visible');
    
    if (updateError) {
        console.error('Failed to update banner status:', updateError);
        return { error: `Грешка при запис в базата данни: ${updateError.message}` };
    }
  } else {
    // Row does not exist, so insert it
    const { error: insertError } = await supabase
        .from('site_content')
        .insert({ key: 'dev_banner_visible', content: isVisible.toString() });
    
     if (insertError) {
        console.error('Failed to insert banner status:', insertError);
        return { error: `Грешка при създаване на запис в базата данни: ${insertError.message}` };
    }
  }


  revalidatePath('/'); // Revalidate root layout to show/hide banner
  revalidatePath('/admin/content');

  return { error: null };
}

const HeroImageSchema = z.object({
    image: z.any().refine(file => file?.size > 0, 'Файлът е задължителен.')
                   .refine(file => file?.type.startsWith('image/'), 'Моля, качете валиден файл с изображение.')
});

export async function updateHeroImage(prevState: any, formData: FormData) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = HeroImageSchema.safeParse({
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, изберете валиден файл с изображение.',
        };
    }
    
    const { image } = validatedFields.data;
    
    const fileName = `${Date.now()}-${image.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(fileName, image);

    if (uploadError) {
        return { message: `Грешка при качване на файла: ${uploadError.message}` };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('site_images')
        .getPublicUrl(uploadData.path);
        
    const { error: dbError } = await supabase
        .from('site_content')
        .upsert({ key: 'hero_image_url', content: publicUrl }, { onConflict: 'key' });

    if (dbError) {
        return { message: `Грешка при запис в базата данни: ${dbError.message}` };
    }

    revalidatePath('/');
    revalidatePath('/admin/content');
    return { success: true, message: 'Изображението е актуализирано успешно!' };
}
