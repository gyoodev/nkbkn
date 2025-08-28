
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { tracks } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { MapPin } from 'lucide-react';

export default function TracksPage() {
  const { text } = useLanguage();
  const track = tracks[0]; // We only have one track now

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.tracksPageTitle}
        description="Информация за бъдещия хиподрум в България."
      />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative h-96 w-full min-h-[400px] md:h-auto">
            <Image
                src="https://archigeya-s.com/wp-content/uploads/2016/02/c4-1.jpg"
                alt="Проект за хиподрум"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint="hippodrome project"
            />
             <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
                <p className="rounded-md bg-background/80 px-4 py-2 text-lg font-semibold text-foreground backdrop-blur-sm">
                  Визуализация на проекта - скоро
                </p>
            </div>
        </div>
        <div className="flex items-center">
             <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                    <MapPin className="h-6 w-6" />
                    {track.name}
                    </CardTitle>
                    <CardDescription className="pt-2 text-lg">{track.location}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-base text-muted-foreground">{track.description}</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
