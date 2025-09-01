
'use client';

import { signup } from './actions';
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
  const { text } = useLanguage();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? text.signingUp : text.signUp}
    </Button>
  );
}

export default function SignupPage() {
  const { text } = useLanguage();
  const [state, dispatch] = useActionState(signup, undefined);

  return (
    <div className="w-full max-w-md space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{text.signUp}</h1>
            <p className="mt-2 text-muted-foreground">
                {text.signUpPrompt}
            </p>
        </div>
    
        <form action={dispatch} className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="username">Потребителско име</Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="potrebitel"
                    required
                    className="h-12 rounded-xl"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+359..."
                    required
                    className="h-12 rounded-xl"
                />
            </div>
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
                <Input id="password" name="password" type="password" required className="h-12 rounded-xl" />
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
        <div className="text-center text-sm">
            {text.alreadyHaveAccount}{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
                {text.login}
            </Link>
        </div>
    </div>
  );
}
