
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper function to create a URL-friendly slug
function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD') // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-'); // replace multiple - with single -
}


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
    
    const id = formData.get('id');
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const image_url = formData.get('image_url') as string;

    // Create a plain text excerpt from HTML content
    const plainTextContent = content.replace(/<[^>]*>?/gm, '');
    const excerpt = plainTextContent.substring(0, 150) + '...';

    const isEditing = !!id;

    if (isEditing) {
        const { error } = await supabase
            .from('news_posts')
            .update({
                title,
                category,
                content,
                image_url,
                excerpt,
                // href is based on id, so it doesn't need to be updated unless the slug logic changes
            })
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            return { message: error.message };
        }
    } else {
        // 1. Insert the new post with the href. The href will be based on the new ID.
        const { data: newPost, error: insertError } = await supabase
            .from('news_posts')
            .insert({
                title,
                category,
                content,
                image_url,
                excerpt,
                date: new Date().toISOString(),
                views: 0,
                likes: 0,
                comments_count: 0,
                user_id: user.id,
                href: '/news/placeholder' // Temporary placeholder to satisfy NOT NULL constraint
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
