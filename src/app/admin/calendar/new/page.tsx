
import { PageHeader } from '@/components/page-header';
import { EventForm } from '../_components/event-form';
import { getTracks } from '@/lib/server/data';

export default async function NewEventPage() {
  const tracks = await getTracks();
  const trackNames = tracks.map(t => t.name);

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
