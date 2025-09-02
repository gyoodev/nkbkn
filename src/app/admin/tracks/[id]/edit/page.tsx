
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { TrackForm } from '../../_components/track-form';
import { getTrack } from '@/lib/server/data';

export default async function EditTrackPage({ params }: { params: { id: string } }) {
  const track = await getTrack(Number(params.id));

  if (!track) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на хиподрум"
        description="Променете данните за хиподрума по-долу."
      />
      <div className="mt-8">
        <TrackForm track={track} />
      </div>
    </div>
  );
}
