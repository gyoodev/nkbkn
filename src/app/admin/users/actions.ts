
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

    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
    if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
    }
    if (!profiles) {
        return [];
    }

    const userIds = profiles.map(p => p.id);
    const { data: usersData, error: authUsersError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });
    
    if (authUsersError) {
        console.error("Error fetching auth users, this might happen on non-local environments:", authUsersError);
        // Fallback to only using profiles table if admin user list fails
        return profiles.map(profile => ({
            id: profile.id,
            email: 'не може да бъде зареден', // Provide a fallback email
            created_at: profile.created_at || new Date().toISOString(),
            role: profile.role || 'user',
            full_name: profile.full_name || null,
            username: profile.username || null,
            avatar_url: profile.avatar_url || null,
            deletion_requested: profile.deletion_requested || false,
            phone: profile.phone || null,
        }));
    }

    const authUsersById = new Map(usersData.users.map(u => [u.id, u]));

    const combined = profiles.map(profile => {
        const authUser = authUsersById.get(profile.id);
        return {
            id: profile.id,
            email: authUser?.email || 'не е намерен',
            created_at: authUser?.created_at || profile.created_at,
            role: profile.role || 'user',
            full_name: profile.full_name || null,
            username: profile.username || null,
            avatar_url: profile.avatar_url || null,
            deletion_requested: profile.deletion_requested || false,
            phone: profile.phone || null,
        };
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
