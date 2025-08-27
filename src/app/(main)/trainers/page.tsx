'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { trainers } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';

export default function TrainersPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.trainersPageTitle}
        description={text.trainersPageDescription}
      />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {trainers.map((trainer) => (
          <Card key={trainer.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col sm:flex-row">
            <div className="relative h-48 sm:h-auto sm:w-1/3 flex-shrink-0">
              <Image
                src={trainer.imageUrl}
                alt={trainer.name}
                fill
                className="object-cover"
                data-ai-hint="portrait person"
              />
            </div>
            <div className="flex flex-col p-6">
              <CardTitle className="font-headline text-xl text-primary">{trainer.name}</CardTitle>
              <CardDescription className="mt-2 text-sm">
                <strong>Achievements:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {trainer.achievements.map((ach, index) => <Badge variant="secondary" key={index}>{ach}</Badge>)}
                </div>
              </CardDescription>
              <CardDescription className="mt-4 text-sm">
                <strong>Associated Horses:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                    {trainer.associatedHorses.join(', ')}
                </div>
              </CardDescription>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
