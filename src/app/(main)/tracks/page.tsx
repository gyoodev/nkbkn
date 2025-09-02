
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import Image from 'next/image';
import { MapPin, TrendingUp } from 'lucide-react';
import type { Track } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getTracks } from '@/lib/client/data';
import { Skeleton } from '@/components/ui/skeleton';

function TrackPageSkeleton() {
    return (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-1/4 mb-4" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
            <Skeleton className="h-96 w-full min-h-[300px] md:h-auto rounded-lg" />
        </div>
    );
}

export default function TracksPage() {
  const { text } = useLanguage();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTracks() {
      setLoading(true);
      const data = await getTracks();
      setTracks(data);
      setLoading(false);
    }
    loadTracks();
  }, []);

  if (loading) {
      return (
          <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <PageHeader
                title={text.tracksPageTitle}
                description="Информация за хиподрумите в България."
              />
              <TrackPageSkeleton />
          </div>
      )
  }

  if (tracks.length === 0) {
      return (
           <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <PageHeader
                title={text.tracksPageTitle}
                description="Информация за хиподрумите в България."
              />
              <p className="mt-8 text-center text-muted-foreground">В момента няма добавени хиподруми в системата.</p>
          </div>
      )
  }
  
  // Currently we only show the first track. This can be extended to show all of them.
  const track = tracks[0];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.tracksPageTitle}
        description="Информация за хиподрумите в България."
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
                 <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Дължина на пистата:</span>
                    <span>{track.track_length} метра</span>
                </div>
                <p className="text-base text-muted-foreground">{track.description}</p>
            </CardContent>
        </Card>
         <div className="relative h-96 w-full min-h-[300px] md:h-auto">
          <Image
            src={track.image_url}
            alt={track.name}
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
