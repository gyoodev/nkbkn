
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function FormsPage() {
    const { text } = useLanguage();

  const documents = [
    { id: 2, name: 'Формуляр за регистрация на кон', type: 'Формуляр', date: '2023-11-20', href: '#' },
    { id: 3, name: 'Формуляр за заявка за участие', type: 'Формуляр', date: '2023-11-20', href: '#' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.forms}
        description="Всички официални формуляри, необходими за регистрация и участие."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Формуляри</CardTitle>
          <CardDescription>
            Тук можете да намерите и изтеглите всички актуални формуляри.
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
                    <Badge variant="secondary">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                    >
                        <a href={doc.href} download>
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
