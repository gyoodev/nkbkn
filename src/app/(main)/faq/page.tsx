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
      question: 'Как мога да регистрирам кон, жокей, треньор или собственик?',
      answer:
        'Регистрацията се извършва изцяло онлайн. Отидете в секция "Формуляри", изберете типа заявка, който ви интересува (жокей, треньор, кон или собственик) и попълнете съответните данни. Нашата комисия ще прегледа кандидатурата ви и ще се свърже с вас.',
    },
    {
      question: 'Къде мога да намеря правилниците и други официални документи?',
      answer:
        'Всички официални документи, включително правилници за провеждане на състезания и формуляри за кандидатстване, могат да бъдат намерени и изтеглени от секция "Правилници и Формуляри" в главното меню на сайта.',
    },
    {
      question: 'Как мога да видя резултати от минали състезания?',
      answer:
        'Всички официални резултати се публикуват в секция "Резултати" на нашия уебсайт. Там можете да намерите подробна информация за класирането от проведените надбягвания.',
    },
    {
      question: 'Какво е текущото състояние на хиподрума в с. Гецово?',
      answer:
        'Хиподрумът в момента е в процес на планиране за възстановяване. Нашият екип работи активно, за да бъде готов за Държавното първенство през сезон 2026. Можете да следите напредъка в секция "Новини".',
    },
    {
      question: 'Как се определят датите в състезателния календар?',
      answer:
        'Състезателният календар се изготвя от комисията в началото на всяка година, като се вземат предвид климатичните условия, състоянието на пистите и международни събития. Календарът подлежи на промени, за които уведомяваме своевременно в секция "Календар" и "Новини".',
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
