
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
  image_url: z.string().url('Въведете валиден URL адрес на изображение'),
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
        id: formData.get('id'),
        name: formData.get('name'),
        location: formData.get('location'),
        description: formData.get('description'),
        image_url: formData.get('image_url'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, ...trackData } = validatedFields.data;
    
    const { error } = await supabase
        .from('tracks')
        .upsert({
            id: id || undefined,
            ...trackData
        });


    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/tracks');
    revalidatePath('/tracks');
    redirect('/admin/tracks');
}


export async function deleteTrack(id: number) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('tracks').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/tracks');
    revalidatePath('/tracks');
}
