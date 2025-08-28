
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Using manual validation instead of Zod to avoid session issues.
async function validateFormData(formData: FormData) {
    const errors: Record<string, string> = {};

    const title = formData.get('title');
    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.title = 'Заглавието е задължително';
    }

    const category = formData.get('category');
    if (!category || typeof category !== 'string' || category.trim() === '') {
        errors.category = 'Категорията е задължителна';
    }
    
    const imageUrl = formData.get('image_url');
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        errors.image_url = 'URL адресът на изображението е задължителен';
    } else {
        try {
            new URL(imageUrl);
        } catch (_) {
            errors.image_url = 'Въведете валиден URL адрес на изображение';
        }
    }

    const content = formData.get('content');
     if (!content || typeof content !== 'string' || content.trim() === '') {
        errors.content = 'Съдържанието е задължително';
    }

    return errors;
}


export async function upsertNewsPost(prevState: any, formData: FormData) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Authentication required' };
    }

    const errors = await validateFormData(formData);
    if (Object.keys(errors).length > 0) {
        return {
            errors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const image_url = formData.get('image_url') as string;

    // Create a plain text excerpt from HTML content
    const plainTextContent = content.replace(/<[^>]*>?/gm, '');
    const excerpt = plainTextContent.substring(0, 150) + '...';

    const isEditing = !!id;
    const postData = {
        title,
        category,
        content,
        image_url,
        excerpt,
        user_id: user.id
    };

    if (isEditing) {
        const { error } = await supabase
            .from('news_posts')
            .update(postData)
            .eq('id', id);

        if (error) {
            console.error('Supabase update error:', error);
            return { message: error.message };
        }
    } else {
        // 1. Insert the new post with a placeholder href.
        const { data: newPost, error: insertError } = await supabase
            .from('news_posts')
            .insert({
                ...postData,
                date: new Date().toISOString(),
                views: 0,
                likes: 0,
                comments_count: 0,
                href: '/news/placeholder' // Temporary placeholder
            })
            .select('id')
            .single();

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            return { message: insertError.message };
        }
        
        const newId = newPost.id;

        // 2. Update the new post with the correct href now that we have the ID
        const finalHref = `/news/${newId}`;
        const { error: updateError } = await supabase
            .from('news_posts')
            .update({ href: finalHref })
            .eq('id', newId);
        
        if (updateError) {
             console.error('Supabase href update error:', updateError);
             // Optionally, delete the just-inserted row to avoid orphaned data
             await supabase.from('news_posts').delete().eq('id', newId);
             return { message: `Failed to update href: ${updateError.message}` };
        }
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
