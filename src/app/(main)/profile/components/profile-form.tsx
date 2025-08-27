
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfile } from '../actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  website: string | null;
  role: string | null;
} | null;

interface ProfileFormProps {
  user: User;
  profile: Profile;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const { text } = useLanguage();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {text.updatingProfile}
        </>
      ) : (
        text.updateProfile
      )}
    </Button>
  );
}


export function ProfileForm({ user, profile }: ProfileFormProps) {
  const { text } = useLanguage();
  const { toast } = useToast();
  const [initialState, setInitialState] = useState({ message: '', error: false });
  const [state, dispatch] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.error ? 'destructive' : 'default',
        title: state.error ? 'Грешка' : 'Успех!',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <form action={dispatch}>
        <CardHeader>
          <CardTitle>{text.profile}</CardTitle>
          <CardDescription>{text.profilePageDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-1.5">
            <Label htmlFor="email">{text.email}</Label>
            <Input id="email" name="email" type="email" value={user?.email} disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username">{text.username}</Label>
            <Input id="username" name="username" defaultValue={profile?.username || ''} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">{text.fullName}</Label>
            <Input id="fullName" name="fullName" defaultValue={profile?.full_name || ''} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website">{text.website}</Label>
            <Input id="website" name="website" defaultValue={profile?.website || ''} />
          </div>
          <div className="space-y-1.5">
            <Label>{text.yourRole}</Label>
            <div>
              <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                {profile?.role || 'user'}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
