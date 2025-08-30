
'use client';

import { PageHeader } from '@/components/page-header';
import { EventForm } from '../_components/event-form';
import { tracks } from '@/lib/client/data';
import { useMemo } from 'react';

export default function NewEventPage() {
  const trackNames = useMemo(() => tracks.map(t => t.name), []);

  return (
    <div>
      <PageHeader
        title="Добавяне на ново събитие"
        description="Попълнете формата по-долу, за да добавите ново състезателно събитие."
      />
      <div className="mt-8">
        <EventForm trackNames={trackNames} />
      </div>
    </div>
  );
}
