
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye } from 'lucide-react';
import type { Submission } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator';
import { getSubmissions } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';


function SubmissionDetail({ label, value }: { label: string, value: string | number | null | undefined }) {
    if (value === null || value === undefined || value === '') return null;
    return (
         <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-semibold text-right text-muted-foreground">{label}:</span>
            <span className="col-span-2 text-sm">{value}</span>
        </div>
    )
}

function ViewSubmissionDialog({ submission }: { submission: Submission }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Детайли
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Преглед на заявка: {submission.type}</DialogTitle>
                    <DialogDescription>
                        Заявка от {submission.name}, получена на {new Date(submission.created_at).toLocaleString('bg-BG')}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                   
                    {(submission.type === 'Жокей' || submission.type === 'Треньор' || submission.type === 'Собственик') && (
                        <div className="space-y-2 rounded-md border p-4">
                            <h4 className="font-semibold text-md">Лични данни</h4>
                            <Separator />
                            <SubmissionDetail label="Име" value={submission.first_name} />
                            <SubmissionDetail label="Фамилия" value={submission.last_name} />
                            <SubmissionDetail label="Дата на раждане" value={submission.date_of_birth} />
                            <SubmissionDetail label="ЕГН" value={submission.egn} />
                            <SubmissionDetail label="Адрес" value={submission.address} />
                            {(submission.type === 'Жокей' || submission.type === 'Треньор') && (
                                <SubmissionDetail label="Победи" value={submission.wins} />
                            )}
                            {submission.type === 'Треньор' && (
                                <SubmissionDetail label="Брой коне" value={submission.horse_count} />
                            )}
                        </div>
                    )}
                    
                    {submission.type === 'Кон' && (
                         <div className="space-y-2 rounded-md border p-4">
                             <h4 className="font-semibold text-md">Данни за коня</h4>
                             <Separator />
                             <SubmissionDetail label="Име на коня" value={submission.horse_name} />
                             <SubmissionDetail label="Възраст" value={submission.age} />
                             <SubmissionDetail label="Баща" value={submission.sire} />
                             <SubmissionDetail label="Майка" value={submission.dam} />
                             <SubmissionDetail label="Собственик" value={submission.owner} />
                             <SubmissionDetail label="Участия" value={submission.mounts} />
                             <SubmissionDetail label="Победи" value={submission.wins} />
                        </div>
                    )}

                    <div className="space-y-2 rounded-md border p-4">
                        <h4 className="font-semibold text-md">Данни за контакт</h4>
                        <Separator />
                        <SubmissionDetail label="Имейл" value={submission.email} />
                        <SubmissionDetail label="Телефон" value={submission.phone} />
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}

function SubmissionsTableSkeleton() {
    return (
         <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({length: 5}).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    )
}


export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        setLoading(true);
        const data = await getSubmissions();
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

  const getStatusVariant = (status: Submission['status']) => {
      switch (status) {
          case 'new': return 'default';
          case 'read': return 'secondary';
          case 'archived': return 'outline';
          default: return 'secondary';
      }
  }

  return (
    <div>
      <PageHeader
        title="Заявки от формуляри"
        description="Преглеждайте и управлявайте заявките, изпратени от потребителите през сайта."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Входящи заявки
          </CardTitle>
          <CardDescription>
            Списък с всички получени заявки за регистрация.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <SubmissionsTableSkeleton /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Име</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>{sub.type}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(sub.status)}>{sub.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(sub.created_at)}</TableCell>
                    <TableCell className="text-right">
                        <ViewSubmissionDialog submission={sub} />
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
