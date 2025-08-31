'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, FileText, PlusCircle, Mail, CalendarPlus, Activity } from 'lucide-react';
import { HorseIcon } from '@/components/icons/horse-icon';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import type { Stats } from '@/lib/types';


export function DashboardContent({ stats }: { stats: Stats }) {
    const { user } = useAuth();
    
    const summaryStats = [
        { title: 'Общо коне', value: stats.horses, icon: <HorseIcon className="h-6 w-6 text-muted-foreground" /> },
        { title: 'Жокеи', value: stats.jockeys, icon: <Users className="h-6 w-6 text-muted-foreground" /> },
        { title: 'Треньoри', value: stats.trainers, icon: <Users className="h-6 w-6 text-muted-foreground" /> },
        { title: 'Новини', value: stats.news, icon: <FileText className="h-6 w-6 text-muted-foreground" /> },
    ];
    
     const quickTools = [
        { href: '/admin/news/new', label: 'Добави новина', icon: <PlusCircle /> },
        { href: '/admin/calendar/new', label: 'Добави събитие', icon: <CalendarPlus /> },
        { href: '/admin/horses/new', label: 'Добави кон', icon: <HorseIcon /> },
        { href: '/admin/submissions', label: 'Преглед на заявки', icon: <Mail /> },
    ]

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Добре дошли, {user?.user_metadata.full_name || user?.email}!</h1>
                <p className="text-muted-foreground">Това е вашата статистика за днес.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {summaryStats.map((stat, index) => (
                    <Card key={index} className={index === 0 ? 'bg-primary text-primary-foreground' : 'bg-card'}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground opacity-70">
                                Общо в системата
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity />
                          Бързи инструменти
                        </CardTitle>
                        <CardDescription>
                            Бърз достъп до най-често използваните функции.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {quickTools.map((tool) => (
                          <Button key={tool.href} asChild variant="outline" className="h-20 flex-col gap-2">
                            <Link href={tool.href}>
                              {tool.icon}
                              <span>{tool.label}</span>
                            </Link>
                          </Button>
                       ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
