
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { getResults } from '@/lib/data';
import type { Result } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


function ResultsTableSkeleton() {
    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Състезание</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Хиподрум</TableHead>
                <TableHead>Победител</TableHead>
                <TableHead>Жокей</TableHead>
                <TableHead className="text-right">Време</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({length: 5}).map((_, i) => (
                     <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function ResultsPage() {
  const { text, language } = useLanguage();
  const locale = language === 'bg' ? bg : enUS;
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
        setLoading(true);
        const data = await getResults();
        setResults(data);
        setLoading(false);
    }
    loadResults();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.results}
        description="Официални резултати от последните състезания."
      />
      <Card className="mt-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Последни резултати
            </CardTitle>
            <CardDescription>Прегледайте класирането от последните проведени надбягвания.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? <ResultsTableSkeleton /> : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Състезание</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Хиподрум</TableHead>
                        <TableHead>Победител</TableHead>
                        <TableHead>Жокей</TableHead>
                        <TableHead className="text-right">Време</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {results.map((result, index) => (
                        <TableRow key={index}>
                        <TableCell className="font-medium text-primary">{result.raceName}</TableCell>
                        <TableCell>{format(new Date(result.date), 'PPP', { locale })}</TableCell>
                        <TableCell>{result.track}</TableCell>
                        <TableCell>{result.winner}</TableCell>
                        <TableCell>{result.jockey}</TableCell>
                        <TableCell className="text-right font-mono">{result.time}</TableCell>
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
