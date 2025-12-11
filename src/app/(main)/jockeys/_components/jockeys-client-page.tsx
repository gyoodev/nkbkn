
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import type { Jockey } from '@/lib/types';
import { User, UserX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function JockeyCard({ jockey, text }: { jockey: Jockey, text: any }) {
  const imageUrl = jockey.imageUrl || 'https://static.vecteezy.com/system/resources/thumbnails/028/087/760/small/user-avatar-icon-doodle-style-png.png';
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={imageUrl} alt={jockey.name}/>
                <AvatarFallback>
                    <User className="h-8 w-8" />
                </AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="font-headline text-xl text-primary">{jockey.name}</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p><strong>{text.wins}:</strong> {jockey.wins}</p>
                <p><strong>{text.mounts}:</strong> {jockey.mounts}</p>
                <p><strong>{text.winRate}:</strong> {jockey.winRate}</p>
            </div>
        </CardContent>
    </Card>
  );
}

export function JockeysClientPage({ jockeys }: { jockeys: Jockey[] }) {
    const { text } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader 
                title={text.jockeysPageTitle}
                description={text.jockeysPageDescription}
            />
            <div className="mt-8">
                {jockeys.length === 0 ? (
                    <Alert>
                        <UserX className="h-4 w-4" />
                        <AlertTitle>Няма добавени жокеи</AlertTitle>
                        <AlertDescription>
                            В момента няма добавени профили на жокеи в системата.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {jockeys.map((jockey) => (
                            <JockeyCard key={jockey.id} jockey={jockey} text={text} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
