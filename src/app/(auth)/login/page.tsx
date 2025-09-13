'use client';

import { login } from './actions';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { useActionState, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Eye, EyeOff, Terminal } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="space-y-2 relative">
            <Label htmlFor="password">{text.password}</Label>
            <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required className="h-12 rounded-xl pr-10"/>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-7 h-8 w-8 text-muted-foreground"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span className="sr-only">{showPassword ? 'Скрий паролата' : 'Покажи паролата'}</span>
            </Button>
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
