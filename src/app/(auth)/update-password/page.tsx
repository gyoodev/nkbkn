
'use client';

import { updatePassword } from './actions';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Актуализиране...' : 'Актуализирай паролата'}
    </Button>
  );
}

export default function UpdatePasswordPage() {
  const { text } = useLanguage();
  const [state, dispatch] = useActionState(updatePassword, undefined);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Нова парола</CardTitle>
        <CardDescription>
          Въведете новата си парола по-долу.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Нова парола</Label>
            <Input id="password" name="password" type="password" required />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirmPassword">Потвърди новата парола</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>
          {state?.error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Грешка</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state?.message && (
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Успех!</AlertTitle>
                <AlertDescription>
                    {state.message}{' '}
                    <Link href="/login" className="font-bold underline">Вход</Link>
                </AlertDescription>
            </Alert>
          )}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
