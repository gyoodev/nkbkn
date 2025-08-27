
'use client';

import { login } from './actions';
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
      {pending ? text.loggingIn : text.login}
    </Button>
  );
}

export default function LoginPage() {
  const { text } = useLanguage();
  const [state, dispatch] = useActionState(login, undefined);

  return (
    <Card className="mx-auto max-w-sm">
    <CardHeader>
        <CardTitle className="text-2xl">{text.login}</CardTitle>
        <CardDescription>
        {text.loginPrompt}
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
            <div className="flex items-center">
            <Label htmlFor="password">{text.password}</Label>
            </div>
            <Input id="password" name="password" type="password" required />
        </div>
        {state?.error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}
        <SubmitButton />
        </form>
        <div className="mt-4 text-center text-sm">
        {text.noAccount}{' '}
        <Link href="/signup" className="underline">
            {text.signUp}
        </Link>
        </div>
    </CardContent>
    </Card>
  );
}
