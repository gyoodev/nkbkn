
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail, Eye, CheckCircle, Archive } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { createServerClient } from '@/lib/supabase/server';
import type { Submission } from '@/lib/types';
import { DeleteButton } from './_components/delete-button';
import { UpdateStatusButton } from './_components/update-status-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator';


async function getSubmissions(): Promise<Submission[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }
    return data;
}

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
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="mr-2 h-4 w-4" />
                    Преглед
                </DropdownMenuItem>
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


export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Име</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>
                  <span className="sr-only">Действия</span>
                </TableHead>
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
                         <ViewSubmissionDialog submission={sub} />
                        <DropdownMenuSeparator />
                        <UpdateStatusButton id={sub.id} status="read">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Маркирай като прочетена
                        </UpdateStatusButton>
                         <UpdateStatusButton id={sub.id} status="archived">
                            <Archive className="mr-2 h-4 w-4" />
                           Архивирай
                        </UpdateStatusButton>
                        <DropdownMenuSeparator />
                        <DeleteButton id={sub.id} />
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
