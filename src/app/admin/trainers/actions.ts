
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, 'Името е задължително'),
  imageUrl: z.string().url('Въведете валиден URL адрес на изображение'),
  achievements: z.string().min(1, 'Въведете поне едно постижение'),
  associatedHorses: z.string().min(1, 'Въведете поне един свързан кон'),
});


export async function upsertTrainer(prevState: any, formData: FormData) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Authentication required' };
    }

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        imageUrl: formData.get('imageUrl'),
        achievements: formData.get('achievements'),
        associatedHorses: formData.get('associatedHorses'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, ...trainerData } = validatedFields.data;
    
    const plainAchievements = trainerData.achievements.replace(/<[^>]*>?/gm, ' ');
    const plainAssociatedHorses = trainerData.associatedHorses.replace(/<[^>]*>?/gm, ' ');
    
    const { error } = await supabase
        .from('trainers')
        .upsert({
            id: id || undefined,
            name: trainerData.name,
            imageUrl: trainerData.imageUrl,
            achievements: plainAchievements.split(',').map(s => s.trim()).filter(Boolean),
            associatedHorses: plainAssociatedHorses.split(',').map(s => s.trim()).filter(Boolean),
            user_id: user.id
        });


    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/trainers');
    revalidatePath('/trainers');
    redirect('/admin/trainers');
}


export async function deleteTrainer(id: number) {
    const supabase = createServerClient();

    const { error } = await supabase.from('trainers').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/trainers');
    revalidatePath('/trainers');
}
