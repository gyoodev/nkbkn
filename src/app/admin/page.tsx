
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { horses, jockeys, trainers, raceEvents } from '@/lib/data';
import { Activity, Users, Calendar as CalendarIcon, PlusCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { HorseIcon } from '@/components/icons/horse-icon';

const resultsData = [
    { 
        raceName: 'Купа "Надежда"', 
        date: '2024-08-12', 
        track: 'Хиподрум Банкя', 
        winner: 'Вятър', 
    },
    { 
        raceName: 'Спринт "София"', 
        date: '2024-08-12', 
        track: 'Хиподрум Банкя', 
        winner: 'Мълния', 
    },
    { 
        raceName: 'Купа "Мадарски конник"', 
        date: '2024-08-05', 
        track: 'Хиподрум Шумен', 
        winner: 'Торнадо', 
    },
];

export default function AdminDashboardPage() {

    const stats = [
        { title: 'Общо коне', value: horses.length, icon: <HorseIcon className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Общо жокеи', value: jockeys.length, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Общо треньори', value: trainers.length, icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Предстоящи събития', value: raceEvents.length, icon: <CalendarIcon className="h-4 w-4 text-muted-foreground" /> },
    ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Табло за управление"
        description="Преглед на основната статистика и дейност на уебсайта."
      />
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {stats.map((stat, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {stat.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
            </Card>
        ))}
      </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center">
                     <div className="grid gap-2">
                        <CardTitle>Посещения на сайта</CardTitle>
                        <CardDescription>
                            Статистика за посещенията на сайта за последния месец.
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="#">
                            Виж всички
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="h-72 flex items-center justify-center">
                    <p className="text-muted-foreground">Графиката за посещения ще бъде добавена скоро.</p>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Бързи действия</CardTitle>
                    <CardDescription>
                        Най-често използвани административни функции.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button asChild>
                        <Link href="/admin/news">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Добави новина
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/calendar">
                             <CalendarIcon className="mr-2 h-4 w-4" />
                            Управлявай календар
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/admin/results">
                             <PlusCircle className="mr-2 h-4 w-4" />
                            Добави резултат
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>


      <Card>
        <CardHeader>
          <CardTitle>Последни резултати</CardTitle>
          <CardDescription>Последните няколко добавени резултата от състезания.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Състезание</TableHead>
                <TableHead>Хиподрум</TableHead>
                <TableHead>Победител</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultsData.slice(0, 5).map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.raceName}</TableCell>
                  <TableCell>{result.track}</TableCell>
                  <TableCell>{result.winner}</TableCell>
                  <TableCell>{result.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
