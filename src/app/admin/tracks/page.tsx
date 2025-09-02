
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, MapPin } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import type { Track } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getTracks } from '@/lib/client/data';
import { DeleteTrackButton } from './_components/delete-button';

function TracksTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Местоположение</TableHead>
                    <TableHead><span className="sr-only">Действия</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function AdminTracksPage() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadData() {
        setLoading(true);
        const data = await getTracks();
        setTracks(data);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
    }, [])

  return (
    <div>
      <PageHeader
        title="Управление на хиподруми"
        description="Добавяйте, редактирайте и изтривайте хиподруми."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-6 w-6" />Хиподруми</CardTitle>
          <CardDescription>
            Списък с всички хиподруми в системата.
          </CardDescription>
          <div className="flex justify-end">
             <Button asChild>
                <Link href="/admin/tracks/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добави нов хиподрум
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            {loading ? <TracksTableSkeleton /> : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Име</TableHead>
                        <TableHead>Местоположение</TableHead>
                        <TableHead>
                        <span className="sr-only">Действия</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {tracks.map((track) => (
                        <TableRow key={track.id}>
                        <TableCell className="font-medium">{track.name}</TableCell>
                        <TableCell>{track.location}</TableCell>
                        <TableCell className="text-right">
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
                                    <Link href={`/admin/tracks/${track.id}/edit`}>Редактирай</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DeleteTrackButton id={track.id} onDeleted={loadData} />
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
