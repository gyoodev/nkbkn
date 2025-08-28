
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteResult } from '../actions';
import { useTransition } from 'react';

export function DeleteResultButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();

    return (
        <DropdownMenuItem
            onClick={() => startTransition(() => deleteResult(id))}
            disabled={isPending}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
        >
            Изтрий
        </DropdownMenuItem>
    );
}
