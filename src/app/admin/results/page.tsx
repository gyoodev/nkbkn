
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Trophy } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import type { Result } from '@/lib/types';
import { getResults } from '@/lib/data';
import Link from 'next/link';
import { DeleteResultButton } from './_components/delete-result-button';


export default async function AdminResultsPage() {
    const results: Result[] = await getResults();

    return (
        <div>
            <PageHeader
                title="Управление на резултати"
                description="Добавяйте, редактирайте и изтривайте резултати от състезания."
            />
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy className="h-6 w-6"/>Резултати</CardTitle>
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
                            {results.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell className="font-medium">{result.raceName}</TableCell>
                                    <TableCell>{format(new Date(result.date), 'PPP', { locale: bg })}</TableCell>
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
                                                <DeleteResultButton id={result.id} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
