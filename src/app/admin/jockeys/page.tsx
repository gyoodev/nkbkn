'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { jockeys } from '@/lib/data';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function AdminJockeysPage() {
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
            <Button>Добави нов жокей</Button>
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
              {jockeys.map((jockey) => (
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
