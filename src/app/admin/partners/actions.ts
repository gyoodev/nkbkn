
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, 'Името е задължително'),
  logo_url: z.string().url('Въведете валиден URL адрес на лого'),
});

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function upsertPartner(prevState: any, formData: FormData) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        logo_url: formData.get('logo_url'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, ...partnerData } = validatedFields.data;
    
    const { error } = await supabase
        .from('partners')
        .upsert({
            id: id || undefined,
            ...partnerData
        });


    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/partners');
    revalidatePath('/'); // Revalidate home page
    redirect('/admin/partners');
}


export async function deletePartner(id: number) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('partners').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/partners');
    revalidatePath('/'); // Revalidate home page
}
