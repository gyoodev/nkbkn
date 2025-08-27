'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { tracks } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { MapPin } from 'lucide-react';

export default function TracksPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.tracksPageTitle}
        description={text.tracksPageDescription}
      />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card className="overflow-hidden">
                <div className="relative h-96 w-full lg:h-[600px]">
                    <Image
                        src="https://picsum.photos/1200/800?random=map"
                        alt="Map of Bulgaria"
                        fill
                        className="object-cover"
                        data-ai-hint="map Bulgaria"
                    />
                    <div className="absolute inset-0 bg-primary/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="rounded-md bg-background/80 px-4 py-2 text-lg font-semibold text-foreground backdrop-blur-sm">
                          {text.language === 'bg' ? 'Интерактивна карта - скоро' : 'Interactive Map - Coming Soon'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
        <div className="space-y-6 lg:col-span-1">
          {tracks.map((track) => (
            <Card key={track.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-primary">
                  <MapPin className="h-5 w-5" />
                  {track.name}
                </CardTitle>
                <CardDescription>{track.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{track.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
