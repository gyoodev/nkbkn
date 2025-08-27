'use client';

import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { RacePreviewForm } from './components/race-preview-form';

export default function RacePreviewPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.racePreviewPageTitle}
        description={text.racePreviewPageDescription}
      />
      <div className="mt-8">
        <RacePreviewForm />
      </div>
    </div>
  );
}
