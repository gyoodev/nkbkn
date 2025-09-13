
'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getRaceEvents } from '@/lib/client/data';
import type { RaceEvent } from '@/lib/types';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Info, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const dynamic = 'force-dynamic';

function CalendarPageSkeleton() {
    return (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
                <Card>
                    <CardContent className="p-2">
                        <Skeleton className="w-full h-[298px] rounded-md" />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card className="min-h-[400px]">
                    <CardHeader>
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center text-center h-64">
                            <Skeleton className="h-5 w-72" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function CalendarPage() {
  const { text, language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [allEvents, setAllEvents] = useState<RaceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const locale = language === 'bg' ? bg : enUS;

  useEffect(() => {
    async function fetchEvents() {
        setLoading(true);
        const events = await getRaceEvents();
        setAllEvents(events);
        setLoading(false);
    }
    fetchEvents();
  }, []);

  const selectedEvent: RaceEvent | undefined = allEvents.find(
    (event) => format(new Date(event.date), 'yyyy-MM-dd') === (date ? format(date, 'yyyy-MM-dd') : '')
  );

  const eventDays = allEvents.map(event => {
      // Supabase returns date as YYYY-MM-DD string, but we need to account for timezone.
      // Creating a new Date from this string will use the local timezone.
      const [year, month, day] = event.date.split('-').map(Number);
      return new Date(year, month - 1, day);
  });

  if (loading) {
      return (
         <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader
                title={text.calendar}
                description={text.calendarPageDescription}
            />
            <CalendarPageSkeleton />
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
       <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{text.importantNotice}</AlertTitle>
        <AlertDescription>
          {text.championship2026}
        </AlertDescription>
      </Alert>
      <PageHeader
        title={text.calendar}
        description={text.calendarPageDescription}
      />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="p-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md"
                        locale={locale}
                        modifiers={{
                            events: eventDays,
                        }}
                        modifiersClassNames={{
                            events: "bg-primary/20 text-primary-foreground rounded-full",
                        }}
                    />
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>
                {text.racesFor} {date ? format(date, 'PPP', { locale }) : ''}
              </CardTitle>
               <CardDescription>
                  {selectedEvent ? selectedEvent.track : text.noRacesScheduled}
                </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvent ? (
                <div className="space-y-6">
                  {selectedEvent.races.map((race, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-4 rounded-lg border p-4">
                        <div className="flex-grow">
                             <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                {race.name}
                            </h3>
                             <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{race.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-4 w-4" />
                                    <span>{race.participants} {text.participants}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="flex flex-col items-center justify-center text-center h-64">
                    <p className="text-muted-foreground">{text.selectDateWithRaces}</p>
                 </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
