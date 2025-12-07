
'use client';

import { signup } from './actions';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { useActionState, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Eye, EyeOff, Terminal, ArrowLeft } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8">
        <Button variant="ghost" asChild className="absolute top-4 left-4 md:top-8 md:left-8">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад към сайта
            </Link>
        </Button>
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
             {state?.error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>What is the error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
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
