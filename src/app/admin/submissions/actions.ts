
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Submission } from '@/lib/types';

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function deleteSubmission(id: number) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('submissions').delete().eq('id', id);
    if (error) {
        console.error('Error deleting submission:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/submissions');
}


export async function updateSubmissionStatus(id: number, status: Submission['status']) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();
    
    const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error(`Error updating submission ${id} to status ${status}:`, error);
        return { message: error.message };
    }
    
    revalidatePath('/admin/submissions');
}
