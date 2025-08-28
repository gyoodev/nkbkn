
'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertTrainer } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Trainer } from '@/lib/types';
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
        isEditing ? 'Запази промените' : 'Добави треньор'
      )}
    </Button>
  );
}

export function TrainerForm({ trainer }: { trainer?: Trainer }) {
  const isEditing = !!trainer;
  const initialState = { message: null, errors: {} };
  
  const [achievements, setAchievements] = useState(trainer?.achievements.join(', ') || '');
  
  const [state, dispatch] = useActionState(upsertTrainer, initialState);

  const formActionWithEditor = (formData: FormData) => {
    formData.set('achievements', achievements);
    dispatch(formData);
  };

  return (
    <form action={formActionWithEditor}>
        <input type="hidden" name="id" value={trainer?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай треньор' : 'Нов треньор'}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="name">Име</Label>
            <Input id="name" name="name" defaultValue={trainer?.name} />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
          </div>
           <div className="space-y-1.5">
            <Label htmlFor="imageUrl">URL на снимка</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={trainer?.imageUrl} />
             {state.errors?.imageUrl && <p className="text-sm font-medium text-destructive">{state.errors.imageUrl}</p>}
          </div>
           <div className="space-y-1.5">
            <Label htmlFor="wins">Победи</Label>
            <Input id="wins" name="wins" type="number" defaultValue={trainer?.stats?.wins || 0} />
            {state.errors?.wins && <p className="text-sm font-medium text-destructive">{state.errors.wins}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mounts">Участия</Label>
            <Input id="mounts" name="mounts" type="number" defaultValue={trainer?.stats?.mounts || 0} />
             {state.errors?.mounts && <p className="text-sm font-medium text-destructive">{state.errors.mounts}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="achievements">Постижения (разделени със запетая)</Label>
            <Textarea 
              id="achievements"
              name="achievements" 
              value={achievements}
              onChange={e => setAchievements(e.target.value)}
            />
            {state.errors?.achievements && <p className="text-sm font-medium text-destructive">{state.errors.achievements}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/trainers">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
