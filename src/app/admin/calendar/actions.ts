
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteRaceEvent(id: number) {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
     if (!user) {
        return { message: 'Authentication required' };
    }

    // Must delete races first due to foreign key constraint
    const { error: racesError } = await supabase.from('races').delete().eq('event_id', id);

    if (racesError) {
        return { message: `Error deleting races for event: ${racesError.message}` };
    }

    const { error } = await supabase.from('race_events').delete().eq('id', id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath('/admin/calendar');
    revalidatePath('/calendar');
}
