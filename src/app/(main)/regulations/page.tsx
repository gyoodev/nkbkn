import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { getDocuments } from '@/lib/data';

export default async function RegulationsPage() {

  const allDocuments = await getDocuments();
  const documents = allDocuments.filter(doc => doc.type === 'Правилник');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Правилници"
        description="Всички официални правилници и разпоредби на комисията."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Официални правилници</CardTitle>
          <CardDescription>
            Тук можете да намерите и изтеглите всички актуални правилници и разпоредби.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име на документа</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Дата на публикуване</TableHead>
                <TableHead className="text-right">Изтегляне</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="default">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(doc.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                    >
                        <a href={doc.href} download target="_blank">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Изтегли</span>
                        </a>
                    </Button>
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
