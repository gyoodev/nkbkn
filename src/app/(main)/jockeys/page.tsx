'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { jockeys } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';

export default function JockeysPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader 
        title={text.jockeysPageTitle}
        description={text.jockeysPageDescription}
      />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {jockeys.map((jockey) => (
          <Card key={jockey.id} className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="p-0">
              <div className="relative h-64 w-full">
                <Image
                  src={jockey.imageUrl}
                  alt={jockey.name}
                  fill
                  className="object-cover"
                  data-ai-hint="portrait person"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="font-headline text-xl text-primary">{jockey.name}</CardTitle>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p><strong>Wins:</strong> {jockey.stats.wins}</p>
                <p><strong>Mounts:</strong> {jockey.stats.mounts}</p>
                <p><strong>Win Rate:</strong> {jockey.stats.winRate}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
