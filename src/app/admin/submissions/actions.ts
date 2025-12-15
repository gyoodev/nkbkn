

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

export async function approveSubmission(submission: Submission): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    try {
        switch (submission.type) {
            case 'Жокей':
                const { error: jockeyError } = await supabase.from('jockeys').insert({
                    name: `${submission.first_name} ${submission.last_name}`,
                    wins: 0,
                    mounts: 0,
                    imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/028/087/760/small/user-avatar-icon-doodle-style-png.png',
                });
                if (jockeyError) throw jockeyError;
                break;
            case 'Треньор':
                 const { error: trainerError } = await supabase.from('trainers').insert({
                    name: `${submission.first_name} ${submission.last_name}`,
                    image_url: 'https://static.vecteezy.com/system/resources/thumbnails/028/087/760/small/user-avatar-icon-doodle-style-png.png',
                    wins: 0,
                    mounts: 0,
                    associated_horses: [],
                 });
                if (trainerError) throw trainerError;
                break;
            case 'Кон':
                const { error: horseError } = await supabase.from('horses').insert({
                    name: submission.horse_name,
                    age: submission.age,
                    sire: submission.sire,
                    dam: submission.dam,
                    owner: submission.name, // Use the name of the submitter as the owner
                    mounts: submission.mounts || 0,
                    wins: submission.wins || 0,
                    origin: submission.origin,
                    passport_number: submission.passport_number,
                    gender: submission.gender,
                });
                if (horseError) throw horseError;
                break;
            case 'Собственик':
                const { error: ownerError } = await supabase.from('owners').insert({
                    name: `${submission.first_name} ${submission.last_name}`,
                    date_of_birth: submission.date_of_birth,
                    egn: submission.egn,
                    address: submission.address,
                    email: submission.email,
                    phone: submission.phone,
                    horse_count: submission.horse_count || 0,
                    image_url: 'https://static.vecteezy.com/system/resources/thumbnails/028/087/760/small/user-avatar-icon-doodle-style-png.png',
                });
                if (ownerError) throw ownerError;
                break;
            default:
                return { success: false, message: 'Невалиден тип заявка.' };
        }

        // After successful insertion, delete the submission
        const { error: deleteError } = await supabase.from('submissions').delete().eq('id', submission.id);
        if (deleteError) {
            // Log the error but don't fail the whole operation, as the main task is done
            console.error(`Failed to delete submission ${submission.id} after approval:`, deleteError);
        }

        revalidatePath('/admin/submissions');
        revalidatePath('/admin/jockeys');
        revalidatePath('/admin/trainers');
        revalidatePath('/admin/horses');
        revalidatePath('/admin/owners');
        revalidatePath('/jockeys');
        revalidatePath('/trainers');
        revalidatePath('/horses');
        revalidatePath('/owners');

        return { success: true, message: 'Заявката е одобрена и данните са добавени успешно.' };

    } catch (error: any) {
        console.error('Error approving submission:', error);
        return { success: false, message: `Грешка при одобряване на заявката: ${error.message}` };
    }
}
