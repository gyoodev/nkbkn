

'use client';

import { useEffect, useState, useRef, useTransition, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, MoreHorizontal, Check, Archive, Trash2, FolderSync, Printer, Loader2, XCircle } from 'lucide-react';
import type { Submission } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
import { getSubmissions } from '@/lib/client/data';
import { DeleteButton } from './_components/delete-button';
import { UpdateStatusButton } from './_components/update-status-button';
import { usePrint } from '@/app/print/page';
import { approveSubmission, rejectSubmission } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function SubmissionDetail({ label, value }: { label: string, value: string | number | null | undefined }) {
    if (value === null || value === undefined || value === '') return null;
    return (
         <div className="grid grid-cols-3 items-center gap-4">
            <span className="text-sm font-semibold text-right text-muted-foreground">{label}:</span>
            <span className="col-span-2 text-sm">{value}</span>
        </div>
    )
}

function ViewSubmissionDialog({ submission, onActionComplete }: { submission: Submission; onActionComplete: () => void }) {
    const { print } = usePrint();
    const printRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [approvePending, startApproveTransition] = useTransition();
    const [rejectPending, startRejectTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const handlePrint = () => {
        if(printRef.current) {
            print(printRef.current.cloneNode(true));
        }
    }

    const handleApprove = () => {
        startApproveTransition(async () => {
            const result = await approveSubmission(submission);
            if (result.success) {
                toast({ title: 'Успех!', description: result.message });
                onActionComplete();
                setIsOpen(false);
            } else {
                toast({ variant: 'destructive', title: 'Грешка!', description: result.message });
            }
        });
    }
    
    const handleReject = () => {
        startRejectTransition(async () => {
            const result = await rejectSubmission(submission.id);
             if (result.success) {
                toast({ title: 'Успех!', description: result.message });
                onActionComplete();
                setIsOpen(false);
            } else {
                toast({ variant: 'destructive', title: 'Грешка!', description: result.message });
            }
        })
    }

    const PrintContent = (
         <div ref={printRef} className="print-content">
            <style>{`
                .print-content {
                    font-family: sans-serif;
                    line-height: 1.5;
                }
                .print-content h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .print-content p {
                    color: #666;
                    margin-bottom: 1rem;
                }
                .print-content .details-section {
                     border: 1px solid #e5e7eb;
                     border-radius: 0.5rem;
                     padding: 1rem;
                     margin-bottom: 1rem;
                }
                 .print-content .details-section h4 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                 }
                 .print-content hr {
                    border-top: 1px solid #e5e7eb;
                    margin: 0.5rem 0;
                 }
            `}</style>
            <h3>Заявка: {submission.type}</h3>
            <p>Заявка от {submission.name}, получена на {new Date(submission.created_at).toLocaleString('bg-BG')}.</p>
             {(submission.type === 'Жокей' || submission.type === 'Треньор' || submission.type === 'Собственик') && (
                <div className="details-section">
                    <h4>Лични данни</h4>
                    <hr />
                    <SubmissionDetail label="Име" value={submission.first_name} />
                    <SubmissionDetail label="Фамилия" value={submission.last_name} />
                    <SubmissionDetail label="Дата на раждане" value={submission.date_of_birth} />
                    <SubmissionDetail label="ЕГН" value={submission.egn} />
                    <SubmissionDetail label="Адрес" value={submission.address} />
                    {submission.type === 'Собственик' && (
                        <SubmissionDetail label="Брой коне" value={submission.horse_count} />
                    )}
                </div>
            )}
             {submission.type === 'Кон' && (
                 <div className="details-section">
                     <h4>Данни за коня</h4>
                     <hr />
                     <SubmissionDetail label="Име на коня" value={submission.horse_name} />
                     <SubmissionDetail label="Година на раждане" value={submission.age} />
                     <SubmissionDetail label="Пол" value={submission.gender} />
                     <SubmissionDetail label="Произход" value={submission.origin} />
                     <SubmissionDetail label="Паспортен номер" value={submission.passport_number} />
                     <SubmissionDetail label="Баща" value={submission.sire} />
                     <SubmissionDetail label="Майка" value={submission.dam} />
                     <SubmissionDetail label="Участия" value={submission.mounts} />
                     <SubmissionDetail label="Победи" value={submission.wins} />
                </div>
            )}

            <div className="details-section">
                <h4>Данни за контакт</h4>
                <hr />
                <SubmissionDetail label="Имейл" value={submission.email} />
                <SubmissionDetail label="Телефон" value={submission.phone} />
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                   {PrintContent}
                </div>
                <DialogFooter className="sm:justify-between flex-col-reverse sm:flex-row gap-2">
                     <div>
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Принтирай
                        </Button>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Затвори</Button>
                        </DialogClose>
                        {submission.status === 'new' || submission.status === 'read' ? (
                            <>
                                <Button variant="destructive" onClick={handleReject} disabled={rejectPending}>
                                    {rejectPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Отхвърли
                                </Button>
                                <Button onClick={handleApprove} disabled={approvePending}>
                                    {approvePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Одобри
                                </Button>
                            </>
                        ) : null}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function SubmissionsTable({ submissions, onActionComplete }: { submissions: Submission[], onActionComplete: () => void }) {
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
          case 'approved': return 'default';
          case 'rejected': return 'destructive';
          case 'archived': return 'outline';
          default: return 'secondary';
      }
  }

  const statusTranslations: Record<Submission['status'], string> = {
      new: 'Нова',
      read: 'Прочетена',
      archived: 'Архивирана',
      approved: 'Одобрена',
      rejected: 'Отхвърлена',
  }

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
            {submissions.map((sub) => (
                <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.name}</TableCell>
                <TableCell>{sub.type}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(sub.status)}>{statusTranslations[sub.status]}</Badge>
                </TableCell>
                <TableCell>{formatDate(sub.created_at)}</TableCell>
                <TableCell className="text-right flex items-center justify-end">
                    <ViewSubmissionDialog submission={sub} onActionComplete={onActionComplete} />
                    <ActionsMenu submission={sub} />
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
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

function ActionsMenu({ submission }: { submission: Submission }) {
    return (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <UpdateStatusButton id={submission.id} status="read">
                    <Check className="mr-2 h-4 w-4" />
                    Маркирай като прочетено
                </UpdateStatusButton>
                <UpdateStatusButton id={submission.id} status="archived">
                     <Archive className="mr-2 h-4 w-4" />
                    Архивирай
                </UpdateStatusButton>
                <UpdateStatusButton id={submission.id} status="new">
                     <FolderSync className="mr-2 h-4 w-4" />
                    Върни в нови
                </UpdateStatusButton>
                <DropdownMenuSeparator />
                <DeleteButton id={submission.id} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const data = await getSubmissions();
    setSubmissions(data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredSubmissions = useMemo(() => {
      const newSubs = submissions.filter(s => s.status === 'new' || s.status === 'read');
      const historySubs = submissions.filter(s => s.status === 'approved' || s.status === 'rejected');
      const archivedSubs = submissions.filter(s => s.status === 'archived');
      return { newSubs, historySubs, archivedSubs };
  }, [submissions]);

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
          <Tabs defaultValue="new">
             <TabsList>
                <TabsTrigger value="new">Нови ({filteredSubmissions.newSubs.length})</TabsTrigger>
                <TabsTrigger value="history">История ({filteredSubmissions.historySubs.length})</TabsTrigger>
                <TabsTrigger value="archived">Архивирани ({filteredSubmissions.archivedSubs.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="mt-4">
                {loading ? <SubmissionsTableSkeleton /> : <SubmissionsTable submissions={filteredSubmissions.newSubs} onActionComplete={loadData} />}
            </TabsContent>
            <TabsContent value="history" className="mt-4">
                {loading ? <SubmissionsTableSkeleton /> : <SubmissionsTable submissions={filteredSubmissions.historySubs} onActionComplete={loadData} />}
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
                {loading ? <SubmissionsTableSkeleton /> : <SubmissionsTable submissions={filteredSubmissions.archivedSubs} onActionComplete={loadData} />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
