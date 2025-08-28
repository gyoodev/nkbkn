
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
});


export async function upsertHorse(prevState: any, formData: FormData) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Authentication required' };
    }

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        age: formData.get('age'),
        sire: formData.get('sire'),
        dam: formData.get('dam'),
        owner: formData.get('owner'),
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
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
     if (!user) {
        return { message: 'Authentication required' };
    }

    const { error } = await supabase.from('horses').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/horses');
    revalidatePath('/horses');
}
