
'use client';

import { useEffect, useState } from 'react';
import { getNewsPosts } from '@/lib/client/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DeleteButton } from './_components/delete-button';
import type { NewsPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function NewsTableSkeleton() {
    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заглавие</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead><span className="sr-only">Действия</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({length: 5}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function AdminNewsPage() {
    const [newsPosts, setNewsPosts] = useState<Omit<NewsPost, 'comments' | 'content'>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const data = await getNewsPosts();
            setNewsPosts(data);
            setLoading(false);
        }
        loadData();
    }, []);

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
        title="Управление на новини"
        description="Добавяйте, редактирайте и изтривайте новинарски публикации."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Новини</CardTitle>
          <CardDescription>
            Списък с всички новинарски публикации.
          </CardDescription>
          <div className="flex justify-end">
             <Button asChild>
                <Link href="/admin/news/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добави нова публикация
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <NewsTableSkeleton /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Заглавие</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>
                    <span className="sr-only">Действия</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {newsPosts.map((post) => (
                    <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                        <Badge variant="secondary">{post.category}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(post.date)}</TableCell>
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
                            <Link href={`/admin/news/${post.id}/edit`}>Редактирай</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DeleteButton id={post.id} />
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
