

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Facebook, Instagram, Share2, Loader2 } from 'lucide-react';
import type { SocialLink } from '@/lib/types';
import { useState } from 'react';
import { getSocialLinks } from '@/lib/client/data';
import { submitContactForm } from './actions';
import { useToast } from '@/hooks/use-toast';

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props} fill="currentColor">
            <path d="M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z"/>
        </svg>
    )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props} fill="currentColor">
            <path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z"/>
        </svg>
    )
}

function SocialIcon({ name, ...props }: { name: SocialLink['name'] } & React.SVGProps<SVGSVGElement>) {
    switch (name) {
        case 'TikTok': return <TiktokIcon {...props} />;
        case 'Facebook': return <Facebook {...props} />;
        case 'Instagram': return <Instagram {...props} />;
        case 'Youtube': return <YoutubeIcon {...props} />;
        default: return <Share2 {...props} />;
    }
}

function SubmitButton() {
    const { pending } = useFormStatus();
    const { text } = useLanguage();
    return (
         <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Изпращане...' : text.submit}
        </Button>
    )
}

export default function ContactPage() {
  const { text } = useLanguage();
  const { toast } = useToast();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const initialState = { success: false, message: '' };
  const [state, dispatch] = useActionState(submitContactForm, initialState);

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
          if(state.success) {
              formRef.current?.reset();
          }
      }
  }, [state, toast])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.contactPageTitle}
        description={text.contactPageDescription}
      />
      <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{text.sendMessage}</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={dispatch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">Име</Label>
                  <Input type="text" id="name" name="name" placeholder="Вашето име" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Имейл</Label>
                  <Input type="email" id="email" name="email" placeholder="email@example.com" required />
                </div>
              </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="topic">Тема</Label>
                  <Input type="text" id="topic" name="topic" placeholder="Относно..." />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Телефон (по избор)</Label>
                  <Input type="tel" id="phone" name="phone" placeholder="+359..." />
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="message">Съобщение</Label>
                <Textarea id="message" name="message" placeholder="Вашето съобщение тук..." required rows={5} />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{text.findUs}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {text.appNameFull}<br/>
                        {text.addressStreet}<br/>
                        {text.addressCity}
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{text.followUs}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4">
                        {socials.map((social) => (
                        <Button key={social.id} variant="outline" size="icon" asChild>
                            <a href={social.url} target="_blank" rel="noopener noreferrer">
                                <SocialIcon name={social.name} className="h-6 w-6" />
                            </a>
                        </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
