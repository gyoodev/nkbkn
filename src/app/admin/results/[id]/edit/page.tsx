
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { ResultsForm } from '../../_components/results-form';
import { getResult, getTracks } from '@/lib/server/data';

export default async function EditResultPage({ params }: { params: { id: string } }) {
  const [result, tracks] = await Promise.all([
    getResult(Number(params.id)),
    getTracks()
  ]);

  if (!result) {
    return notFound();
  }

  const trackNames = tracks.map(t => t.name);

  return (
    <div>
      <PageHeader
        title="Редактиране на резултат"
        description="Променете данните за резултата по-долу."
      />
      <div className="mt-8">
        <ResultsForm result={result} trackNames={trackNames} />
      </div>
    </div>
  );
}
