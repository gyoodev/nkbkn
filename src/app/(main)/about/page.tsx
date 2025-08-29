
'use client';

import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Goal, History } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const { text } = useLanguage();

  const sections = [
    {
      icon: <History className="h-8 w-8 text-primary" />,
      title: 'Нашата история',
      content:
        'Националната комисия за български конни надбягвания е създадена с цел да възроди и развие конните спортове в България, стъпвайки на дългогодишни традиции. От самото си създаване, ние работим за утвърждаването на честни и прозрачни правила в спорта.',
    },
    {
      icon: <Goal className="h-8 w-8 text-primary" />,
      title: 'Нашата мисия',
      content:
        'Нашата мисия е да популяризираме конните надбягвания, да създадем устойчива среда за развитие на коне, жокеи и треньори, както и да осигурим вълнуващи и честни състезания за публиката. Ние се стремим да достигнем най-високите международни стандарти.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Нашият екип',
      content:
        'Екипът на НКБКН се състои от отдадени професионалисти с богат опит в конните спортове, управлението на събития и регулаторната дейност. Всички ние споделяме обща страст към конете и състезанията и работим неуморно за успеха на българските конни надбягвания.',
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.aboutPageTitle}
        description={text.aboutPageDescription}
      />
      <div className="mt-8">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4">
                {section.icon}
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
