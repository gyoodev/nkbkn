'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
import type { NewsPost } from '@/lib/types';

// Placeholder data until backend is connected
const newsPosts: NewsPost[] = [
    { id: 1, title: 'Голямото дерби наближава: Очаквания и фаворити', date: '2024-08-15', category: 'Предстоящи', excerpt: '', content: '', image_url: '', href: '/news/1', views: 1250, likes: 24, comments_count: 7 },
    { id: 2, title: 'Изненадваща победа на "Буря" в купа "Надежда"', date: '2024-08-10', category: 'Резултати', excerpt: '', content: '', image_url: '', href: '/news/2', views: 980, likes: 18, comments_count: 4 },
    { id: 3, title: 'Нови таланти на хоризонта: Младите жокеи на България', date: '2024-08-05', category: 'Анализи', excerpt: '', content: '', image_url: '', href: '/news/3', views: 750, likes: 15, comments_count: 9 },
    { id: 4, title: 'Хиподрум "Банкя" с нови подобрения за сезона', date: '2024-07-28', category: 'Новини', excerpt: '', content: '', image_url: '', href: '/news/4', views: 620, likes: 12, comments_count: 3 },
];


export default function AdminNewsPage() {
    const { language } = useLanguage();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

  return (
    <div>
      <PageHeader
        title="Управление на новини"
        description="Добавяйте, редактирайте и изтривайте новинарски публикации."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Новини</CardTitle>
          <CardDescription>
            Списък с всички новинарски публикации.
          </CardDescription>
          <div className="flex justify-end">
            <Button>Добави нова публикация</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заглавие</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>
                  <span className="sr-only">Действия</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{formatDate(post.date)}</TableCell>
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
