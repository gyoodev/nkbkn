
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DeleteNewsPost } from '../actions';
import { useTransition } from 'react';

export function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await DeleteNewsPost(id);
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
