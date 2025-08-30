
'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getJockeys, getTrainers, getHorses, getDashboardStats } from '@/lib/data';
import { Users } from 'lucide-react';
import { HorseIcon } from '@/components/icons/horse-icon';
import { useAuth } from '@/hooks/use-auth';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';


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

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        horses: 0,
        jockeys: 0,
        trainers: 0,
        news: 0,
        events: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
            setLoading(false);
        }
        fetchCounts();
    },[]);

    const summaryStats = [
        { title: 'Общо коне', value: stats.horses, icon: <HorseIcon className="h-6 w-6 text-muted-foreground" /> },
        { title: 'Жокеи', value: stats.jockeys, icon: <Users className="h-6 w-6 text-muted-foreground" /> },
        { title: 'Треньoри', value: stats.trainers, icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    ];
    
    const categoryData = [
        { name: "Новини", value: stats.news, fill: "hsl(var(--primary))" },
        { name: "Събития", value: stats.events, fill: "hsl(var(--primary) / 0.8)" },
        { name: "Коне", value: stats.horses, fill: "hsl(var(--primary) / 0.6)" },
        { name: "Жокеи", value: stats.jockeys, fill: "hsl(var(--primary) / 0.4)" },
        { name: "Треньoри", value: stats.trainers, fill: "hsl(var(--primary) / 0.2)" },
    ].filter(item => item.value > 0);


  return (
    <div className="flex flex-col gap-8">
       <div>
            <h1 className="text-3xl font-bold tracking-tight">Добре дошли, {user?.user_metadata.full_name || user?.email}!</h1>
            <p className="text-muted-foreground">Това е вашата статистика за днес.</p>
       </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {summaryStats.map((stat, index) => (
            <Card key={index} className={index === 0 ? 'bg-foreground text-background' : 'bg-card'}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {stat.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                     <p className="text-xs text-muted-foreground">
                        Общо в системата
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
                    Обща активност в системата за последните 12 месеца. (демо)
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
                            label={({ percent, name, value }) => `${name}: ${(percent * 100).toFixed(0)}% (${value})`}
                            outerRadius={80}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
    </div>
  );
}
