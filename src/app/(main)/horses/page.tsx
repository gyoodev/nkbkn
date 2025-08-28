
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getHorses } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import type { Horse } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function HorsesTableSkeleton() {
    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име на коня</TableHead>
                <TableHead>Баща</TableHead>
                <TableHead>Майка</TableHead>
                <TableHead className="text-center">Възраст</TableHead>
                <TableHead>Собственик</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({length: 10}).map((_, i) => (
                     <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-4 w-10 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}


export default function HorsesPage() {
  const { text } = useLanguage();
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHorses() {
        setLoading(true);
        const data = await getHorses();
        setHorses(data);
        setLoading(false);
    }
    loadHorses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.horsesPageTitle}
        description={text.horsesPageDescription}
      />
      <Card className="mt-8">
        <CardContent className="p-0">
         {loading ? <HorsesTableSkeleton /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{text.horseName}</TableHead>
                    <TableHead>{text.sire}</TableHead>
                    <TableHead>{text.dam}</TableHead>
                    <TableHead className="text-center">{text.age}</TableHead>
                    <TableHead>{text.owner}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {horses.map((horse) => (
                    <TableRow key={horse.id}>
                    <TableCell className="font-medium text-primary">{horse.name}</TableCell>
                    <TableCell>{horse.sire}</TableCell>
                    <TableCell>{horse.dam}</TableCell>
                    <TableCell className="text-center">{horse.age}</TableCell>
                    <TableCell>{horse.owner}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
         )}
        </CardContent>
      </Card>
    </div>
  );
}
