
'use client';

import { useActionState, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertResult } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Result } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tracks } from '@/lib/client/data';


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
        isEditing ? 'Запази промените' : 'Добави резултат'
      )}
    </Button>
  );
}

export function ResultsForm({ result }: { result?: Result }) {
  const isEditing = !!result;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertResult, initialState);
  const trackNames = useMemo(() => tracks.map(t => t.name), []);

  return (
    <form action={dispatch}>
        <input type="hidden" name="id" value={result?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай резултат' : 'Нов резултат'}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="raceName">Име на състезанието</Label>
            <Input id="raceName" name="raceName" defaultValue={result?.raceName} />
            {state.errors?.raceName && <p className="text-sm font-medium text-destructive">{state.errors.raceName}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="date">Дата</Label>
            <Input id="date" name="date" type="date" defaultValue={result?.date ? new Date(result.date).toISOString().split('T')[0] : ''} />
            {state.errors?.date && <p className="text-sm font-medium text-destructive">{state.errors.date}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="track">Хиподрум</Label>
             <Select name="track" defaultValue={result?.track}>
                <SelectTrigger>
                    <SelectValue placeholder="Изберете хиподрум" />
                </SelectTrigger>
                <SelectContent>
                    {trackNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                </SelectContent>
            </Select>
             {state.errors?.track && <p className="text-sm font-medium text-destructive">{state.errors.track}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="winner">Победител (кон)</Label>
            <Input id="winner" name="winner" defaultValue={result?.winner} />
            {state.errors?.winner && <p className="text-sm font-medium text-destructive">{state.errors.winner}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="jockey">Жокей</Label>
            <Input id="jockey" name="jockey" defaultValue={result?.jockey} />
             {state.errors?.jockey && <p className="text-sm font-medium text-destructive">{state.errors.jockey}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="time">Време (пр. 1:23.45)</Label>
            <Input id="time" name="time" defaultValue={result?.time} />
             {state.errors?.time && <p className="text-sm font-medium text-destructive">{state.errors.time}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/results">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
