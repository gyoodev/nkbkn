

'use client';

import { useState } from 'react';
import { useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Mail, Shield, User, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateUserRole } from '../actions';
import type { UserProfile } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function EmailDialog({ user }: { user: UserProfile }) {
    const [message, setMessage] = useState('');
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Изпрати имейл
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Изпращане на имейл до {user.full_name || user.email}</DialogTitle>
                    <DialogDescription>
                        Напишете вашето съобщение по-долу. Натискането на бутона "Изпрати" ще отвори вашия имейл клиент по подразбиране.
                    </DialogDescription>
                </DialogHeader>
                 <div className="grid w-full items-center gap-2 py-4">
                    <div className="text-sm"><strong>Имейл:</strong> {user.email}</div>
                    <div className="text-sm"><strong>Телефон:</strong> {user.phone || 'Няма'}</div>
                    <Label htmlFor="email-message" className="mt-2">Съобщение</Label>
                    <Textarea 
                        id="email-message"
                        placeholder="Вашето съобщение тук..." 
                        rows={6}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </div>
                <DialogFooter>
                     <Button asChild>
                        <a href={`mailto:${user.email}?body=${encodeURIComponent(message)}`}>Изпрати</a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function RoleChanger({ user }: { user: UserProfile }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleRoleChange = (role: 'admin' | 'user') => {
        if (user.role === role) return;

        startTransition(async () => {
            const result = await updateUserRole(user.id, role);
            if(result.error) {
                toast({ variant: 'destructive', title: 'Грешка', description: result.error });
            } else {
                toast({ title: 'Успех!', description: `Ролята на ${user.email} е променена на ${role}.`});
                // We might need a way to refresh the page/data here. For now, a manual refresh would work.
            }
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                   {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Промени роля</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => handleRoleChange('admin')} disabled={user.role === 'admin'}>
                                <Shield className="mr-2 h-4 w-4" />
                                Администратор
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange('user')} disabled={user.role === 'user'}>
                                <User className="mr-2 h-4 w-4" />
                                Потребител
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                 <DropdownMenuItem disabled>Изтрий (скоро)</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export function UsersClientPage({ initialUsers }: { initialUsers: UserProfile[] }) {
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('bg-BG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  };

  return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Списък с потребители</CardTitle>
          <CardDescription>
            Тук можете да видите всички регистрирани потребители и да управлявате техните роли.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initialUsers.length === 0 ? (
             <div className="py-10 text-center text-muted-foreground">
                Няма регистрирани потребители.
             </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Имейл</TableHead>
                    <TableHead>Име</TableHead>
                    <TableHead>Роля</TableHead>
                    <TableHead>Регистриран на</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {initialUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium">
                       <div className="flex items-center gap-2">
                         {user.email || 'Няма имейл'}
                         {user.deletion_requested && (
                           <Badge variant="destructive" className="gap-1.5">
                            <AlertTriangle className="h-3 w-3" />
                            Заявка за изтриване
                           </Badge>
                         )}
                       </div>
                    </TableCell>
                    <TableCell>{user.full_name || user.username || '-'}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Администратор' : 'Потребител'}
                        </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.reg_date)}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                        <EmailDialog user={user} />
                        <RoleChanger user={user} />
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
  );
}
