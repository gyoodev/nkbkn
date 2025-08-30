
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import type { Trainer } from '@/lib/types';
import { DeleteTrainerButton } from './_components/delete-trainer-button';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrainers } from '@/lib/client/data';

function TrainersTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Победи</TableHead>
                    <TableHead>Участия</TableHead>
                    <TableHead><span className="sr-only">Действия</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}


export default function AdminTrainersPage() {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const data = await getTrainers();
            setTrainers(data);
            setLoading(false);
        }
        loadData();
    }, []);

  return (
    <div>
      <PageHeader
        title="Управление на треньори"
        description="Добавяйте, редактирайте и изтривайте профили на треньори."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" />Треньори</CardTitle>
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
          {loading ? <TrainersTableSkeleton /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Победи</TableHead>
                    <TableHead>Участия</TableHead>
                    <TableHead>
                    <span className="sr-only">Действия</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {trainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                    <TableCell className="font-medium">{trainer.name}</TableCell>
                    <TableCell>{trainer.stats.wins}</TableCell>
                    <TableCell>{trainer.stats.mounts}</TableCell>
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
                            <DeleteTrainerButton id={trainer.id} />
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
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
