
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertHorse } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Horse } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        isEditing ? 'Запази промените' : 'Добави кон'
      )}
    </Button>
  );
}

export function HorseForm({ horse }: { horse?: Horse }) {
  const isEditing = !!horse;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertHorse, initialState);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <form action={dispatch}>
        <input type="hidden" name="id" value={horse?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай кон' : 'Нов кон'}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Име</Label>
            <Input id="name" name="name" defaultValue={horse?.name} />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="age">Година на раждане</Label>
            <Select name="age" defaultValue={horse?.age ? String(horse.age) : undefined}>
                <SelectTrigger id="age">
                    <SelectValue placeholder="Изберете година" />
                </SelectTrigger>
                <SelectContent>
                    {years.map(year => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state.errors?.age && <p className="text-sm font-medium text-destructive">{state.errors.age}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="sire">Баща (Sire)</Label>
            <Input id="sire" name="sire" defaultValue={horse?.sire} />
            {state.errors?.sire && <p className="text-sm font-medium text-destructive">{state.errors.sire}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="dam">Майка (Dam)</Label>
            <Input id="dam" name="dam" defaultValue={horse?.dam} />
            {state.errors?.dam && <p className="text-sm font-medium text-destructive">{state.errors.dam}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="mounts">Участия</Label>
            <Input id="mounts" name="mounts" type="number" defaultValue={horse?.mounts || 0} />
            {state.errors?.mounts && <p className="text-sm font-medium text-destructive">{state.errors.mounts}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="wins">Победи</Label>
            <Input id="wins" name="wins" type="number" defaultValue={horse?.wins || 0} />
            {state.errors?.wins && <p className="text-sm font-medium text-destructive">{state.errors.wins}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="owner">Собственик</Label>
            <Input id="owner" name="owner" defaultValue={horse?.owner} />
             {state.errors?.owner && <p className="text-sm font-medium text-destructive">{state.errors.owner}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="bestTime">Най-добро време</Label>
            <Input id="bestTime" name="bestTime" defaultValue={horse?.bestTime || ''} />
             {state.errors?.bestTime && <p className="text-sm font-medium text-destructive">{state.errors.bestTime}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/horses">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
