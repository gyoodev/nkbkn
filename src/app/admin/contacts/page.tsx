
'use client';

import { useEffect, useState, useTransition } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Contact, Eye, Trash2, Check, Clock, Reply, MoreHorizontal } from 'lucide-react';
import type { ContactSubmission } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { getContactSubmissions } from '@/lib/client/data';
import { deleteContactSubmission, updateContactStatus } from './actions';


function ViewSubmissionDialog({ submission }: { submission: ContactSubmission }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Запитване от {submission.name}</DialogTitle>
                    <DialogDescription>
                       Получено на {new Date(submission.created_at).toLocaleString('bg-BG')}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission.message}</p>
                </div>
                <DialogFooter className="sm:justify-start">
                     <Button asChild>
                        <a href={`mailto:${submission.email}`}>
                            <Reply className="mr-2 h-4 w-4" />
                            Отговори
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ActionsMenu({ submission }: { submission: ContactSubmission }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(() => {
            deleteContactSubmission(submission.id)
        })
    }

    const handleUpdateStatus = (status: ContactSubmission['status']) => {
        startTransition(() => {
            updateContactStatus(submission.id, status)
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" disabled={isPending}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem disabled={submission.status === 'answered'} onSelect={() => handleUpdateStatus('answered')}>
                    <Check className="mr-2 h-4 w-4" />
                    <span>Маркирай като отговорено</span>
                </DropdownMenuItem>
                 <DropdownMenuItem disabled={submission.status === 'pending'} onSelect={() => handleUpdateStatus('pending')}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Маркирай като чакащо</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onSelect={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Изтрий</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function SubmissionsTableSkeleton() {
    return (
         <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
                <TableHead>Имейл</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    )
}


export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        setLoading(true);
        const data = await getContactSubmissions();
        setSubmissions(data);
        setLoading(false);
    }
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('bg-BG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  };

  const getStatusVariant = (status: ContactSubmission['status']) => {
      switch (status) {
          case 'pending': return 'destructive';
          case 'answered': return 'default';
          default: return 'secondary';
      }
  }

  const getStatusText = (status: ContactSubmission['status']) => {
       switch (status) {
          case 'pending': return 'Очаква отговор';
          case 'answered': return 'Отговорено';
          default: return 'Неизвестен';
      }
  }

  return (
    <div>
      <PageHeader
        title="Запитвания от контактна форма"
        description="Преглеждайте и управлявайте съобщенията, изпратени от потребителите през сайта."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Contact className="h-6 w-6" />
            Входящи запитвания
          </CardTitle>
          <CardDescription>
            Списък с всички получени съобщения от контактната форма.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <SubmissionsTableSkeleton /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Имейл</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(sub.status)}>{getStatusText(sub.status)}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(sub.created_at)}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                        <ViewSubmissionDialog submission={sub} />
                        <ActionsMenu submission={sub} />
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
