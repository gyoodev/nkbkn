
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Submission } from '@/lib/types';

export async function deleteSubmission(id: number) {
    const supabase = createServerClient();

    const { error } = await supabase.from('submissions').delete().eq('id', id);
    if (error) {
        console.error('Error deleting submission:', error);
        return { message: error.message };
    }

    revalidatePath('/admin/submissions');
}


export async function updateSubmissionStatus(id: number, status: Submission['status']) {
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
