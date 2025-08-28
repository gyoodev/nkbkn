
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, 'Заглавието е задължително'),
  category: z.string().min(1, 'Категорията е задължителна'),
  content: z.string().min(1, 'Съдържанието е задължително'),
  image_url: z.string().url('Въведете валиден URL адрес на изображение'),
  date: z.string(), // The date is set on the server
});


export async function upsertNewsPost(prevState: any, formData: FormData) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Authentication required' };
    }

    const validatedFields = FormSchema.safeParse({
        id: formData.get('id'),
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
        image_url: formData.get('image_url'),
        date: new Date().toISOString(),
    });

    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, ...postData } = validatedFields.data;
    
    // Create a plain text excerpt from HTML content
    const plainTextContent = postData.content.replace(/<[^>]*>?/gm, '');
    const excerpt = plainTextContent.substring(0, 150) + '...';

    const upsertData: any = {
            id: id || undefined,
            ...postData,
            excerpt,
            user_id: user.id,
    };

    if (!id) {
        upsertData.views = 0;
        upsertData.likes = 0;
        upsertData.comments_count = 0;
    }

    const { error } = await supabase
        .from('news_posts')
        .upsert(upsertData);


    if (error) {
        console.error('Supabase error:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
    if (id) {
        revalidatePath(`/news/${id}`);
    }
    redirect('/admin/news');
}


export async function DeleteNewsPost(id: number) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
     if (!user) {
        return { message: 'Authentication required' };
    }

    const { error } = await supabase.from('news_posts').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
}
