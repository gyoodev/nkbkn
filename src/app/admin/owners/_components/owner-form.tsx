

'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertOwner } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Owner } from '@/lib/types';
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
        isEditing ? 'Запази промените' : 'Добави собственик'
      )}
    </Button>
  );
}

export function OwnerForm({ owner }: { owner?: Owner }) {
  const isEditing = !!owner;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertOwner, initialState);

  return (
    <form action={dispatch}>
        <input type="hidden" name="id" value={owner?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай собственик' : 'Нов собственик'}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="name">Име</Label>
            <Input id="name" name="name" defaultValue={owner?.name} />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="date_of_birth">Дата на раждане</Label>
            <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={owner?.date_of_birth?.toString()} />
            {state.errors?.date_of_birth && <p className="text-sm font-medium text-destructive">{state.errors.date_of_birth}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="egn">ЕГН</Label>
            <Input id="egn" name="egn" defaultValue={owner?.egn || ''} />
            {state.errors?.egn && <p className="text-sm font-medium text-destructive">{state.errors.egn}</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="address">Адрес</Label>
            <Input id="address" name="address" defaultValue={owner?.address || ''} />
            {state.errors?.address && <p className="text-sm font-medium text-destructive">{state.errors.address}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Имейл</Label>
            <Input id="email" name="email" type="email" defaultValue={owner?.email || ''} />
            {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={owner?.phone || ''} />
            {state.errors?.phone && <p className="text-sm font-medium text-destructive">{state.errors.phone}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="image_url">URL на снимка</Label>
            <Input id="image_url" name="image_url" defaultValue={owner?.image_url || ''} />
             {state.errors?.image_url && <p className="text-sm font-medium text-destructive">{state.errors.image_url}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="horse_count">Брой коне</Label>
            <Input id="horse_count" name="horse_count" type="number" defaultValue={owner?.horse_count || 0} />
             {state.errors?.horse_count && <p className="text-sm font-medium text-destructive">{state.errors.horse_count}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/owners">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
