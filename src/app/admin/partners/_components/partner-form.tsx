
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { upsertPartner } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { Partner } from '@/lib/types';
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
        isEditing ? 'Запази промените' : 'Добави партньор'
      )}
    </Button>
  );
}

export function PartnerForm({ partner }: { partner?: Partner }) {
  const isEditing = !!partner;
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(upsertPartner, initialState);

  return (
    <form action={dispatch}>
        <input type="hidden" name="id" value={partner?.id} />
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Редактирай партньор' : 'Нов партньор'}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Име</Label>
            <Input id="name" name="name" defaultValue={partner?.name} />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
          </div>
           <div className="space-y-1">
            <Label htmlFor="logo_url">URL на лого</Label>
            <Input id="logo_url" name="logo_url" defaultValue={partner?.logo_url} />
             {state.errors?.logo_url && <p className="text-sm font-medium text-destructive">{state.errors.logo_url}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/partners">Отказ</Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
