
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { getDocuments } from '@/lib/client/data';
import Link from 'next/link';
import { DeleteButton } from './_components/delete-button';
import type { Document } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


function DocumentsSkeleton() {
    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име на документа</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Дата на качване</TableHead>
                <TableHead>
                  <span className="sr-only">Действия</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({length: 5}).map((_, i) => (
                     <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const data = await getDocuments();
    setDocuments(data);
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
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  return (
    <div>
      <PageHeader
        title="Управление на документи"
        description="Качвайте и управлявайте правилници и формуляри."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Документи</CardTitle>
          <CardDescription>
            Списък с всички качени правилници и формуляри.
          </CardDescription>
           <div className="flex justify-end">
             <Button asChild>
                <Link href="/admin/documents/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Качи нов документ
                </Link>
            </Button>
           </div>
        </CardHeader>
        <CardContent>
          {loading ? <DocumentsSkeleton /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Име на документа</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Дата на качване</TableHead>
                  <TableHead>
                    <span className="sr-only">Действия</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>
                      <Badge variant={doc.type === 'Правилник' ? 'default' : 'secondary'}>{doc.type}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(doc.created_at)}</TableCell>
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
                            <a href={doc.href} target="_blank" download className="flex items-center">
                                <Download className="mr-2 h-4 w-4" />
                                Изтегли
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DeleteButton id={doc.id} onDeleted={loadData} />
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
