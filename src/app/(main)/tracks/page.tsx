
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { tracks } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { MapPin } from 'lucide-react';

export default function TracksPage() {
  const { text } = useLanguage();
  const track = tracks[0]; // We only have one track now

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.tracksPageTitle}
        description="Информация за бъдещия хиподрум в България."
      />
      <div className="mt-8 flex justify-center">
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
  );
}
