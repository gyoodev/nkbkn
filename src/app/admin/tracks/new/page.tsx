
import { PageHeader } from '@/components/page-header';
import { TrackForm } from '../_components/track-form';

export default function NewTrackPage() {
  return (
    <div>
      <PageHeader
        title="Добавяне на нов хиподрум"
        description="Попълнете формата по-долу, за да добавите нов хиподрум."
      />
      <div className="mt-8">
        <TrackForm />
      </div>
    </div>
  );
}
