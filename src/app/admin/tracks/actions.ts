
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, 'Името е задължително'),
  location: z.string().min(1, 'Местоположението е задължително'),
  description: z.string().min(1, 'Описанието е задължително'),
  track_length: z.coerce.number().min(1, 'Дължината на пистата е задължителна'),
  image_file: z.any(),
  current_image_url: z.string().optional(),
}).superRefine((data, ctx) => {
    const imageFile = data.image_file;
    const isFile = imageFile instanceof File && imageFile.size > 0;

    // Case 1: Creating a new track
    if (!data.id) {
        if (!isFile) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Изображението е задължително",
                path: ['image_file'],
            });
        } else if (!imageFile.type.startsWith('image/')) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Моля, качете валиден файл с изображение.",
                path: ['image_file'],
            });
        }
    }
    // Case 2: Editing a track, and a new file is uploaded
    else if (data.id && isFile) {
       if (!imageFile.type.startsWith('image/')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Моля, качете валиден файл с изображение.",
                path: ['image_file'],
            });
       }
    }
});


async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function upsertTrack(prevState: any, formData: FormData) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id') || undefined,
        name: formData.get('name'),
        location: formData.get('location'),
        description: formData.get('description'),
        track_length: formData.get('track_length'),
        image_file: formData.get('image_file'),
        current_image_url: formData.get('current_image_url') || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, image_file, current_image_url, ...trackData } = validatedFields.data;

    let imageUrl = current_image_url;

    if (image_file && image_file.size > 0) {
        const fileName = `${Date.now()}-${image_file.name}`;
        
        if (id && current_image_url) {
            const oldFileName = current_image_url.split('/').pop();
            if (oldFileName) {
                // The bucket for tracks is 'site_images'
                await supabase.storage.from('site_images').remove([oldFileName]);
            }
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('site_images')
            .upload(fileName, image_file);

        if (uploadError) {
            console.error('Supabase Storage upload error:', uploadError);
            return { message: `Грешка при качване на файла: ${uploadError.message}` };
        }
        
        const { data: { publicUrl } } = supabase.storage
            .from('site_images')
            .getPublicUrl(uploadData.path);
            
        imageUrl = publicUrl;
    }

    if (!imageUrl) {
         return {
            errors: { image_file: ['Изображението е задължително.'] },
            message: 'Моля, качете изображение.',
        };
    }

    const dataToSave = {
        ...trackData,
        image_url: imageUrl,
    };
    
    if (id) {
        // Update existing track
        const { error } = await supabase
            .from('tracks')
            .update(dataToSave)
            .eq('id', id);
        if (error) {
            console.error('Supabase error:', error);
            return { message: error.message };
        }
    } else {
        // Insert new track
        const { error } = await supabase
            .from('tracks')
            .insert({ ...dataToSave, id: undefined });
        if (error) {
            console.error('Supabase error:', error);
            return { message: error.message };
        }
    }


    revalidatePath('/admin/tracks');
    revalidatePath('/tracks');
    redirect('/admin/tracks');
}


export async function deleteTrack(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();
    
     // Optional: Delete the image from storage as well
    const { data: track, error: fetchError } = await supabase.from('tracks').select('image_url').eq('id', id).single();
    if (track && track.image_url) {
        const fileName = track.image_url.split('/').pop();
        if (fileName) {
             // We don't know the full path, just the name. This might fail if files are in subdirectories.
             // Best effort deletion.
            try {
                await supabase.storage.from('site_images').remove([fileName]);
            } catch (storageError) {
                console.warn(`Could not delete image ${fileName} from storage:`, storageError)
            }
        }
    }


    const { error } = await supabase.from('tracks').delete().eq('id', id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/tracks');
    revalidatePath('/tracks');
    return { success: true, message: 'Хиподрумът е изтрит успешно.' };
}
