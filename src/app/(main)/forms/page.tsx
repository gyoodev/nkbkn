
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitApplication } from './actions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { HorseIcon } from '@/components/icons/horse-icon';
import { User } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-4" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Изпращане...' : 'Изпрати заявка'}
    </Button>
  );
}

function JockeyForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
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
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
         <form action={dispatch} ref={formRef}>
            <input type="hidden" name="type" value="Жокей" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label htmlFor="first_name-jockey">Име</Label><Input id="first_name-jockey" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name-jockey">Фамилия</Label><Input id="last_name-jockey" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth-jockey">Дата на раждане</Label><Input id="date_of_birth-jockey" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="wins-jockey">Победи</Label><Input id="wins-jockey" name="wins" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn-jockey">ЕГН</Label><Input id="egn-jockey" name="egn" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="address-jockey">Адрес</Label><Input id="address-jockey" name="address" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email-jockey">Имейл за контакт</Label><Input id="email-jockey" name="email" type="email" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="phone-jockey">Телефон за контакт</Label><Input id="phone-jockey" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

function TrainerForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
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
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
         <form action={dispatch} ref={formRef}>
            <input type="hidden" name="type" value="Треньор" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label htmlFor="first_name-trainer">Име</Label><Input id="first_name-trainer" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name-trainer">Фамилия</Label><Input id="last_name-trainer" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth-trainer">Дата на раждане</Label><Input id="date_of_birth-trainer" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="wins-trainer">Победи</Label><Input id="wins-trainer" name="wins" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn-trainer">ЕГН</Label><Input id="egn-trainer" name="egn" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="address-trainer">Адрес</Label><Input id="address-trainer" name="address" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="horse_count-trainer">Брой коне</Label><Input id="horse_count-trainer" name="horse_count" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email-trainer">Имейл за контакт</Label><Input id="email-trainer" name="email" type="email" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="phone-trainer">Телефон за контакт</Label><Input id="phone-trainer" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

function HorseForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
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
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
         <form action={dispatch} ref={formRef}>
            <input type="hidden" name="type" value="Кон" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label htmlFor="horse_name-horse">Име на коня</Label><Input id="horse_name-horse" name="horse_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="age-horse">Възраст</Label><Input id="age-horse" name="age" type="number" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="sire-horse">Баща</Label><Input id="sire-horse" name="sire" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="dam-horse">Майка</Label><Input id="dam-horse" name="dam" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="owner-horse">Собственик</Label><Input id="owner-horse" name="owner" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="mounts-horse">Участия</Label><Input id="mounts-horse" name="mounts" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="wins-horse">Победи</Label><Input id="wins-horse" name="wins" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="email-horse">Имейл за контакт със собственика</Label><Input id="email-horse" name="email" type="email" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="phone-horse">Телефон за контакт със собственика</Label><Input id="phone-horse" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

function OwnerForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
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
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
         <form action={dispatch} ref={formRef}>
            <input type="hidden" name="type" value="Собственик" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5"><Label htmlFor="first_name-owner">Име</Label><Input id="first_name-owner" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name-owner">Фамилия</Label><Input id="last_name-owner" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth-owner">Дата на раждане</Label><Input id="date_of_birth-owner" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn-owner">ЕГН</Label><Input id="egn-owner" name="egn" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="address-owner">Адрес</Label><Input id="address-owner" name="address" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email-owner">Имейл за контакт</Label><Input id="email-owner" name="email" type="email" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="phone-owner">Телефон за контакт</Label><Input id="phone-owner" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

export default function FormsPage() {
    const tabs = [
        { value: 'jockey', title: 'Заявка за жокей', icon: <User className="h-5 w-5" /> },
        { value: 'trainer', title: 'Заявка за треньор', icon: <User className="h-5 w-5" /> },
        { value: 'owner', title: 'Заявка за собственик', icon: <User className="h-5 w-5" /> },
        { value: 'horse', title: 'Заявка за кон', icon: <HorseIcon className="h-5 w-5" /> },
    ];

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader
                title="Формуляри за регистрация"
                description="Попълнете съответния формуляр, за да подадете заявка за регистрация. Нашата комисия ще се свърже с вас след преглед на кандидатурата."
            />
            <div className="mt-8">
                <Card>
                    <CardContent className="p-6">
                        <Tabs defaultValue="jockey" className="w-full">
                             <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                                {tabs.map(tab => (
                                    <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                                        <span className="sm:hidden">{tab.icon}</span>
                                        <span className="hidden sm:flex items-center">
                                            {tab.icon}
                                            <span className="ml-2">{tab.title}</span>
                                        </span>
                                         <span className="sm:hidden flex items-center md:hidden">
                                             <span className="ml-2">{tab.title}</span>
                                         </span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <TabsContent value="jockey">
                                 <CardHeader className="px-0">
                                    <CardTitle>Формуляр за кандидатстване - Жокеи</CardTitle>
                                    <CardDescription>Попълнете полетата по-долу. Ще се свържем с вас за следващите стъпки.</CardDescription>
                                </CardHeader>
                                <JockeyForm />
                            </TabsContent>
                            <TabsContent value="trainer">
                                 <CardHeader className="px-0">
                                    <CardTitle>Формуляр за кандидатстване - Треньори</CardTitle>
                                    <CardDescription>Попълнете полетата по-долу. Ще се свържем с вас за следващите стъпки.</CardDescription>
                                </CardHeader>
                                <TrainerForm />
                            </TabsContent>
                             <TabsContent value="owner">
                                 <CardHeader className="px-0">
                                    <CardTitle>Формуляр за кандидатстване - Собственици</CardTitle>
                                    <CardDescription>Попълнете полетата по-долу. Ще се свържем с вас за следващите стъпки.</CardDescription>
                                </CardHeader>
                                <OwnerForm />
                            </TabsContent>
                            <TabsContent value="horse">
                                 <CardHeader className="px-0">
                                    <CardTitle>Формуляр за кандидатстване - Коне</CardTitle>
                                    <CardDescription>Въведете информация за коня. Уверете се, че данните са точни.</CardDescription>
                                </CardHeader>
                                <HorseForm />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
