

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
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewHorseIcon } from '@/components/icons/new-horse-icon';
import { useLanguage } from '@/hooks/use-language';


function SubmitButton() {
  const { pending } = useFormStatus();
  const { text } = useLanguage();
  return (
    <Button type="submit" className="w-full mt-4" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? text.sending : text.submitApplication}
    </Button>
  );
}

function JockeyForm() {
    const { toast } = useToast();
    const { text } = useLanguage();
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
                  <div className="space-y-1.5"><Label htmlFor="first_name">{text.firstName}</Label><Input id="first_name" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name">{text.lastName}</Label><Input id="last_name" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth">{text.dateOfBirth}</Label><Input id="date_of_birth" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn">{text.egn}</Label><Input id="egn" name="egn" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="address">{text.address}</Label><Input id="address" name="address" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email">{text.contactEmail}</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="phone">{text.contactPhone}</Label><Input id="phone" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

function TrainerForm() {
    const { toast } = useToast();
    const { text } = useLanguage();
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
                  <div className="space-y-1.5"><Label htmlFor="first_name">{text.firstName}</Label><Input id="first_name" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name">{text.lastName}</Label><Input id="last_name" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth">{text.dateOfBirth}</Label><Input id="date_of_birth" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn">{text.egn}</Label><Input id="egn" name="egn" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="address">{text.address}</Label><Input id="address" name="address" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="horse_count">{text.horseCount}</Label><Input id="horse_count" name="horse_count" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email">{text.contactEmail}</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="phone">{text.contactPhone}</Label><Input id="phone" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

function HorseForm() {
    const { toast } = useToast();
    const { text } = useLanguage();
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
                  <div className="space-y-1.5"><Label htmlFor="horse_name">{text.horseName}</Label><Input id="horse_name" name="horse_name" required /></div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gender">{text.gender}</Label>
                    <Select name="gender" required>
                        <SelectTrigger id="gender">
                            <SelectValue placeholder={text.selectGender} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Кобила">{text.mare}</SelectItem>
                            <SelectItem value="Жребец">{text.stallion}</SelectItem>
                            <SelectItem value="Кастрат">{text.gelding}</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label htmlFor="passport_number">{text.passportNumber}</Label><Input id="passport_number" name="passport_number" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="age">{text.age}</Label><Input id="age" name="age" type="number" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="sire">{text.sire}</Label><Input id="sire" name="sire" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="dam">{text.dam}</Label><Input id="dam" name="dam" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="owner">{text.owner}</Label><Input id="owner" name="owner" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="mounts">{text.mounts}</Label><Input id="mounts" name="mounts" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="wins">{text.wins}</Label><Input id="wins" name="wins" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="email">{text.ownerContactEmail}</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="phone">{text.ownerContactPhone}</Label><Input id="phone" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

function OwnerForm() {
    const { toast } = useToast();
    const { text } = useLanguage();
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
                  <div className="space-y-1.5"><Label htmlFor="first_name">{text.firstName}</Label><Input id="first_name" name="first_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="last_name">{text.lastName}</Label><Input id="last_name" name="last_name" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="date_of_birth">{text.dateOfBirth}</Label><Input id="date_of_birth" name="date_of_birth" type="date" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="egn">{text.egn}</Label><Input id="egn" name="egn" required /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="address">{text.address}</Label><Input id="address" name="address" required /></div>
                   <div className="space-y-1.5"><Label htmlFor="horse_count">{text.horseCount}</Label><Input id="horse_count" name="horse_count" type="number" defaultValue={0} required /></div>
                  <div className="space-y-1.5"><Label htmlFor="email">{text.contactEmail}</Label><Input id="email" name="email" type="email" required /></div>
                  <div className="space-y-1.5"><Label htmlFor="phone">{text.contactPhone}</Label><Input id="phone" name="phone" required/></div>
              </div>
              <SubmitButton />
            </div>
          </form>
    )
}

type FormType = 'jockey' | 'trainer' | 'owner' | 'horse';

export default function FormsPage() {
    const [activeForm, setActiveForm] = useState<FormType>('jockey');
    const { text } = useLanguage();

    const forms: { value: FormType; title: string; description: string; icon: React.ReactNode; component: React.ReactNode }[] = [
        { value: 'jockey', title: text.jockeyApplication, description: text.jockeyApplicationDescription, icon: <User className="h-8 w-8" />, component: <JockeyForm /> },
        { value: 'trainer', title: text.trainerApplication, description: text.trainerApplicationDescription, icon: <User className="h-8 w-8" />, component: <TrainerForm /> },
        { value: 'owner', title: text.ownerApplication, description: text.ownerApplicationDescription, icon: <User className="h-8 w-8" />, component: <OwnerForm /> },
        { value: 'horse', title: text.horseApplication, description: text.horseApplicationDescription, icon: <NewHorseIcon className="h-8 w-8" />, component: <HorseForm /> },
    ];
    
    const activeFormData = forms.find(f => f.value === activeForm);

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader
                title={text.registrationForms}
                description={text.registrationFormsDescription}
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
