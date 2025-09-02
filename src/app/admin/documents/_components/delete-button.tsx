
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteDocument } from '../actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

export function DeleteButton({ id, onDeleted }: { id: number, onDeleted: () => void }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteDocument(id);
       if (result.success) {
            toast({ title: 'Успех', description: result.message });
            onDeleted();
        } else {
            toast({ variant: 'destructive', title: 'Грешка', description: result.message });
        }
    });
  };

  return (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 focus:bg-red-50 focus:text-red-700"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Изтрий
    </DropdownMenuItem>
  );
}
