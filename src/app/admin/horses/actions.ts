
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, 'Името е задължително'),
  age: z.coerce.number().min(0, 'Възрастта трябва да е положително число'),
  sire: z.string().min(1, 'Бащата е задължителен'),
  dam: z.string().min(1, 'Майката е задължителна'),
  owner: z.string().min(1, 'Собственикът е задължителен'),
  wins: z.coerce.number().min(0, 'Победите трябва да са положително число'),
  mounts: z.coerce.number().min(0, 'Участията трябва да са положително число'),
  bestTime: z.string().optional().nullable(),
});

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function upsertHorse(prevState: any, formData: FormData) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        age: formData.get('age'),
        sire: formData.get('sire'),
        dam: formData.get('dam'),
        owner: formData.get('owner'),
        wins: formData.get('wins'),
        mounts: formData.get('mounts'),
        bestTime: formData.get('bestTime'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, ...horseData } = validatedFields.data;
    
    const { error } = await supabase
        .from('horses')
        .upsert({
            id: id || undefined,
            ...horseData
        });


    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/horses');
    revalidatePath('/horses');
    redirect('/admin/horses');
}


export async function deleteHorse(id: number) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('horses').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/horses');
    revalidatePath('/horses');
}
