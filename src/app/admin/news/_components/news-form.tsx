
'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertNewsPost } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { NewsPost } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/rich-text-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        isEditing ? 'Запази промените' : 'Създай публикация'
      )}
    </Button>
  );
}

export function NewsPostForm({ post }: { post?: NewsPost }) {
  const isEditing = !!post;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertNewsPost, initialState);
  const [content, setContent] = useState(post?.content || '');
  
  const categories = ["Новини", "Събития", "Предстоящи", "Важно", "Кандидатури"];

  const formAction = (formData: FormData) => {
    formData.set('content', content);
    dispatch(formData);
  };

  return (
    <form action={formAction} encType="multipart/form-data">
        <input type="hidden" name="id" value={post?.id} />
        <input type="hidden" name="current_image_url" value={post?.image_url} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай публикация' : 'Нова публикация'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label htmlFor="title">Заглавие</Label>
                <Input id="title" name="title" defaultValue={post?.title} />
                {state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="category">Категория</Label>
                <Select name="category" defaultValue={post?.category}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Изберете категория" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {state.errors?.category && <p className="text-sm font-medium text-destructive">{state.errors.category}</p>}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="image_file">Изображение</Label>
            {isEditing && post?.image_url && (
                <div className="mt-2 relative aspect-video w-full max-w-md rounded-md overflow-hidden bg-muted">
                    <Image src={post.image_url} alt="Текущо изображение" fill className="object-contain" />
                </div>
            )}
            <Input id="image_file" name="image_file" type="file" accept="image/*" />
            {isEditing && post?.image_url && (
                <p className="text-sm text-muted-foreground">
                    Оставете полето празно, за да запазите текущото изображение.
                </p>
            )}
             {state.errors?.image_file && <p className="text-sm font-medium text-destructive">{state.errors.image_file}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="content-editor">Съдържание</Label>
             <RichTextEditor value={content} onChange={setContent} />
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
