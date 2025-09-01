
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

    // Fetch all profiles directly from the 'profiles' table.
    // This table should contain all the necessary information, including email,
    // which is now being populated upon user signup.
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
    
    if (!profiles) {
        return [];
    }

    // The UserProfile type expects an email, which might be null in the DB
    // for older users. We ensure it's always a string.
    return profiles.map(profile => ({
        id: profile.id,
        email: profile.email || 'не е наличен', // Use email from profiles table
        created_at: profile.created_at || new Date().toISOString(), // Use created_at from profiles table
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
