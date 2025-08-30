'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getDashboardStats, getMonthlyActivityStats } from '@/lib/client/data';
import { Users, BarChart } from 'lucide-react';
import { HorseIcon } from '@/components/icons/horse-icon';
import { useAuth } from '@/hooks/use-auth';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

type Stats = {
    horses: number;
    jockeys: number;
    trainers: number;
    news: number;
    events: number;
};

function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <Skeleton className="h-9 w-1/2 mb-2" />
                <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-5 w-20" /></CardHeader><CardContent><Skeleton className="h-8 w-10" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-20" /></CardHeader><CardContent><Skeleton className="h-8 w-10" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-20" /></CardHeader><CardContent><Skeleton className="h-8 w-10" /></CardContent></Card>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="h-80">
                        <Skeleton className="h-full w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


function DashboardContent({ stats, activityData }: { stats: Stats, activityData: any[] }) {
    const { user } = useAuth();
    
    const summaryStats = [
        { title: 'Общо коне', value: stats.horses, icon: <HorseIcon className="h-6 w-6 text-muted-foreground" /> },
        { title: 'Жокеи', value: stats.jockeys, icon: <Users className="h-6 w-6 text-muted-foreground" /> },
        { title: 'Треньoри', value: stats.trainers, icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    ];

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
            <div className="grid grid-cols-1 gap-4">
                <Card>
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
                                <Bar dataKey="comments" name="Коментари" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="likes" name="Харесвания" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="submissions" name="Заявки" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activityData, setActivityData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            try {
                const [dashboardStats, monthlyActivity] = await Promise.all([
                    getDashboardStats(),
                    getMonthlyActivityStats()
                ]);
                setStats(dashboardStats);
                setActivityData(monthlyActivity);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCounts();
    }, []);

    if (loading || !stats || !activityData) {
        return <DashboardSkeleton />;
    }

    return <DashboardContent stats={stats} activityData={activityData} />;
}
