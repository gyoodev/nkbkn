
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertTrack } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Track } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
        isEditing ? 'Запази промените' : 'Добави хиподрум'
      )}
    </Button>
  );
}

export function TrackForm({ track }: { track?: Track }) {
  const isEditing = !!track;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertTrack, initialState);

  return (
    <form action={dispatch}>
        <input type="hidden" name="id" value={track?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай хиподрум' : 'Нов хиподрум'}</CardTitle>
          <CardDescription>Попълнете информацията за хиподрума.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Име</Label>
            <Input id="name" name="name" defaultValue={track?.name} />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="location">Местоположение</Label>
            <Input id="location" name="location" defaultValue={track?.location} />
            {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="image_url">URL на снимка</Label>
            <Input id="image_url" name="image_url" defaultValue={track?.image_url} />
            {state.errors?.image_url && <p className="text-sm font-medium text-destructive">{state.errors.image_url}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" name="description" defaultValue={track?.description} rows={5} />
            {state.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/tracks">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
