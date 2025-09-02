
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
import Image from 'next/image';

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
    <form action={dispatch} encType="multipart/form-data">
        <input type="hidden" name="id" value={track?.id} />
        <input type="hidden" name="current_image_url" value={track?.image_url} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label htmlFor="location">Местоположение</Label>
                <Input id="location" name="location" defaultValue={track?.location} />
                {state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="track_length">Дължина на пистата (в метри)</Label>
                <Input id="track_length" name="track_length" type="number" defaultValue={track?.track_length} />
                {state.errors?.track_length && <p className="text-sm font-medium text-destructive">{state.errors.track_length}</p>}
            </div>
          </div>
           <div className="space-y-1">
            <Label htmlFor="image_file">Изображение</Label>
             {isEditing && track?.image_url && (
                <div className="mt-2 relative aspect-video w-full max-w-md rounded-md overflow-hidden bg-muted">
                    <Image src={track.image_url} alt="Текущо изображение" fill className="object-contain" />
                </div>
            )}
            <Input id="image_file" name="image_file" type="file" accept="image/*" />
             {isEditing && track?.image_url && (
                <p className="text-sm text-muted-foreground">
                    Оставете полето празно, за да запазите текущото изображение.
                </p>
            )}
            {state.errors?.image_file && <p className="text-sm font-medium text-destructive">{state.errors.image_file}</p>}
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
