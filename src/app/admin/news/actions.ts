
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');

    return user;
}

// Using manual validation instead of Zod to avoid session issues.
async function validateFormData(formData: FormData) {
    const errors: Record<string, string> = {};
    const id = formData.get('id');

    const title = formData.get('title');
    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.title = 'Заглавието е задължително';
    }

    const category = formData.get('category');
    if (!category || typeof category !== 'string' || category.trim() === '') {
        errors.category = 'Категорията е задължителна';
    }
    
    const imageFile = formData.get('image_file') as File;
    if (!id && (!imageFile || imageFile.size === 0)) {
        errors.image_file = 'Изображението е задължително';
    }
    if (imageFile && imageFile.size > 0 && !imageFile.type.startsWith('image/')) {
        errors.image_file = 'Моля, качете валиден файл с изображение.';
    }


    const content = formData.get('content');
     if (!content || typeof content !== 'string' || content.trim() === '') {
        errors.content = 'Съдържанието е задължително';
    }

    return errors;
}


export async function upsertNewsPost(prevState: any, formData: FormData) {
    let user;
    try {
        user = await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();
    
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
    const imageFile = formData.get('image_file') as File;
    const currentImageUrl = formData.get('current_image_url') as string;

    let imageUrl = currentImageUrl;

    if (imageFile && imageFile.size > 0) {
        try {
            const uploadDir = path.join(process.cwd(), 'public', 'news-img');
            await fs.mkdir(uploadDir, { recursive: true });
            
            const fileExtension = path.extname(imageFile.name);
            const fileName = `${Date.now()}${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            const buffer = Buffer.from(await imageFile.arrayBuffer());
            await fs.writeFile(filePath, buffer);

            imageUrl = `/news-img/${fileName}`;
        } catch (e) {
            console.error('File upload error:', e);
            return { message: 'Грешка при качване на файла.' };
        }
    }


    if (!imageUrl) {
         return {
            errors: { image_file: 'Изображението е задължително.' },
            message: 'Моля, качете изображение.',
        };
    }

    // Create a plain text excerpt from HTML content
    const plainTextContent = content.replace(/<[^>]*>?/gm, '');
    const excerpt = plainTextContent.substring(0, 150) + '...';

    const postData = {
        title,
        category,
        content,
        image_url: imageUrl,
        excerpt,
        user_id: user.id,
    };
    
    if (id) {
        // Update existing post
        const { error } = await supabase
            .from('news_posts')
            .update(postData)
            .eq('id', id);

        if (error) {
            console.error('Supabase update error:', error);
            return { message: error.message };
        }
    } else {
        // Create new post
        const { data: newPost, error: insertError } = await supabase
            .from('news_posts')
            .insert({
                ...postData,
                date: new Date().toISOString(),
                views: 0,
                likes: 0,
                comments_count: 0,
                href: '/news/placeholder', // Temporary placeholder
            })
            .select('id')
            .single();

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            return { message: insertError.message };
        }
        
        const newId = newPost.id;
        const finalHref = `/news/${newId}`;
        const { error: updateError } = await supabase
            .from('news_posts')
            .update({ href: finalHref })
            .eq('id', newId);
        
        if (updateError) {
             console.error('Supabase href update error:', updateError);
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
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('news_posts').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/news');
    revalidatePath('/news');
}
