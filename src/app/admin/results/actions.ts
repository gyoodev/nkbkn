
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.coerce.number().optional(),
  raceName: z.string().min(1, 'Името на състезанието е задължително'),
  date: z.string().min(1, 'Датата е задължителна'),
  track: z.string().min(1, 'Хиподрумът е задължителен'),
  winner: z.string().min(1, 'Победителят е задължителен'),
  jockey: z.string().min(1, 'Жокеят е задължителен'),
  time: z.string().min(1, 'Времето е задължително'),
});

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function upsertResult(prevState: any, formData: FormData) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id'),
        raceName: formData.get('raceName'),
        date: formData.get('date'),
        track: formData.get('track'),
        winner: formData.get('winner'),
        jockey: formData.get('jockey'),
        time: formData.get('time'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, ...resultData } = validatedFields.data;
    
    const { error } = await supabase
        .from('results')
        .upsert({
            id: id || undefined,
            ...resultData
        });


    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/results');
    revalidatePath('/results');
    redirect('/admin/results');
}


export async function deleteResult(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('results').delete().eq('id', id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/results');
    revalidatePath('/results');
    return { success: true, message: 'Резултатът е изтрит успешно.' };
}
