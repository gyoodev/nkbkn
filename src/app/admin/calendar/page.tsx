
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { raceEvents } from '@/lib/data';
import type { RaceEvent } from '@/lib/types';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';
import { useLanguage } from '@/hooks/use-language';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function AdminCalendarPage() {
  const { language, text } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const locale = language === 'bg' ? bg : enUS;

  const selectedEvents: RaceEvent[] = raceEvents.filter(
    (event) => format(new Date(event.date), 'yyyy-MM-dd') === (date ? format(date, 'yyyy-MM-dd') : '')
  );

  const eventDays = raceEvents.map(event => new Date(event.date));

  return (
    <div>
      <PageHeader
        title="Управление на календара"
        description="Добавяйте, редактирайте и изтривайте събития от състезателния календар."
      />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Календар</CardTitle>
                 <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добави събитие
                </Button>
            </CardHeader>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                locale={locale}
                modifiers={{ events: eventDays }}
                modifiersClassNames={{ events: "bg-primary/20 text-primary-foreground rounded-full" }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>
                Събития за {date ? format(date, 'PPP', { locale }) : ''}
              </CardTitle>
              <CardDescription>
                {selectedEvents.length > 0 ? `Намерени са ${selectedEvents.length} събития.` : 'Няма намерени събития за тази дата.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedEvents.map((event) => (
                    <Card key={event.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{event.track}</CardTitle>
                          <CardDescription>{event.races.length} състезания</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Редактирай</span>
                          </Button>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Изтрий</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {event.races.map((race, index) => (
                                <li key={index}>{race.time} - {race.name} ({race.participants} участници)</li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-[300px]">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      Няма събития
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Изберете друга дата или добавете ново събитие.
                    </p>
                    <Button className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добави събитие
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
