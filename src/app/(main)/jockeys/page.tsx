
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getJockeys } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';

// This is a server component now, so we can't use the hook directly.
// We'll pass the text object to a client component or handle it differently.
// For now, we'll assume a default language or pass it down.
// Let's create a client component to handle the language-specific text.

function JockeyCard({ jockey, text }: { jockey: any, text: any }) {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={jockey.imageUrl}
            alt={jockey.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            data-ai-hint="portrait person"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="font-headline text-xl text-primary">{jockey.name}</CardTitle>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p><strong>{text.wins}:</strong> {jockey.stats.wins}</p>
          <p><strong>{text.mounts}:</strong> {jockey.stats.mounts}</p>
          <p><strong>{text.winRate}:</strong> {jockey.stats.winRate}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function JockeysPageClient({ jockeys, text }: { jockeys: any[], text: any }) {
    return (
        <>
            <PageHeader 
                title={text.jockeysPageTitle}
                description={text.jockeysPageDescription}
            />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {jockeys.map((jockey) => (
                    <JockeyCard key={jockey.id} jockey={jockey} text={text} />
                ))}
            </div>
        </>
    );
}

// Dummy component to use the hook
function PageWrapper({jockeys}: {jockeys: any[]}) {
    'use client';
    const { text } = useLanguage();
    return <JockeysPageClient jockeys={jockeys} text={text} />
}


export default async function JockeysPage() {
    const jockeys = await getJockeys();
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <PageWrapper jockeys={jockeys} />
    </div>
  );
}
