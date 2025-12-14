

'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, 'Името е задължително'),
  date_of_birth: z.string().nullable().optional(),
  egn: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  email: z.string().email('Въведете валиден имейл').nullable().optional(),
  phone: z.string().nullable().optional(),
  image_url: z.string().url('Въведете валиден URL').nullable().optional(),
  horse_count: z.coerce.number().min(0, "Броят коне трябва да е положително число.").nullable().optional(),
});

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function upsertOwner(prevState: any, formData: FormData) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        date_of_birth: formData.get('date_of_birth') || null,
        egn: formData.get('egn') || null,
        address: formData.get('address') || null,
        email: formData.get('email') || null,
        phone: formData.get('phone') || null,
        image_url: formData.get('image_url') || null,
        horse_count: formData.get('horse_count') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, ...ownerData } = validatedFields.data;
    
    const { error } = await supabase
        .from('owners')
        .upsert({
            id: id || undefined,
            ...ownerData
        });

    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/owners');
    revalidatePath('/owners');
    redirect('/admin/owners');
}

export async function deleteOwner(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('owners').delete().eq('id', id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/owners');
    revalidatePath('/owners');
    return { success: true, message: 'Собственикът е изтрит успешно.' };
}
