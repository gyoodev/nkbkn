
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteSubmission } from '../actions';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';

export function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(() => {
      deleteSubmission(id);
    });
  };

  return (
    <form action={() => deleteSubmission(id)} className="w-full">
        <button type="submit" className="w-full" disabled={isPending}>
            <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 focus:bg-red-50 focus:text-red-700 w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Изтрий
            </DropdownMenuItem>
        </button>
    </form>
  );
}
