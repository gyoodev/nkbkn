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
      question: text.faq1_q,
      answer: text.faq1_a,
    },
    {
      question: text.faq2_q,
      answer: text.faq2_a,
    },
    {
      question: text.faq3_q,
      answer: text.faq3_a,
    },
    {
      question: text.faq4_q,
      answer: text.faq4_a,
    },
    {
      question: text.faq5_q,
      answer: text.faq5_a,
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
