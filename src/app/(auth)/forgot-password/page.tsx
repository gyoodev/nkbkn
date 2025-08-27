
'use client';

import { forgotPassword } from './actions';
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
  const { text } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Изпращане...' : 'Изпрати линк за възстановяване'}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const { text } = useLanguage();
  const [state, dispatch] = useActionState(forgotPassword, undefined);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Забравена парола</CardTitle>
        <CardDescription>
          Въведете своя имейл и ние ще ви изпратим линк за възстановяване на паролата.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{text.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
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
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <SubmitButton />
        </form>
         <div className="mt-4 text-center text-sm">
            Спомнихте си паролата?{' '}
            <Link href="/login" className="underline">
                {text.login}
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}
