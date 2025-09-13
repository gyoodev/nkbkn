
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MapPin, TrendingUp, Navigation } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';

export default function TracksPage() {
  const { text } = useLanguage();
  const address = "с. Гецово, обл. Разград";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
       <PageHeader
        title={text.tracks}
        description={text.tracksPageDescription}
      />
      <div className="mt-8 grid grid-cols-1 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-2xl text-primary">
                    <MapPin className="h-6 w-6" />
                    Хиподрум Гецово
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>{address}</p>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">Дължина на пистата:</span>
                    <span>1200 метра</span>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-5 w-5 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-700/50" />
                    </div>
                    <span className="font-semibold">Вид писта:</span>
                    <span>Пясъчна</span>
                </div>
            </CardContent>
            <CardFooter>
                 <Button asChild>
                    <Link href={googleMapsUrl} target="_blank">
                        <Navigation className="mr-2 h-4 w-4" />
                        Навигиране към хиподрума
                    </Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
