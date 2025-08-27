
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';

const resultsData = [
    { 
        raceName: 'Купа "Надежда"', 
        date: '2024-08-12', 
        track: 'Хиподрум Банкя', 
        winner: 'Вятър', 
        jockey: 'Георги Атанасов', 
        time: '1:23.45' 
    },
    { 
        raceName: 'Спринт "София"', 
        date: '2024-08-12', 
        track: 'Хиподрум Банкя', 
        winner: 'Мълния', 
        jockey: 'Николай Гроздев', 
        time: '0:58.12' 
    },
    { 
        raceName: 'Купа "Мадарски конник"', 
        date: '2024-08-05', 
        track: 'Хиподрум Шумен', 
        winner: 'Торнадо', 
        jockey: 'Валентин Атанасов', 
        time: '1:45.90' 
    },
    { 
        raceName: 'Гран При на Банкя', 
        date: '2024-07-28', 
        track: 'Хиподрум Банкя', 
        winner: 'Звезда', 
        jockey: 'Иван Иванов', 
        time: '2:01.33' 
    },
];

export default function ResultsPage() {
  const { text, language } = useLanguage();
  const locale = language === 'bg' ? bg : enUS;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.results}
        description="Официални резултати от последните състезания."
      />
      <Card className="mt-8">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Последни резултати
            </CardTitle>
            <CardDescription>Прегледайте класирането от последните проведени надбягвания.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Състезание</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Хиподрум</TableHead>
                <TableHead>Победител</TableHead>
                <TableHead>Жокей</TableHead>
                <TableHead className="text-right">Време</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultsData.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-primary">{result.raceName}</TableCell>
                  <TableCell>{format(new Date(result.date), 'PPP', { locale })}</TableCell>
                  <TableCell>{result.track}</TableCell>
                  <TableCell>{result.winner}</TableCell>
                  <TableCell>{result.jockey}</TableCell>
                  <TableCell className="text-right font-mono">{result.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
