
'use server';

import { createServerClient } from '@/lib/supabase/server';
import type { UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
    return user;
}


export async function getUserProfiles(): Promise<UserProfile[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
    
    if (!data) {
        return [];
    }

    // Map the data to ensure it matches the UserProfile type and handle potential nulls
    return data.map(profile => ({
        id: profile.id,
        email: profile.email || 'не е наличен', // Provide a fallback for email
        created_at: profile.created_at || new Date().toISOString(), // Provide a fallback for date
        role: profile.role || 'user',
        full_name: profile.full_name || null,
        username: profile.username || null,
        avatar_url: profile.avatar_url || null,
        deletion_requested: profile.deletion_requested || false,
        phone: profile.phone || null,
    }));
}

export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<{ error: string | null }> {
    try {
        await checkAdmin();
    } catch(e: any) {
        return { error: e.message };
    }

    const supabase = createServerClient();

    const { error } = await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', userId);

    if (error) {
        console.error(`Error updating role for user ${userId}:`, error);
        return { error: 'Възникна грешка при промяната на ролята.' };
    }
    
    revalidatePath('/admin/users');
    return { error: null };
}
