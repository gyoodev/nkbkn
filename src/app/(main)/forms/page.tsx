

'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { NewHorseIcon } from '@/components/icons/new-horse-icon';
import { useLanguage } from '@/hooks/use-language';
import { JockeyForm } from './_components/jockey-form';
import { TrainerForm } from './_components/trainer-form';
import { OwnerForm } from './_components/owner-form';
import { HorseForm } from './_components/horse-form';

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
