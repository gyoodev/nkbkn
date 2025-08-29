
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deletePartner } from '../actions';
import { useTransition } from 'react';

export function DeletePartnerButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();

    return (
        <DropdownMenuItem
            onClick={() => startTransition(() => deletePartner(id))}
            disabled={isPending}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
        >
            Изтрий
        </DropdownMenuItem>
    );
}
