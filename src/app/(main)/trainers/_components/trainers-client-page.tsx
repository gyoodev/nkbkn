

'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import type { Trainer } from '@/lib/types';
import { User, UserX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function TrainerCard({ trainer, text }: { trainer: Trainer; text: any }) {
    const imageUrl = trainer.image_url || 'https://static.vecteezy.com/system/resources/thumbnails/028/087/760/small/user-avatar-icon-doodle-style-png.png';
    return (
       <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={imageUrl} alt={trainer.name}/>
                    <AvatarFallback>
                        <User className="h-8 w-8" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline text-xl text-primary">{trainer.name}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <p><strong>{text.wins}:</strong> {trainer.wins}</p>
                            <p><strong>{text.mounts}:</strong> {trainer.mounts}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
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
