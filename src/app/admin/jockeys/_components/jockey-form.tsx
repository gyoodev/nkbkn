'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertJockey } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Jockey } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? 'Запазване...' : 'Създаване...'}
        </>
      ) : (
        isEditing ? 'Запази промените' : 'Добави жокей'
      )}
    </Button>
  );
}

export function JockeyForm({ jockey }: { jockey?: Jockey }) {
  const isEditing = !!jockey;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertJockey, initialState);

  return (
    <form action={dispatch}>
        <input type="hidden" name="id" value={jockey?.id || ''} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай жокей' : 'Нов жокей'}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Име</Label>
            <Input id="name" name="name" defaultValue={jockey?.name} />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="imageUrl">URL на снимка</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={jockey?.imageUrl} />
             {state.errors?.image_url && <p className="text-sm font-medium text-destructive">{state.errors.image_url}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="wins">Победи</Label>
            <Input id="wins" name="wins" type="number" defaultValue={jockey?.wins} />
            {state.errors?.wins && <p className="text-sm font-medium text-destructive">{state.errors.wins}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="mounts">Участия</Label>
            <Input id="mounts" name="mounts" type="number" defaultValue={jockey?.mounts} />
             {state.errors?.mounts && <p className="text-sm font-medium text-destructive">{state.errors.mounts}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/jockeys">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
