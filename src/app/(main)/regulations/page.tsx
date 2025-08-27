
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function RegulationsPage() {
    const { text } = useLanguage();

  const documents = [
    { id: 1, name: 'Правилник за конни надбягвания 2024', type: 'Правилник', date: '2024-01-15', href: '#' },
    { id: 2, name: 'Формуляр за регистрация на кон', type: 'Формуляр', date: '2023-11-20', href: '#' },
    { id: 3, name: 'Формуляр за заявка за участие', type: 'Формуляр', date: '2023-11-20', href: '#' },
    { id: 4, name: 'Етичен кодекс на НКБКН', type: 'Правилник', date: '2023-09-01', href: '#' },
    { id: 5, name: 'Антидопингови правила', type: 'Правилник', date: '2024-02-01', href: '#' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.regulations}
        description="Всички официални правилници, разпоредби и формуляри на комисията."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Официални документи</CardTitle>
          <CardDescription>
            Тук можете да намерите и изтеглите всички актуални правилници и формуляри, необходими за участие в състезанията.
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
                    <Badge variant={doc.type === 'Правилник' ? 'default' : 'secondary'}>{doc.type}</Badge>
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
