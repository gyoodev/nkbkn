
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { getJockeys } from '@/lib/data';
import type { Jockey } from '@/lib/types';
import { DeleteJockeyButton } from './_components/delete-jockey-button';


export default async function AdminJockeysPage() {
    const jockeys: Jockey[] = await getJockeys();

  return (
    <div>
      <PageHeader
        title="Управление на жокеи"
        description="Добавяйте, редактирайте и изтривайте профили на жокеи."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" />Жокеи</CardTitle>
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
                <TableHead>Участия</TableHead>
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
                  <TableCell>{jockey.wins}</TableCell>
                  <TableCell>{jockey.mounts}</TableCell>
                  <TableCell>{jockey.winRate}</TableCell>
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
                        <DeleteJockeyButton id={jockey.id} />
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

