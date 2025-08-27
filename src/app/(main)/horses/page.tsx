'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { horses } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function HorsesPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.horsesPageTitle}
        description={text.horsesPageDescription}
      />
      <Card className="mt-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{text.horseName}</TableHead>
                <TableHead>{text.sire}</TableHead>
                <TableHead>{text.dam}</TableHead>
                <TableHead className="text-center">{text.age}</TableHead>
                <TableHead>{text.owner}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horses.map((horse) => (
                <TableRow key={horse.id}>
                  <TableCell className="font-medium text-primary">{horse.name}</TableCell>
                  <TableCell>{horse.sire}</TableCell>
                  <TableCell>{horse.dam}</TableCell>
                  <TableCell className="text-center">{horse.age}</TableCell>
                  <TableCell>{horse.owner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
