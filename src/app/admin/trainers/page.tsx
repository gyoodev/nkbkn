'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { deleteTrainer } from './actions';
import { getTrainers } from '@/lib/data';
import type { Trainer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function DeleteButton({ id }: { id: number }) {
    const deleteWithId = deleteTrainer.bind(null, id);
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

export default function AdminTrainersPage() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainers = async () => {
            setLoading(true);
            const data = await getTrainers();
            setTrainers(data);
            setLoading(false);
        };
        fetchTrainers();
    }, []);

  return (
    <div>
      <PageHeader
        title="Управление на треньори"
        description="Добавяйте, редактирайте и изтривайте профили на треньори."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Треньори</CardTitle>
          <CardDescription>
            Списък с всички треньори.
          </CardDescription>
          <div className="flex justify-end">
             <Button asChild>
                <Link href="/admin/trainers/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добави нов треньор
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
                <TableHead>Постижения</TableHead>
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
                        <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                ))
              ) : (
                trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                    <TableCell className="font-medium">{trainer.name}</TableCell>
                    <TableCell>{trainer.achievements.join(', ')}</TableCell>
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
                                <Link href={`/admin/trainers/${trainer.id}/edit`}>Редактирай</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DeleteButton id={trainer.id} />
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
