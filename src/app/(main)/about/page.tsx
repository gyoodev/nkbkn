
'use client';

import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Goal, History } from 'lucide-react';

export default function AboutPage() {
  const { text } = useLanguage();

  const sections = [
    {
      icon: <History className="h-10 w-10 text-primary" />,
      title: 'Нашата история',
      content:
        'Националната комисия за български конни надбягвания е създадена с цел да възроди и развие конните спортове в България, стъпвайки на дългогодишни традиции. От самото си създаване, ние работим за утвърждаването на честни и прозрачни правила в спорта.',
      className: 'md:col-span-2',
    },
    {
      icon: <Goal className="h-10 w-10 text-primary" />,
      title: 'Нашата мисия',
      content:
        'Нашата мисия е да популяризираме конните надбягвания, да създадем устойчива среда за развитие на коне, жокеи и треньори, както и да осигурим вълнуващи и честни състезания за публиката. Ние се стремим да достигнем най-високите международни стандарти.',
      className: 'md:col-span-1',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Нашият екип',
      content:
        'Екипът на НКБКН се състои от отдадени професионалисти с богат опит в конните спортове, управлението на събития и регулаторната дейност. Всички ние споделяме обща страст към конете и състезанията и работим неуморно за успеха на българските конни надбягвания.',
      className: 'md:col-span-3',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gray-50/50 dark:bg-gray-950/50">
       <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25px 25px, hsl(var(--primary)) 2%, transparent 0%), radial-gradient(circle at 75px 75px, hsl(var(--primary)) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
        />
      <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <PageHeader
          title={text.aboutPageTitle}
          description="Научете повече за нашата история, мисия и хората, които стоят зад Националната комисия за български конни надбягвания."
          className="text-center mb-12"
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {sections.map((section, index) => (
            <Card key={index} className={`transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl bg-background/80 backdrop-blur-sm border-border/50 ${section.className}`}>
              <CardHeader className="flex flex-col items-center text-center gap-4 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    {section.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-center">
                <p className="text-base text-muted-foreground">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
