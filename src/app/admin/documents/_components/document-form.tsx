'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { uploadDocument } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Качване...
        </>
      ) : (
        'Качи документ'
      )}
    </Button>
  );
}

export function DocumentForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(uploadDocument, initialState);

  return (
    <form action={dispatch}>
      <Card>
        <CardHeader>
          <CardTitle>Качване на нов документ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Име на документа</Label>
            <Input id="name" name="name" />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label>Тип на документа</Label>
            <RadioGroup name="type" className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Правилник" id="type-regulation" />
                    <Label htmlFor="type-regulation">Правилник</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Формуляр" id="type-form" />
                    <Label htmlFor="type-form">Формуляр</Label>
                </div>
            </RadioGroup>
            {state.errors?.type && <p className="text-sm font-medium text-destructive">{state.errors.type}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="file">Файл</Label>
            <Input id="file" name="file" type="file" />
            {state.errors?.file && <p className="text-sm font-medium text-destructive">{state.errors.file}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/documents">Отказ</Link>
          </Button>
          <SubmitButton />
        </CardFooter>
      </Card>
      {state.message && <p className="mt-4 text-sm font-medium text-destructive">{state.message}</p>}
    </form>
  );
}
