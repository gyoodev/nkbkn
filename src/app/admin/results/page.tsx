
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import type { Result } from '@/lib/types';
import { getResults } from '@/lib/data';
import Link from 'next/link';
import { deleteResult } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

function DeleteButton({ id }: { id: number }) {
    const deleteWithId = deleteResult.bind(null, id);
    return (
        <form action={deleteWithId}>
            <button className='w-full text-left'>
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    Изтрий
                </DropdownMenuItem>
            </button>
        </form>
    );
}


export default function AdminResultsPage() {
    const { language } = useLanguage();
    const locale = language === 'bg' ? bg : enUS;
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            const data = await getResults();
            setResults(data);
            setLoading(false);
        };
        fetchResults();
    }, []);

    return (
        <div>
            <PageHeader
                title="Управление на резултати"
                description="Добавяйте, редактирайте и изтривайте резултати от състезания."
            />
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Резултати</CardTitle>
                    <CardDescription>
                        Списък с всички въведени резултати от състезания.
                    </CardDescription>
                    <div className="flex justify-end">
                        <Button asChild>
                            <Link href="/admin/results/new">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Добави резултат
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Състезание</TableHead>
                                <TableHead>Дата</TableHead>
                                <TableHead>Победител</TableHead>
                                <TableHead>Жокей</TableHead>
                                <TableHead>
                                <span className="sr-only">Действия</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loading ? (
                             Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            results.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium">{result.raceName}</TableCell>
                                    <TableCell>{format(new Date(result.date), 'PPP', { locale })}</TableCell>
                                    <TableCell>{result.winner}</TableCell>
                                    <TableCell>{result.jockey}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                                >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/results/${result.id}/edit`}>Редактирай</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DeleteButton id={result.id} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
