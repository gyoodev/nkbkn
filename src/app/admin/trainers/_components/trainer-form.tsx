
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
import RichTextEditor from '@/components/rich-text-editor';

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
  const [associatedHorses, setAssociatedHorses] = useState(trainer?.associatedHorses.join(', ') || '');

  const formActionWithEditor = (formData: FormData) => {
    formData.set('achievements', achievements);
    formData.set('associatedHorses', associatedHorses);
    dispatch(formData);
  };
  
  const [state, dispatch] = useActionState(upsertTrainer, initialState);

  return (
    <form action={formActionWithEditor}>
        <input type="hidden" name="id" value={trainer?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай треньор' : 'Нов треньор'}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Име</Label>
            <Input id="name" name="name" defaultValue={trainer?.name} />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="imageUrl">URL на снимка</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={trainer?.imageUrl} />
             {state.errors?.imageUrl && <p className="text-sm font-medium text-destructive">{state.errors.imageUrl}</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="achievements">Постижения</Label>
            <RichTextEditor value={achievements} onChange={setAchievements} />
            {state.errors?.achievements && <p className="text-sm font-medium text-destructive">{state.errors.achievements}</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="associatedHorses">Свързани коне</Label>
            <RichTextEditor value={associatedHorses} onChange={setAssociatedHorses} />
             {state.errors?.associatedHorses && <p className="text-sm font-medium text-destructive">{state.errors.associatedHorses}</p>}
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
