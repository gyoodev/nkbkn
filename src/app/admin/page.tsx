
'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getDashboardStats, getMonthlyActivityStats } from '@/lib/client/data';
import { Users, BarChart } from 'lucide-react';
import { HorseIcon } from '@/components/icons/horse-icon';
import { useAuth } from '@/hooks/use-auth';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';


export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        horses: 0,
        jockeys: 0,
        trainers: 0,
        news: 0,
        events: 0,
    });
    const [activityData, setActivityData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            const [dashboardStats, monthlyActivity] = await Promise.all([
                getDashboardStats(),
                getMonthlyActivityStats()
            ]);
            setStats(dashboardStats);
            setActivityData(monthlyActivity);
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
                <CardTitle>Месечна активност</CardTitle>
                 <CardDescription>
                    Активност в системата за последните 12 месеца.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                             contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                             cursor={{ fill: 'hsl(var(--accent))', radius: 4 }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="registrations" name="Регистрации" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="comments" name="Коментари" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="likes" name="Харесвания" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="submissions" name="Заявки" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
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
