
'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRaceEvents, getHorses, getJockeys, getTrainers } from '@/lib/data';
import { Users, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { HorseIcon } from '@/components/icons/horse-icon';
import { useAuth } from '@/hooks/use-auth';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Donut, PieChart, Pie } from 'recharts';


export const dynamic = 'force-dynamic';

const salesData = [
  { name: 'Jan', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Feb', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Mar', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Apr', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'May', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Jun', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Jul', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Aug', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Sep', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Oct', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Nov', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Dec', sales: Math.floor(Math.random() * 5000) + 1000, subs: Math.floor(Math.random() * 2000) + 500 },
];

const categoryData = [
    { name: "Новини", value: 45, fill: "hsl(var(--primary))" },
    { name: "Събития", value: 28, fill: "hsl(var(--primary) / 0.8)" },
    { name: "Регистрации", value: 27, fill: "hsl(var(--primary) / 0.6)" },
]


export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [jockeysCount, setJockeysCount] = useState(0);
    const [trainersCount, setTrainersCount] = useState(0);
    const [horsesCount, setHorsesCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);


    useEffect(() => {
        const fetchCounts = async () => {
            const jockeys = await getJockeys();
            setJockeysCount(jockeys.length);
            const trainers = await getTrainers();
            setTrainersCount(trainers.length);
            const horses = await getHorses();
            setHorsesCount(horses.length);
            const events = await getRaceEvents();
            setEventsCount(events.length);
        }
        fetchCounts();
    },[])
    
    const totalCount = jockeysCount + trainersCount + horsesCount;

    const stats = [
        { title: 'Общо коне', value: horsesCount, icon: <HorseIcon className="h-6 w-6 text-muted-foreground" />, change: 12.5, changeType: 'increase' },
        { title: 'Жокеи', value: jockeysCount, icon: <Users className="h-6 w-6 text-muted-foreground" />, change: 5.2, changeType: 'increase' },
        { title: 'Треньoри', value: trainersCount, icon: <Users className="h-6 w-6 text-muted-foreground" />, change: 2.1, changeType: 'decrease' },
    ]

  return (
    <div className="flex flex-col gap-8">
       <div>
            <h1 className="text-3xl font-bold tracking-tight">Добре дошли, {user?.user_metadata.full_name || user?.email}!</h1>
            <p className="text-muted-foreground">Това е вашата статистика за днес.</p>
       </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
            <Card key={index} className={index === 0 ? 'bg-foreground text-background' : 'bg-card'}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {stat.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                     <p className="text-xs text-muted-foreground">
                        +{stat.change}% от миналата седмица
                    </p>
                </CardContent>
            </Card>
        ))}
      </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Активност</CardTitle>
                 <CardDescription>
                    Обща активност в системата за последните 12 месеца.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip
                             contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="sales" name="Посещения" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="subs" name="Регистрации" fill="hsl(var(--primary) / 0.5)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Разпределение на съдържание</CardTitle>
                 <CardDescription>
                    Разпределение на основните типове съдържание.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                         <Tooltip
                             contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Legend />
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            dataKey="value"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
    </div>
  );
}
