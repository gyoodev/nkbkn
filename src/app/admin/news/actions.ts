
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const fileSchema = z
  .any()
  .refine((file): file is File => file instanceof File && file.size > 0, { message: 'Изображението е задължително' })
  .refine((file) => file.type.startsWith('image/'), { message: 'Моля, качете валиден файл с изображение.' })

const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Заглавието е задължително'),
  category: z.string().min(1, 'Категорията е задължителна'),
  content: z.string().min(1, 'Съдържанието е задължително'),
  image_file: z.any(),
  current_image_url: z.string().optional(),
}).superRefine((data, ctx) => {
    // If it's a new post (no ID), the image file is required.
    if (!data.id && !(data.image_file instanceof File && data.image_file.size > 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Изображението е задължително",
            path: ['image_file'],
        });
    }
    // If it's an existing post and a file is provided, validate it.
    if (data.id && data.image_file instanceof File && data.image_file.size > 0) {
       if (!data.image_file.type.startsWith('image/')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Моля, качете валиден файл с изображение.",
                path: ['image_file'],
            });
       }
    }
});


async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');

    return user;
}

export async function upsertNewsPost(prevState: any, formData: FormData) {
    let user;
    try {
        user = await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();
    
     const validatedFields = FormSchema.safeParse({
        id: formData.get('id') || undefined,
        title: formData.get('title'),
        category: formData.get('category'),
        content: formData.get('content'),
        image_file: formData.get('image_file'),
        current_image_url: formData.get('current_image_url') || undefined,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Моля, попълнете всички задължителни полета.',
        };
    }
    
    const { id, title, category, content, image_file, current_image_url } = validatedFields.data;
    
    let imageUrl = current_image_url;

    // Check if a new file is uploaded and has content
    if (image_file && image_file.size > 0) {
        try {
            const uploadDir = path.join(process.cwd(), 'public', 'news-img');
            await fs.mkdir(uploadDir, { recursive: true });
            
            const fileExtension = path.extname(image_file.name);
            const fileName = `${Date.now()}${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            const buffer = Buffer.from(await image_file.arrayBuffer());
            await fs.writeFile(filePath, buffer);

            imageUrl = `/news-img/${fileName}`;
        } catch (e) {
            console.error('File upload error:', e);
            return { message: 'Грешка при качване на файла.' };
        }
    }


    if (!imageUrl) {
         return {
            errors: { image_file: ['Изображението е задължително.'] },
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
