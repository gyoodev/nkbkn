'use client';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/client/data';
import type { Stats } from '@/lib/types';
import { DashboardSkeleton } from './_components/dashboard-skeleton';
import { DashboardContent } from './_components/dashboard-content';


export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchCounts();
    }, []);

    if (loading || !stats) {
        return <DashboardSkeleton />;
    }

    return <DashboardContent stats={stats} />;
}
