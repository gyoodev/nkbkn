
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/use-language';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitApplication } from './actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { HorseIcon } from '@/components/icons/horse-icon';
import { User } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Изпращане...' : 'Изпрати заявка'}
    </Button>
  );
}

function ApplicationForm({ type }: { type: 'Жокей' | 'Треньор' | 'Кон' }) {
    const { toast } = useToast();
    const initialState = { success: false, message: '' };
    const [state, dispatch] = useActionState(submitApplication, initialState);
    
    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Успех!' : 'Грешка',
                description: state.message,
            });
             if (state.success) {
                // Reset form somehow
                const form = document.getElementById(`form-${type}`) as HTMLFormElement;
                form?.reset();
            }
        }
    }, [state, toast, type]);

    return (
         <form action={dispatch} id={`form-${type}`}>
            <input type="hidden" name="type" value={type} />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`name-${type}`}>Име на {type === 'Кон' ? 'коня' : 'кандидата'}</Label>
                  <Input id={`name-${type}`} name="name" required />
                </div>
                 <div className="space-y-1.5">
                  <Label htmlFor={`email-${type}`}>Имейл за контакт</Label>
                  <Input id={`email-${type}`} name="email" type="email" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`phone-${type}`}>Телефон за контакт</Label>
                <Input id={`phone-${type}`} name="phone" required/>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`message-${type}`}>Допълнителна информация</Label>
                <Textarea id={`message-${type}`} name="message" placeholder="Родословие, постижения, друга релевантна информация..." />
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}


export default function FormsPage() {
    const { text } = useLanguage();

    const tabs = [
        { value: 'jockey', title: 'Заявка за жокей', icon: <User className="h-5 w-5" /> },
        { value: 'trainer', title: 'Заявка за треньор', icon: <User className="h-5 w-5" /> },
        { value: 'horse', title: 'Заявка за кон', icon: <HorseIcon className="h-5 w-5" /> },
    ];

    return (
        <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader
                title="Формуляри за регистрация"
                description="Попълнете съответния формуляр, за да подадете заявка за регистрация. Нашата комисия ще се свърже с вас след преглед на кандидатурата."
            />
            <div className="mt-8">
                <Card>
                    <CardContent className="p-6">
                        <Tabs defaultValue="jockey" className="w-full">
                             <TabsList className="grid w-full grid-cols-3">
                                {tabs.map(tab => (
                                    <TabsTrigger key={tab.value} value={tab.value}>
                                        <span className="sm:hidden">{tab.icon}</span>
                                        <span className="hidden sm:flex items-center">
                                            {tab.icon}
                                            <span className="ml-2">{tab.title}</span>
                                        </span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <TabsContent value="jockey">
                                 <CardHeader className="px-0">
                                    <CardTitle>Заявка за регистрация на жокей</CardTitle>
                                    <CardDescription>Попълнете полетата по-долу. Ще се свържем с вас за следващите стъпки.</CardDescription>
                                </CardHeader>
                                <ApplicationForm type="Жокей" />
                            </TabsContent>
                            <TabsContent value="trainer">
                                 <CardHeader className="px-0">
                                    <CardTitle>Заявка за регистрация на треньор</CardTitle>
                                    <CardDescription>Попълнете полетата по-долу. Ще се свържем с вас за следващите стъпки.</CardDescription>
                                </CardHeader>
                                <ApplicationForm type="Треньор" />
                            </TabsContent>
                            <TabsContent value="horse">
                                 <CardHeader className="px-0">
                                    <CardTitle>Заявка за регистрация на кон</CardTitle>
                                    <CardDescription>Въведете информация за коня. Уверете се, че данните са точни.</CardDescription>
                                </CardHeader>
                                <ApplicationForm type="Кон" />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
