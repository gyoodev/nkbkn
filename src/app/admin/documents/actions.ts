
'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  name: z.string().min(1, 'Името е задължително'),
  type: z.enum(['Правилник', 'Формуляр'], {
    required_error: 'Типът е задължителен',
  }),
  file: z
    .any()
    .refine((file) => file?.size > 0, 'Файлът е задължителен.')
});

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function uploadDocument(prevState: any, formData: FormData) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { message: error.message };
  }
  const supabase = createServerClient();

  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    file: formData.get('file'),
  });
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Моля, попълнете всички задължителни полета.',
    };
  }

  const { name, type, file } = validatedFields.data;
  const filePath = `${type}/${file.name}-${Date.now()}`;
  
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) {
    return { message: `Грешка при качване на файла: ${uploadError.message}` };
  }

  const { error: dbError } = await supabase.from('documents').insert({
    name,
    type,
    path: filePath,
  });

  if (dbError) {
    // Attempt to delete the file if the DB insert fails
    await supabase.storage.from('documents').remove([filePath]);
    return { message: `Грешка при запис в базата данни: ${dbError.message}` };
  }

  revalidatePath('/admin/documents');
  revalidatePath('/regulations');
  revalidatePath('/forms');
  redirect('/admin/documents');
}

export async function deleteDocument(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    // First get the document path
    const { data: doc, error: fetchError } = await supabase.from('documents').select('path').eq('id', id).single();
    if (fetchError || !doc) {
        return { success: false, message: 'Документът не е намерен.' };
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage.from('documents').remove([doc.path]);
     if (storageError) {
        console.error('Storage Error:', storageError);
        return { success: false, message: 'Грешка при изтриване на файла от хранилището.' };
    }
    
    // Delete record from database
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
        console.error('DB Error:', error);
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/documents');
    revalidatePath('/regulations');
    revalidatePath('/forms');
    return { success: true, message: 'Документът е изтрит успешно.' };
}
