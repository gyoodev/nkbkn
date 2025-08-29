
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Building } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { getPartners } from '@/lib/data';
import Link from 'next/link';
import type { Partner } from '@/lib/types';
import Image from 'next/image';
import { DeletePartnerButton } from './_components/delete-partner-button';


export default async function AdminPartnersPage() {
    const partners: Partner[] = await getPartners();

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
        title="Управление на партньори"
        description="Добавяйте, редактирайте и изтривайте партньори."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building className="h-6 w-6" />Партньори</CardTitle>
          <CardDescription>
            Списък с всички партньори.
          </CardDescription>
          <div className="flex justify-end">
             <Button asChild>
                <Link href="/admin/partners/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добави нов партньор
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Лого</TableHead>
                <TableHead>Име</TableHead>
                <TableHead>Дата на добавяне</TableHead>
                <TableHead>
                  <span className="sr-only">Действия</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <Image src={partner.logo_url} alt={partner.name} width={80} height={40} className="object-contain h-10" />
                  </TableCell>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{formatDate(partner.created_at)}</TableCell>
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
                            <Link href={`/admin/partners/${partner.id}/edit`}>Редактирай</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeletePartnerButton id={partner.id} />
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
