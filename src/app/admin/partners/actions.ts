
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


export async function upsertPartner(prevState: any, formData: FormData) {
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
    const supabase = createServerClient();

    const { error } = await supabase.from('partners').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/partners');
    revalidatePath('/'); // Revalidate home page
}
