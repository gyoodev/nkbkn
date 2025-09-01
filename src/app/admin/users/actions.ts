
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
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if(usersError) {
        console.error('Error fetching users:', usersError);
        return [];
    }

    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*');
    
    if(profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return [];
    }

    const combined = users.users.map(user => {
        const profile = profiles.find(p => p.id === user.id);
        return {
            id: user.id,
            email: user.email || '',
            created_at: user.created_at,
            role: profile?.role || 'user',
            full_name: profile?.full_name || null,
            username: profile?.username || null,
            avatar_url: profile?.avatar_url || null,
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
