
'use client';

import { updatePassword } from './actions';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
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
     <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Нова парола</h1>
          <p className="mt-2 text-muted-foreground">
            Въведете новата си парола по-долу.
          </p>
        </div>

        <form action={dispatch} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Нова парола</Label>
            <Input id="password" name="password" type="password" required className="h-12 rounded-xl"/>
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirmPassword">Потвърди новата парола</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required className="h-12 rounded-xl"/>
          </div>
          {state?.error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>What is the error</AlertTitle>
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
      </div>
  );
}
