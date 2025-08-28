
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DeleteNewsPost } from '../actions';

export function DeleteButton({ id }: { id: number }) {
  const deleteWithId = DeleteNewsPost.bind(null, id);
  return (
    <form action={deleteWithId}>
      <button className="w-full text-left">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Изтрий
        </DropdownMenuItem>
      </button>
    </form>
  );
}
