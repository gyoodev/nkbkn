
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ContactSubmission } from '@/lib/types';
import { z } from 'zod';
import { sendEmail } from '@/lib/server/email';
import { EmailTemplate } from '@/lib/email-template';
import { getSiteContent } from '@/lib/server/data';

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function deleteContactSubmission(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) {
        console.error('Error deleting contact submission:', error);
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/contacts');
    return { success: true, message: 'Запитването е изтрито успешно.' };
}

export async function updateContactStatus(id: number, status: ContactSubmission['status']) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();
    
    const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error(`Error updating contact submission ${id} to status ${status}:`, error);
        return { message: error.message };
    }
    
    revalidatePath('/admin/contacts');
}
