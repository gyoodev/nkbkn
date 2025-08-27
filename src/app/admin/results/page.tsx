
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
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
];

export default function AdminResultsPage() {
    const { language } = useLanguage();
    const locale = language === 'bg' ? bg : enUS;

    return (
        <div>
            <PageHeader
                title="Управление на резултати"
                description="Добавяйте, редактирайте и изтривайте резултати от състезания."
            />
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Резултати</CardTitle>
                    <CardDescription>
                        Списък с всички въведени резултати от състезания.
                    </CardDescription>
                    <div className="flex justify-end">
                        <Button>Добави резултат</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Състезание</TableHead>
                                <TableHead>Дата</TableHead>
                                <TableHead>Победител</TableHead>
                                <TableHead>Жокей</TableHead>
                                <TableHead>
                                <span className="sr-only">Действия</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {resultsData.map((result, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{result.raceName}</TableCell>
                                <TableCell>{format(new Date(result.date), 'PPP', { locale })}</TableCell>
                                <TableCell>{result.winner}</TableCell>
                                <TableCell>{result.jockey}</TableCell>
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
