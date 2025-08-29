
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteSubmission } from '../actions';
import { Trash2 } from 'lucide-react';

export function DeleteButton({ id }: { id: number }) {
  const deleteWithId = deleteSubmission.bind(null, id);
  return (
    <form action={deleteWithId} className="w-full">
        <button className="w-full">
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
