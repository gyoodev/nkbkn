
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { updateSubmissionStatus } from '../actions';
import type { Submission } from '@/lib/types';
import { useTransition } from 'react';

export function UpdateStatusButton({ id, status, children }: { id: number, status: Submission['status'], children: React.ReactNode }) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        startTransition(() => {
            updateSubmissionStatus(id, status);
        });
    };

    return (
        <form action={handleSubmit} className="w-full">
            <button type="submit" className="w-full text-left" disabled={isPending}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    {children}
                </DropdownMenuItem>
            </button>
        </form>
    );
}
