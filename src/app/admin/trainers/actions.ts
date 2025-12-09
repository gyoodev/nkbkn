
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, 'Името е задължително'),
  image_url: z.string().url('Въведете валиден URL адрес на изображение').optional().or(z.literal('')),
  achievements: z.string().optional(),
  wins: z.coerce.number().min(0, 'Победите трябва да са положително число'),
  mounts: z.coerce.number().min(0, 'Участията трябва да са положително число'),
});

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function upsertTrainer(prevState: any, formData: FormData) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id') || undefined,
        name: formData.get('name'),
        image_url: formData.get('image_url'),
        achievements: formData.get('achievements'),
        wins: formData.get('wins'),
        mounts: formData.get('mounts'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, name, image_url, achievements, wins, mounts } = validatedFields.data;
    
    const dataToUpsert = {
        name,
        image_url: image_url || 'https://static.vecteezy.com/system/resources/thumbnails/028/087/760/small/user-avatar-icon-doodle-style-png.png',
        achievements: achievements ? achievements.split(',').map(s => s.trim()).filter(Boolean) : [],
        wins,
        mounts
    };

    const { error } = await supabase
        .from('trainers')
        .upsert({ ...dataToUpsert, id: id || undefined });


    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/trainers');
    revalidatePath('/trainers');
    redirect('/admin/trainers');
}


export async function deleteTrainer(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('trainers').delete().eq('id', id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/trainers');
    revalidatePath('/trainers');
    return { success: true, message: 'Треньорът е изтрит успешно.' };
}
