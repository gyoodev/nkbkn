
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DeleteNewsPost } from '../actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

export function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await DeleteNewsPost(id);
      if (result?.message) {
         toast({
            variant: 'destructive',
            title: 'Грешка',
            description: result.message,
        });
      } else {
        toast({
            title: 'Успех!',
            description: 'Успешно изтрихте публикацията.',
        });
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
      Изтрий
    </DropdownMenuItem>
  );
}
