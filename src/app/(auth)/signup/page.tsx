
'use client';

import { signup } from './actions';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState, useFormStatus } from 'react-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { text } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? text.signingUp : text.signUp}
    </Button>
  );
}

export default function SignupPage() {
  const { text } = useLanguage();
  const [state, dispatch] = useFormState(signup, undefined);

  return (
    <Card className="mx-auto max-w-sm">
    <CardHeader>
        <CardTitle className="text-xl">{text.signUp}</CardTitle>
        <CardDescription>
            {text.signUpPrompt}
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
            <div className="space-y-2">
                <Label htmlFor="password">{text.password}</Label>
                <Input id="password" name="password" type="password" required />
            </div>
             {state?.error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
             {state?.message && (
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            <SubmitButton />
        </form>
        <div className="mt-4 text-center text-sm">
            {text.alreadyHaveAccount}{' '}
            <Link href="/login" className="underline">
                {text.login}
            </Link>
        </div>
    </CardContent>
    </Card>
  );
}
