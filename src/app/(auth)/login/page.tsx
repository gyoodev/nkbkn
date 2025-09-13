
'use client';

import { login } from './actions';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

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
    <div className="w-full max-w-md space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{text.login}</h1>
        <p className="mt-2 text-muted-foreground">
          {text.loginPrompt}
        </p>
      </div>

      <form action={dispatch} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="email">{text.email}</Label>
            <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            className="h-12 rounded-xl"
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">{text.password}</Label>
            <Input id="password" name="password" type="password" required className="h-12 rounded-xl"/>
        </div>
        
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" name="rememberMe" />
                <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {text.rememberMe}
                </Label>
            </div>
            <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
            >
                Забравена парола?
            </Link>
        </div>

        {state?.error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Грешка</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}
        <SubmitButton />
      </form>
      <div className="text-center text-sm">
        {text.noAccount}{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
            {text.signUp}
        </Link>
      </div>
    </div>
  );
}
