
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { EventForm } from '../../_components/event-form';
import { getRaceEvent, getTracks } from '@/lib/server/data';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const [event, tracks] = await Promise.all([
    getRaceEvent(Number(params.id)),
    getTracks()
  ]);
  
  if (!event) {
    return notFound();
  }

  const trackNames = tracks.map(t => t.name);

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
