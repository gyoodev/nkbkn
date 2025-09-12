

'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getOwners } from '@/lib/client/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import type { Owner } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, UserX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


function OwnerCardSkeleton() {
  return (
    <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-48" />
            </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-3/4" />
        </CardContent>
    </Card>
  );
}

function OwnerCard({ owner, text }: { owner: Owner, text: any }) {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={owner.image_url ?? undefined} alt={owner.name}/>
                <AvatarFallback>
                    <User className="h-8 w-8" />
                </AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="font-headline text-xl text-primary">{owner.name}</CardTitle>
                {owner.address && <CardDescription>{owner.address}</CardDescription>}
            </div>
        </CardHeader>
        <CardContent>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                {owner.email && (
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${owner.email}`} className="hover:underline">{owner.email}</a>
                    </div>
                )}
                 {owner.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{owner.phone}</span>
                    </div>
                )}
            </div>
        </CardContent>
    </Card>
  );
}


export default function OwnersPage() {
    const { text } = useLanguage();
    const [owners, setOwners] = useState<Owner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const data = await getOwners();
            setOwners(data);
            setLoading(false);
        }
        loadData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader 
                title={text.ownersPageTitle}
                description={text.ownersPageDescription}
            />
            <div className="mt-8">
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({length: 6}).map((_, i) => <OwnerCardSkeleton key={i} />)}
                    </div>
                ) : owners.length === 0 ? (
                     <Alert>
                        <UserX className="h-4 w-4" />
                        <AlertTitle>Няма добавени собственици</AlertTitle>
                        <AlertDescription>
                            В момента няма добавени профили на собственици в системата.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {owners.map((owner) => (
                            <OwnerCard key={owner.id} owner={owner} text={text} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
