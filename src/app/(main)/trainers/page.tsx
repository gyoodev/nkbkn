
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getTrainers } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import type { Trainer } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

export const dynamic = 'force-dynamic';

function TrainerCard({ trainer, text }: { trainer: Trainer; text: any }) {
    return (
        <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
            <div className="relative h-56 w-full bg-secondary">
                {trainer.image_url ? (
                    <Image
                        src={trainer.image_url}
                        alt={trainer.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                        data-ai-hint="portrait person"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-6">
                <CardHeader className="p-0">
                     <CardTitle className="font-headline text-xl text-primary">{trainer.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 pt-4">
                    <div className="space-y-4">
                        <div>
                             <h4 className="font-semibold text-sm mb-2">{text.achievements}:</h4>
                            <div className="flex flex-wrap gap-1">
                            {trainer.achievements.map((ach, index) => <Badge variant="secondary" key={index}>{ach}</Badge>)}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Статистика:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <p><strong>{text.wins}:</strong> {trainer.stats.wins}</p>
                                <p><strong>{text.mounts}:</strong> {trainer.stats.mounts}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}

function TrainerCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col">
             <div className="relative h-56 w-full">
                <Skeleton className="h-full w-full" />
            </div>
             <div className="flex flex-col p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex flex-wrap gap-1">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                     <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        </Card>
    );
}


export default function TrainersPage() {
  const { text } = useLanguage();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainers() {
        setLoading(true);
        const fetchedTrainers = await getTrainers();
        setTrainers(fetchedTrainers);
        setLoading(false);
    }
    loadTrainers();
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.trainersPageTitle}
        description={text.trainersPageDescription}
      />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
             Array.from({length: 3}).map((_, i) => <TrainerCardSkeleton key={i} />)
        ) : (
            trainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} text={text} />
            ))
        )}
      </div>
    </div>
  );
}
