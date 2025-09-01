
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
    .upsert({ key: key, content: content }, { onConflict: 'key' });
    
  if (error) {
    console.error('Error updating site content:', error);
    return { error: `Грешка при обновяване на съдържанието: ${error.message}` };
  }

  // Revalidate the path of the page that uses this content
  if (key.startsWith('about_')) {
    revalidatePath('/about');
  } else if (key === 'terms_content') {
    revalidatePath('/terms');
  } else if (key === 'privacy_content') {
    revalidatePath('/privacy');
  } else {
    revalidatePath('/'); // Revalidate root for other changes
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

  const { error } = await supabase
    .from('site_content')
    .upsert({ key: 'dev_banner_visible', content: isVisible.toString() }, { onConflict: 'key' });
    
    if (error) {
        console.error('Failed to update banner status:', error);
        return { error: `Грешка при запис в базата данни: ${error.message}` };
    }

  revalidatePath('/'); // Revalidate root layout to show/hide banner
  revalidatePath('/admin/content');

  return { error: null };
}

const ImageSchema = z.object({
    image: z.any().refine(file => file?.size > 0, 'Файлът е задължителен.')
                   .refine(file => file?.type.startsWith('image/'), 'Моля, качете валиден файл с изображение.')
});

async function handleImageUpload(prevState: any, formData: FormData, contentKey: string, bucket: string) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = ImageSchema.safeParse({
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, изберете валиден файл с изображение.',
            success: false,
        };
    }
    
    const { image } = validatedFields.data;
    
    const fileName = `${Date.now()}-${image.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, image);

    if (uploadError) {
        console.error("Upload Error: ", uploadError);
        return { message: `Грешка при качване на файла: ${uploadError.message}`, success: false };
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);
        
    const { error: dbError } = await supabase
        .from('site_content')
        .upsert({ key: contentKey, content: publicUrl }, { onConflict: 'key' });

    if (dbError) {
         console.error("DB Error: ", dbError);
        return { message: `Грешка при запис в базата данни: ${dbError.message}`, success: false };
    }

    revalidatePath('/(main)', 'layout');
    revalidatePath('/admin/content');
    return { success: true, message: 'Изображението е актуализирано успешно!' };
}


export async function updateHeroImage(prevState: any, formData: FormData) {
    return handleImageUpload(prevState, formData, 'hero_image_url', 'site_images');
}


export async function updateSiteLogo(prevState: any, formData: FormData) {
    return handleImageUpload(prevState, formData, 'site_logo_url', 'site_images');
}
