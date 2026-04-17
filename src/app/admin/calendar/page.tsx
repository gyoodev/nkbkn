'use client';

import { useEffect, useState, useTransition, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { getRaceEvents } from '@/lib/client/data';
import type { RaceEvent } from '@/lib/types';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';
import { useLanguage } from '@/hooks/use-language';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { deleteRaceEvent } from './actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Helper to parse date string as local date to avoid timezone issues
const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

function DeleteButton({ id, onDeleted }: { id: number, onDeleted: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
        const result = await deleteRaceEvent(id);
        if (result.success) {
            toast({ title: 'Успех', description: result.message });
            onDeleted();
        } else {
            toast({ variant: 'destructive', title: 'Грешка', description: result.message });
        }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Изтрий</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Наистина ли искате да изтриете това събитие?</AlertDialogTitle>
          <AlertDialogDescription>
            Това действие не може да бъде отменено. Това ще изтрие за постоянно събитието и всички свързани с него състезания.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отказ</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Изтрий</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function AdminCalendarPage() {
  const { language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [allEvents, setAllEvents] = useState<RaceEvent[]>([]);
  const locale = language === 'bg' ? bg : enUS;

  const fetchEvents = async () => {
    const events = await getRaceEvents();
    setAllEvents(events);
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allEvents
        .filter(event => parseLocalDate(event.date) >= today)
        .sort((a, b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime());
  }, [allEvents]);


  const eventDays = useMemo(() => allEvents.map(event => parseLocalDate(event.date)), [allEvents]);

  return (
    <div>
      <PageHeader
        title="Управление на календара"
        description="Добавяйте, редактирайте и изтривайте събития от състезателния календар."
      />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Календар</CardTitle>
                 <Button size="sm" asChild>
                    <Link href="/admin/calendar/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добави събитие
                    </Link>
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
        <div className="lg:col-span-2">
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>Предстоящи събития</CardTitle>
              <CardDescription>Списък с всички събития от днес нататък.</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Хиподрум</TableHead>
                      <TableHead>Състезания</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{format(parseLocalDate(event.date), 'PPP', { locale })}</TableCell>
                        <TableCell>{event.track}</TableCell>
                        <TableCell>{event.races.length}</TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin/calendar/${event.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Редактирай</span>
                            </Link>
                          </Button>
                          <DeleteButton id={event.id} onDeleted={fetchEvents} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-[300px]">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      Няма предстоящи събития
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Добавете ново събитие, за да го видите тук.
                    </p>
                    <Button className="mt-4" asChild>
                        <Link href="/admin/calendar/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Добави събитие
                        </Link>
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
