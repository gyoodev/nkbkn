'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { updateSubmissionStatus } from '../actions';
import type { Submission } from '@/lib/types';
import { useTransition } from 'react';

export function UpdateStatusButton({ id, status, children }: { id: number, status: Submission['status'], children: React.ReactNode }) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            await updateSubmissionStatus(id, status);
        });
    };

    return (
        <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={handleClick}
            disabled={isPending}
            className="w-full"
        >
            {children}
        </DropdownMenuItem>
    );
}
