'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <Skeleton className="h-9 w-1/2 mb-2" />
                <Skeleton className="h-5 w-3/4" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader><Skeleton className="h-5 w-20" /></CardHeader><CardContent><Skeleton className="h-8 w-10" /></CardContent></Card>
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
                    <CardContent className="h-40">
                        <Skeleton className="h-full w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
