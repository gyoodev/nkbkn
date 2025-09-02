
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteTrack } from '../actions';
import { useTransition } from 'react';

export function DeleteTrackButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();

    return (
        <DropdownMenuItem
            onClick={() => startTransition(() => deleteTrack(id))}
            disabled={isPending}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
        >
            Изтрий
        </DropdownMenuItem>
    );
}
