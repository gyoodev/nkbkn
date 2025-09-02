
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import type { Owner } from '@/lib/types';
import { DeleteOwnerButton } from './_components/delete-owner-button';
import { Skeleton } from '@/components/ui/skeleton';
import { getOwners } from '@/lib/client/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function OwnersTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Имейл</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Дата на добавяне</TableHead>
                    <TableHead><span className="sr-only">Действия</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function AdminOwnersPage() {
    const [owners, setOwners] = useState<Owner[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        setLoading(true);
        const data = await getOwners();
        setOwners(data);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('bg-BG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

  return (
    <div>
      <PageHeader
        title="Управление на собственици"
        description="Добавяйте, редактирайте и изтривайте профили на собственици."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" />Собственици</CardTitle>
          <CardDescription>
            Списък с всички регистрирани собственици.
          </CardDescription>
          <div className="flex justify-end">
             <Button asChild>
                <Link href="/admin/owners/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добави нов собственик
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            {loading ? <OwnersTableSkeleton /> : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Име</TableHead>
                        <TableHead>Имейл</TableHead>
                        <TableHead>Телефон</TableHead>
                        <TableHead>Дата на добавяне</TableHead>
                        <TableHead>
                        <span className="sr-only">Действия</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {owners.map((owner) => (
                        <TableRow key={owner.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                             <Avatar>
                                <AvatarImage src={owner.image_url ?? undefined} alt={owner.name}/>
                                <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {owner.name}
                        </TableCell>
                        <TableCell>{owner.email || '-'}</TableCell>
                        <TableCell>{owner.phone || '-'}</TableCell>
                        <TableCell>{formatDate(owner.created_at)}</TableCell>
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
                                    <Link href={`/admin/owners/${owner.id}/edit`}>Редактирай</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DeleteOwnerButton id={owner.id} onDeleted={loadData} />
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
