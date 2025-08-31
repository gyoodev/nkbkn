
'use client';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/client/data';
import type { Stats } from '@/lib/types';
import { DashboardSkeleton } from './_components/dashboard-skeleton';
import { DashboardContent } from './_components/dashboard-content';
import { createBrowserClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';


export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createBrowserClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        const fetchCounts = async () => {
            setLoading(true);
            try {
                const dashboardStats = await getDashboardStats();
                setStats(dashboardStats);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchUser();
        fetchCounts();
    }, []);

    if (loading || !stats) {
        return <DashboardSkeleton />;
    }

    return <DashboardContent stats={stats} user={user} />;
}
