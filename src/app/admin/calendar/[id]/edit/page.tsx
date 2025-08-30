
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { EventForm } from '../../_components/event-form';
import { getRaceEvent } from '@/lib/server/data';
import { tracks } from '@/lib/client/data';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await getRaceEvent(Number(params.id));
  const trackNames = tracks.map(t => t.name);

  if (!event) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на събитие"
        description="Променете данните за събитието по-долу."
      />
      <div className="mt-8">
        <EventForm event={event} trackNames={trackNames} />
      </div>
    </div>
  );
}
