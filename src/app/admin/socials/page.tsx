
'use client';

import * as React from 'react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateSocialLinks } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { SocialLink } from '@/lib/types';
import { getSocialLinks } from '@/lib/client/data';


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Запази промените
        </Button>
    );
}


export default function AdminSocialsPage() {
    const [socials, setSocials] = React.useState<SocialLink[]>([]);
    const { toast } = useToast();

    const initialState = { success: false, message: '' };
    const [state, dispatch] = useActionState(updateSocialLinks, initialState);

    useEffect(() => {
        async function loadSocials() {
            const data = await getSocialLinks();
            setSocials(data);
        }
        loadSocials();
    }, []);

    useEffect(() => {
        if(state.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Успех!' : 'Грешка',
                description: state.message,
            });
        }
    }, [state, toast])


  return (
    <div>
      <PageHeader
        title="Настройки на социални мрежи"
        description="Управлявайте линковете към вашите профили в социалните мрежи."
      />
       <form action={dispatch}>
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Линкове</CardTitle>
                <CardDescription>
                Поставете пълните URL адреси за всяка социална мрежа.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {socials.map((social) => (
                    <div key={social.id} className="space-y-1.5">
                        <Label htmlFor={`social-${social.id}`}>{social.name}</Label>
                        <Input
                            id={`social-${social.id}`}
                            name={`social-${social.id}`}
                            defaultValue={social.url}
                            placeholder="https://..."
                        />
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <SubmitButton />
            </CardFooter>
        </Card>
      </form>
    </div>
  );
}
