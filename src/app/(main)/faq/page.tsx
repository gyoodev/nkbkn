'use client';

import { PageHeader } from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/hooks/use-language';

export default function FaqPage() {
  const { text } = useLanguage();

  const faqItems = [
    {
      question: 'Как мога да регистрирам кон за състезание?',
      answer:
        'Регистрацията на коне се извършва чрез попълване на съответния формуляр в секция "Формуляри". Необходимо е да предоставите пълна информация за коня, включително родословие и данни за собственика.',
    },
    {
      question: 'Какви са изискванията за участие на жокеи?',
      answer:
        'Жокеите трябва да притежават валиден лиценз и да отговарят на медицинските изисквания, определени в правилника на комисията. Пълна информация можете да намерите в секция "Правилници".',
    },
    {
      question: 'Къде мога да намеря резултати от минали състезания?',
      answer:
        'Всички официални резултати от проведените състезания се публикуват в секция "Резултати" на нашия уебсайт непосредствено след края на състезателния ден.',
    },
    {
      question: 'Как се определят датите в състезателния календар?',
      answer:
        'Състезателният календар се изготвя от комисията в началото на всяка година, като се вземат предвид климатичните условия, състоянието на пистите и международни събития. Календарът подлежи на промени, за които уведомяваме своевременно.',
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.faqTitle}
        description={text.faqDescription}
      />
      <div className="mt-8">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
