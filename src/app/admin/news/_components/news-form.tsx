
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertNewsPost } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import type { NewsPost } from '@/lib/types';
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
        isEditing ? 'Запази промените' : 'Създай публикация'
      )}
    </Button>
  );
}

export function NewsPostForm({ post }: { post?: NewsPost }) {
  const isEditing = !!post;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertNewsPost, initialState);

  return (
    <form action={dispatch}>
        <input type="hidden" name="id" value={post?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай публикация' : 'Нова публикация'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Заглавие</Label>
            <Input id="title" name="title" defaultValue={post?.title} />
            {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="category">Категория</Label>
            <Input id="category" name="category" defaultValue={post?.category} />
             {state.errors?.category && <p className="text-sm font-medium text-destructive">{state.errors.category}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="image_url">URL на изображение</Label>
            <Input id="image_url" name="image_url" defaultValue={post?.image_url} />
             {state.errors?.image_url && <p className="text-sm font-medium text-destructive">{state.errors.image_url}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="content">Съдържание</Label>
            <Textarea id="content" name="content" defaultValue={post?.content} rows={10} />
             {state.errors?.content && <p className="text-sm font-medium text-destructive">{state.errors.content}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/news">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
