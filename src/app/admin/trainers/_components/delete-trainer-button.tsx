
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteTrainer } from '../actions';
import { useTransition } from 'react';

export function DeleteTrainerButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();

    return (
        <DropdownMenuItem
            onClick={() => startTransition(() => deleteTrainer(id))}
            disabled={isPending}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
        >
            Изтрий
        </DropdownMenuItem>
    );
}
