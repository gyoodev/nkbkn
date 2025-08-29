
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

function ViewSubmissionDialog({ submission }: { submission: Submission }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                 <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Eye className="mr-2 h-4 w-4" />
                    Преглед
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Преглед на заявка - {submission.type}</DialogTitle>
                    <DialogDescription>
                        Заявка от {submission.name}, получена на {new Date(submission.created_at).toLocaleString('bg-BG')}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right font-semibold">Име:</span>
                        <span className="col-span-3">{submission.name}</span>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right font-semibold">Имейл:</span>
                        <span className="col-span-3">{submission.email}</span>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right font-semibold">Телефон:</span>
                        <span className="col-span-3">{submission.phone}</span>
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <span className="text-right font-semibold">Съобщение:</span>
                        <p className="col-span-3 whitespace-pre-wrap">{submission.message || 'Няма'}</p>
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

