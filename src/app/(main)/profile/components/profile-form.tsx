
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
import { Loader2, Upload, User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  website: string | null;
  role: string | null;
  avatar_url: string | null;
} | null;

interface ProfileFormProps {
  user: User;
  profile: Profile;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const { text } = useLanguage();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
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
  const initialState = { message: '', error: false };
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
    <Card className="overflow-hidden">
        <form action={dispatch}>
            <div className="grid md:grid-cols-3">
                <div className="md:col-span-1 bg-muted/50 p-6 md:border-r">
                   <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                             <Avatar className="w-32 h-32 text-lg">
                                <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.username ?? user.email} />
                                <AvatarFallback>{(profile?.username || user.email)?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button size="icon" className="absolute bottom-0 right-0 rounded-full" variant="outline">
                                <Upload className="h-4 w-4" />
                                <span className="sr-only">{text.uploadAvatar}</span>
                            </Button>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">{profile?.full_name || profile?.username || 'Потребител'}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'} className="mt-2">
                                {profile?.role === 'admin' ? 'Администратор' : 'Потребител'}
                            </Badge>
                        </div>
                   </div>
                </div>

                <div className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <UserIcon className="h-6 w-6 text-primary" />
                            <CardTitle>{text.profile}</CardTitle>
                        </div>
                        <CardDescription>{text.profilePageDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label htmlFor="username">{text.username}</Label>
                                <Input id="username" name="username" defaultValue={profile?.username || ''} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="fullName">{text.fullName}</Label>
                                <Input id="fullName" name="fullName" defaultValue={profile?.full_name || ''} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="website">{text.website}</Label>
                            <Input id="website" name="website" defaultValue={profile?.website || ''} placeholder="https://..." />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">{text.email}</Label>
                            <Input id="email" name="email" type="email" value={user?.email} disabled />
                        </div>
                    </CardContent>
                     <Separator />
                    <CardFooter className="justify-end p-6">
                        <SubmitButton />
                    </CardFooter>
                </div>
            </div>
        </form>
    </Card>
  );
}
