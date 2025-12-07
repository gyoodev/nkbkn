
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import type { Trainer } from '@/lib/types';
import { User, UserX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function TrainerCard({ trainer, text }: { trainer: Trainer; text: any }) {
    const imageUrl = trainer.image_url || 'https://static.vecteezy.com/system/resources/thumbnails/028/087/760/small/user-avatar-icon-doodle-style-png.png';
    return (
        <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col">
            <div className="relative h-56 w-full bg-secondary">
                <Image
                    src={imageUrl}
                    alt={trainer.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                    data-ai-hint="portrait person"
                />
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

export function TrainersClientPage({ trainers }: { trainers: Trainer[] }) {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.trainersPageTitle}
        description={text.trainersPageDescription}
      />
      <div className="mt-8">
        {trainers.length === 0 ? (
            <Alert>
                <UserX className="h-4 w-4" />
                <AlertTitle>Няма добавени треньори</AlertTitle>
                <AlertDescription>
                    В момента няма добавени профили на треньори в системата.
                </AlertDescription>
            </Alert>
        ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {trainers.map((trainer) => (
                    <TrainerCard key={trainer.id} trainer={trainer} text={text} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
