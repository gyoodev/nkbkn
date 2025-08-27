'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function AdminDocumentsPage() {
  const documents = [
    { id: 1, name: 'Правилник за конни надбягвания 2024', type: 'Правилник', date: '2024-01-15' },
    { id: 2, name: 'Формуляр за регистрация на кон', type: 'Формуляр', date: '2023-11-20' },
    { id: 3, name: 'Формуляр за заявка за участие', type: 'Формуляр', date: '2023-11-20' },
  ];

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
        </CardHeader>
        <CardContent>
           <div className="flex justify-end mb-4">
             <Button>Качи нов документ</Button>
           </div>
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
                  <TableCell>{doc.date}</TableCell>
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
                        <DropdownMenuItem>Редактирай</DropdownMenuItem>
                        <DropdownMenuItem>Изтрий</DropdownMenuItem>
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
