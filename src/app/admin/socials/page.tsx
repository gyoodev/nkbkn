
'use client';

import * as React from 'react';
import { useActionState, useEffect, useTransition } from 'react';
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
import { updateSocialLinks, updateDevBannerStatus } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { SocialLink } from '@/lib/types';
import { getSocialLinks, getSiteContent } from '@/lib/client/data';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Запази промените
        </Button>
    );
}

function DevBannerSwitch({ initialIsOn }: { initialIsOn: boolean }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleCheckedChange = (checked: boolean) => {
    startTransition(async () => {
      const { error } = await updateDevBannerStatus(checked);
       if (error) {
        toast({
          variant: 'destructive',
          title: 'Грешка!',
          description: error,
        });
      } else {
        toast({
          title: 'Успех!',
          description: `Банерът за разработка е ${checked ? 'включен' : 'изключен'}.`,
        });
      }
    })
  }

  return (
      <div className="flex items-center space-x-2">
        <Switch 
          id="dev-banner-switch" 
          defaultChecked={initialIsOn}
          onCheckedChange={handleCheckedChange}
          disabled={isPending}
        />
        <Label htmlFor="dev-banner-switch">Покажи банер за разработка</Label>
      </div>
  )
}

export default function AdminSocialsPage() {
    const [socials, setSocials] = React.useState<SocialLink[]>([]);
    const [devBannerVisible, setDevBannerVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const initialState = { success: false, message: '' };
    const [state, dispatch] = useActionState(updateSocialLinks, initialState);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [socialsData, bannerStatus] = await Promise.all([
              getSocialLinks(),
              getSiteContent('dev_banner_visible')
            ]);
            setSocials(socialsData);
            setDevBannerVisible(bannerStatus === 'true');
            setLoading(false);
        }
        loadData();
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
    <div className="space-y-8">
      <PageHeader
        title="Общи настройки"
        description="Управлявайте линковете към социалните мрежи и други общи настройки за сайта."
      />
      <Card>
        <CardHeader>
          <CardTitle>Банер за разработка</CardTitle>
          <CardDescription>
            Включете или изключете банера, който информира потребителите, че сайтът е в процес на разработка.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <div className="h-6 w-32 animate-pulse rounded-md bg-muted" /> : <DevBannerSwitch initialIsOn={devBannerVisible} />}
        </CardContent>
      </Card>
       <form action={dispatch}>
        <Card>
            <CardHeader>
                <CardTitle>Линкове към социални мрежи</CardTitle>
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
