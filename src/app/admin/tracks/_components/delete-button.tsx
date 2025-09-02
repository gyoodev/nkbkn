
'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteTrack } from '../actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';

export function DeleteTrackButton({ id, onDeleted }: { id: number, onDeleted: () => void }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteTrack(id);
             if (result.success) {
                toast({ title: 'Успех!', description: result.message });
                onDeleted();
            } else {
                toast({ variant: 'destructive', title: 'Грешка!', description: result.message });
            }
        });
    }

    return (
        <DropdownMenuItem
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
            onSelect={(e) => e.preventDefault()}
        >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Изтрий
        </DropdownMenuItem>
    );
}
