

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
    try {
        await checkAdmin();
    } catch {
        return [];
    }

    const supabase = createServerClient();

    // 1. Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
    }
    if (!profiles) {
        return [];
    }
    
    // 2. Fetch all auth users from the auth schema
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
     if (usersError) {
        console.error('Error fetching auth users:', usersError);
        // This might fail on some environments. Fallback to profiles only.
        return profiles.map(p => ({
            id: p.id,
            email: 'N/A', // Cannot be loaded
            created_at: p.created_at || new Date().toISOString(),
            role: p.role || 'user',
            full_name: p.full_name || null,
            username: p.username || null,
            avatar_url: p.avatar_url || null,
        }));
    }

    // 3. Combine them
    const combined = profiles.map(profile => {
        const authUser = users.find(u => u.id === profile.id);
        return {
            id: profile.id,
            email: authUser?.email || 'Не е намерен',
            created_at: authUser?.created_at || profile.created_at, // Fallback to profile creation if available
            role: profile.role || 'user',
            full_name: profile.full_name || null,
            username: profile.username || null,
            avatar_url: profile.avatar_url || null,
        }
    });


    return combined;
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
