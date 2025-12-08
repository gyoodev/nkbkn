
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Името е задължително'),
  wins: z.coerce.number().min(0, 'Победите трябва да са положително число'),
  mounts: z.coerce.number().min(0, 'Участията трябва да са положително число'),
  image_url: z.string().url('Въведете валиден URL адрес на изображение'),
});

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function upsertJockey(prevState: any, formData: FormData) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id') || undefined,
        name: formData.get('name'),
        wins: formData.get('wins'),
        mounts: formData.get('mounts'),
        image_url: formData.get('imageUrl'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, ...jockeyData } = validatedFields.data;
    
    const { error } = await supabase
        .from('jockeys')
        .upsert({
            id: id ? parseInt(id, 10) : undefined,
            ...jockeyData
        });


    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/jockeys');
    revalidatePath('/jockeys');
    if (id) {
        revalidatePath(`/jockeys/${id}`);
    }
    redirect('/admin/jockeys');
}


export async function deleteJockey(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('jockeys').delete().eq('id', id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/jockeys');
    revalidatePath('/jockeys');
    return { success: true, message: 'Жокеят е изтрит успешно.' };
}
