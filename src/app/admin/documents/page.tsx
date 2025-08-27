import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { getDocuments } from '@/lib/data';
import Link from 'next/link';
import { deleteDocument } from './actions';

function DeleteButton({ id }: { id: number }) {
  const deleteWithId = deleteDocument.bind(null, id);
  return (
      <form action={deleteWithId}>
          <button className='w-full text-left'>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                  Изтрий
              </DropdownMenuItem>
          </button>
      </form>
  );
}


export default async function AdminDocumentsPage() {
  const documents = await getDocuments();

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
                           <a href={doc.href} target="_blank" download>Изтегли</a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteButton id={doc.id} />
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
