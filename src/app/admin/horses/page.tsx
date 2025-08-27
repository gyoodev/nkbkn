
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { horses } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HorseIcon } from '@/components/icons/horse-icon';
import Link from 'next/link';

export default function AdminHorsesPage() {
  return (
    <div>
      <PageHeader
        title="Управление на коне"
        description="Добавяйте, редактирайте и изтривайте профили на коне."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HorseIcon className="h-6 w-6" />
            Коне
          </CardTitle>
          <CardDescription>
            Списък с всички регистрирани коне.
          </CardDescription>
          <div className="flex justify-end">
            <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" />
                Добави нов кон
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
                <TableHead>Собственик</TableHead>
                <TableHead>Възраст</TableHead>
                <TableHead>
                  <span className="sr-only">Действия</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horses.map((horse) => (
                <TableRow key={horse.id}>
                  <TableCell className="font-medium">{horse.name}</TableCell>
                  <TableCell>{horse.owner}</TableCell>
                  <TableCell>{horse.age}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                          disabled
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem disabled>Редактирай</DropdownMenuItem>
                        <DropdownMenuItem disabled>Изтрий</DropdownMenuItem>
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
