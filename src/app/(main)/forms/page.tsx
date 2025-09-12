

'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitApplication } from './actions';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { HorseIcon } from '@/components/icons/horse-icon';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
                  <div className="space-y-1.5"><Label htmlFor="first_name">Име</Label><Input id="first_name" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name">Фамилия</Label><Input id="last_name" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth">Дата на раждане</Label><Input id="date_of_birth" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="wins">Победи</Label><Input id="wins" name="wins" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn">ЕГН</Label><Input id="egn" name="egn" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="address">Адрес</Label><Input id="address" name="address" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email">Имейл за контакт</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="phone">Телефон за контакт</Label><Input id="phone" name="phone" required/></div>
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
                  <div className="space-y-1.5"><Label htmlFor="first_name">Име</Label><Input id="first_name" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name">Фамилия</Label><Input id="last_name" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth">Дата на раждане</Label><Input id="date_of_birth" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="wins">Победи</Label><Input id="wins" name="wins" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn">ЕГН</Label><Input id="egn" name="egn" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="address">Адрес</Label><Input id="address" name="address" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="horse_count">Брой коне</Label><Input id="horse_count" name="horse_count" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email">Имейл за контакт</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="phone">Телефон за контакт</Label><Input id="phone" name="phone" required/></div>
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
                  <div className="space-y-1.5"><Label htmlFor="horse_name">Име</Label><Input id="horse_name" name="horse_name" required /></div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gender">Пол</Label>
                    <Select name="gender" required>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Изберете пол" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Кобила">Кобила</SelectItem>
                            <SelectItem value="Жребец">Жребец</SelectItem>
                            <SelectItem value="Кастрат">Кастрат</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label htmlFor="passport_number">Номер на паспорт</Label><Input id="passport_number" name="passport_number" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="age">Възраст</Label><Input id="age" name="age" type="number" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="sire">Баща</Label><Input id="sire" name="sire" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="dam">Майка</Label><Input id="dam" name="dam" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="owner">Собственик</Label><Input id="owner" name="owner" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="mounts">Участия</Label><Input id="mounts" name="mounts" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="wins">Победи</Label><Input id="wins" name="wins" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="email">Имейл за контакт със собственика</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="phone">Телефон за контакт със собственика</Label><Input id="phone" name="phone" required/></div>
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
                  <div className="space-y-1.5"><Label htmlFor="first_name">Име</Label><Input id="first_name" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name">Фамилия</Label><Input id="last_name" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth">Дата на раждане</Label><Input id="date_of_birth" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn">ЕГН</Label><Input id="egn" name="egn" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="address">Адрес</Label><Input id="address" name="address" required /></div>
                   <div className="space-y-1.5"><Label htmlFor="horse_count">Брой коне</Label><Input id="horse_count" name="horse_count" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email">Имейл за контакт</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="phone">Телефон за контакт</Label><Input id="phone" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

type FormType = 'jockey' | 'trainer' | 'owner' | 'horse';

export default function FormsPage() {
    const [activeForm, setActiveForm] = useState<FormType>('jockey');

    const forms: { value: FormType; title: string; description: string; icon: React.ReactNode; component: React.ReactNode }[] = [
        { value: 'jockey', title: 'Заявка за жокей', description: 'Кандидатствайте за лиценз', icon: <User className="h-8 w-8" />, component: <JockeyForm /> },
        { value: 'trainer', title: 'Заявка за треньор', description: 'Кандидатствайте за лиценз', icon: <User className="h-8 w-8" />, component: <TrainerForm /> },
        { value: 'owner', title: 'Заявка за собственик', description: 'Регистрирайте се в системата', icon: <User className="h-8 w-8" />, component: <OwnerForm /> },
        { value: 'horse', title: 'Заявка за кон', description: 'Регистрирайте нов състезателен кон', icon: <HorseIcon className="h-8 w-8" />, component: <HorseForm /> },
    ];
    
    const activeFormData = forms.find(f => f.value === activeForm);

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader
                title="Формуляри за регистрация"
                description="Изберете типа заявка и попълнете съответния формуляр. Нашата комисия ще се свърже с вас след преглед на кандидатурата."
            />
            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {forms.map(form => (
                        <button key={form.value} onClick={() => setActiveForm(form.value)} className="text-left">
                            <Card className={cn(
                                "h-full transition-all duration-300",
                                activeForm === form.value 
                                    ? "ring-2 ring-primary shadow-2xl scale-105" 
                                    : "hover:shadow-lg hover:-translate-y-1"
                            )}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className={cn(
                                        "p-3 rounded-full transition-colors",
                                        activeForm === form.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                    )}>
                                        {form.icon}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{form.title}</CardTitle>
                                    </div>
                                </CardHeader>
                            </Card>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeForm}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeFormData && (
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{activeFormData.title}</CardTitle>
                                    <CardDescription>{activeFormData.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {activeFormData.component}
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
