'use client';

import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { RacePreviewForm } from './components/race-preview-form';

export default function CalendarPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.calendarPageTitle}
        description={text.calendarPageDescription}
      />
      <div className="mt-8">
        <p className="mb-8 text-center text-muted-foreground">{text.racePreviewHelperText}</p>
        <RacePreviewForm />
      </div>
    </div>
  );
}
