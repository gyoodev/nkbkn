
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const RaceSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, 'Името е задължително'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Въведете валиден час (HH:MM)'),
  participants: z.coerce.number().min(1, 'Участниците трябва да са поне 1'),
});

const EventSchema = z.object({
  id: z.coerce.number().optional(),
  date: z.string().min(1, 'Датата е задължителна'),
  track: z.string().min(1, 'Хиподрумът е задължителен'),
  races: z.array(RaceSchema),
});

async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
}

export async function upsertRaceEvent(prevState: any, formData: FormData) {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { message: error.message };
  }
  const supabase = createServerClient();
  
  const raceCount = Array.from(formData.keys()).filter(key => key.startsWith('race-name-')).length;
  const races = [];
  for (let i = 0; i < raceCount; i++) {
    races.push({
      id: formData.get(`race-id-${i}`),
      name: formData.get(`race-name-${i}`),
      time: formData.get(`race-time-${i}`),
      participants: formData.get(`race-participants-${i}`),
    });
  }

  const validatedFields = EventSchema.safeParse({
    id: formData.get('id'),
    date: formData.get('date'),
    track: formData.get('track'),
    races: races,
  });
  
  if (!validatedFields.success) {
      console.log(validatedFields.error.flatten())
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Моля, попълнете всички задължителни полета.',
    };
  }
  
  const { id, date, track, races: raceData } = validatedFields.data;

  // Upsert the event
  const { data: eventData, error: eventError } = await supabase
    .from('race_events')
    .upsert({ id: id || undefined, date, track })
    .select()
    .single();

  if (eventError) {
    console.error('Event upsert error:', eventError);
    return { message: `Грешка при запис на събитието: ${eventError.message}` };
  }
  
  const eventId = eventData.id;

  // Upsert the races
  const upsertPromises = raceData.map(race => {
    return supabase.from('races').upsert({
      ...race,
      id: race.id || undefined,
      event_id: eventId,
    });
  });

  const results = await Promise.all(upsertPromises);
  const raceErrors = results.map(r => r.error).filter(Boolean);

  if (raceErrors.length > 0) {
    console.error('Race upsert errors:', raceErrors);
    return { message: `Грешка при запис на състезанията: ${raceErrors.map(e => e.message).join(', ')}` };
  }
  
  // Delete races that were removed in the form
  const raceIdsToKeep = raceData.map(r => r.id).filter(Boolean);
  if (id && raceIdsToKeep.length > 0) { // Only delete if it's an existing event
    const { error: deleteError } = await supabase
        .from('races')
        .delete()
        .eq('event_id', eventId)
        .not('id', 'in', `(${raceIdsToKeep.join(',')})`);
    
    if (deleteError) {
        console.error('Race delete error:', deleteError);
        // Not returning error as it's not critical if old races are not deleted
    }
  } else if (id && raceData.length === 0) {
      // If all races are removed, delete all associated races
      const { error: deleteAllRacesError } = await supabase.from('races').delete().eq('event_id', eventId);
      if (deleteAllRacesError) {
          console.error('Error deleting all races for event:', deleteAllRacesError);
      }
  }


  revalidatePath('/admin/calendar');
  revalidatePath('/calendar');
  redirect('/admin/calendar');
}


export async function deleteRaceEvent(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    // Must delete races first due to foreign key constraint
    const { error: racesError } = await supabase.from('races').delete().eq('event_id', id);

    if (racesError) {
        return { success: false, message: `Грешка при изтриване на състезанията към събитието: ${racesError.message}` };
    }

    const { error } = await supabase.from('race_events').delete().eq('id', id);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/calendar');
    revalidatePath('/calendar');
    return { success: true, message: 'Събитието е изтрито успешно.' };
}
