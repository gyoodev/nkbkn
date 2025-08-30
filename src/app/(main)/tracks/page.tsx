
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { tracks } from '@/lib/client/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import Image from 'next/image';
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
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
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
         <div className="relative h-96 w-full min-h-[300px] md:h-auto">
          <Image
            src="https://archigeya-s.com/wp-content/uploads/2021/04/%D0%A5%D0%B8%D0%BF%D0%BE%D0%B4%D1%80%D1%83%D0%BC-%D1%81.%D0%93%D0%B5%D1%86%D0%BE%D0%B2%D0%BE-10.jpg"
            alt="Хиподрум Гецово"
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-ai-hint="horse track"
          />
        </div>
      </div>
    </div>
  );
}
