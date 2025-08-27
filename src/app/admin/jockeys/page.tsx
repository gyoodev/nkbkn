'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { deleteJockey } from './actions';
import { getJockeys } from '@/lib/data';
import type { Jockey } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function DeleteButton({ id }: { id: number }) {
    const deleteWithId = deleteJockey.bind(null, id);
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

export default function AdminJockeysPage() {
    const [jockeys, setJockeys] = useState<Jockey[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJockeys = async () => {
            setLoading(true);
            const data = await getJockeys();
            setJockeys(data);
            setLoading(false);
        };
        fetchJockeys();
    }, []);

  return (
    <div>
      <PageHeader
        title="Управление на жокеи"
        description="Добавяйте, редактирайте и изтривайте профили на жокеи."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Жокеи</CardTitle>
          <CardDescription>
            Списък с всички жокеи.
          </CardDescription>
          <div className="flex justify-end">
             <Button asChild>
                <Link href="/admin/jockeys/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добави нов жокей
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
                <TableHead>Победи</TableHead>
                <TableHead>Язди</TableHead>
                <TableHead>% Победи</TableHead>
                <TableHead>
                  <span className="sr-only">Действия</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                ))
              ) : (
                jockeys.map((jockey) => (
                    <TableRow key={jockey.id}>
                    <TableCell className="font-medium">{jockey.name}</TableCell>
                    <TableCell>{jockey.stats.wins}</TableCell>
                    <TableCell>{jockey.stats.mounts}</TableCell>
                    <TableCell>{jockey.stats.winRate}</TableCell>
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
                                <Link href={`/admin/jockeys/${jockey.id}/edit`}>Редактирай</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DeleteButton id={jockey.id} />
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
