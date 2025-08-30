
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJockeys } from '@/lib/client/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import type { Jockey } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

export const dynamic = 'force-dynamic';

function JockeyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

function JockeyCard({ jockey, text }: { jockey: Jockey, text: any }) {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full bg-secondary">
          {jockey.imageUrl ? (
            <Image
                src={jockey.imageUrl}
                alt={jockey.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                data-ai-hint="portrait person"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
                <User className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="font-headline text-xl text-primary">{jockey.name}</CardTitle>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p><strong>{text.wins}:</strong> {jockey.wins}</p>
          <p><strong>{text.mounts}:</strong> {jockey.mounts}</p>
          <p><strong>{text.winRate}:</strong> {jockey.winRate}</p>
        </div>
      </CardContent>
    </Card>
  );
}


export default function JockeysPage() {
    const { text } = useLanguage();
    const [jockeys, setJockeys] = useState<Jockey[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadJockeys() {
            setLoading(true);
            const data = await getJockeys();
            setJockeys(data);
            setLoading(false);
        }
        loadJockeys();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader 
                title={text.jockeysPageTitle}
                description={text.jockeysPageDescription}
            />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    Array.from({length: 8}).map((_, i) => <JockeyCardSkeleton key={i} />)
                ) : (
                    jockeys.map((jockey) => (
                        <JockeyCard key={jockey.id} jockey={jockey} text={text} />
                    ))
                )}
            </div>
        </div>
    );
}
