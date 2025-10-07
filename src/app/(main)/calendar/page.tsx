
import { createServerClient } from '@/lib/supabase/server';
import type { RaceEvent } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { getSiteContent } from '@/lib/server/data';
import { CalendarClientPage } from './_components/calendar-client-page';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getRaceEvents(): Promise<RaceEvent[]> {
    const supabase = createServerClient();
    try {
        const { data: events, error: eventsError } = await supabase
            .from('race_events')
            .select(`
                *,
                races (*)
            `)
            .order('date', { ascending: true });

        if (eventsError) {
            console.error('Error fetching race events:', eventsError.message);
            return [];
        }
        
        for (const event of events) {
            if (event.races) {
                event.races.sort((a, b) => a.time.localeCompare(b.time));
            }
        }

        return events as RaceEvent[];
    } catch (e: any) {
        console.error('Error in getRaceEvents:', e.message);
        return [];
    }
}


export default async function CalendarPage() {
  const cookieStore = cookies();
  const language = cookieStore.get('NEXT_LOCALE')?.value || 'bg';

  const alertKey = language === 'en' ? 'calendar_alert_en' : 'calendar_alert_bg';
  
  const [events, alertMessage] = await Promise.all([
    getRaceEvents(),
    getSiteContent(alertKey)
  ]);
  
  return <CalendarClientPage allEvents={events} alertMessage={alertMessage} />;
}
