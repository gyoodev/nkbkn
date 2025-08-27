
import { notFound } from 'next/navigation';
import { getResult } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { ResultsForm } from '../../_components/results-form';

export default async function EditResultPage({ params }: { params: { id: string } }) {
  const result = await getResult(Number(params.id));

  if (!result) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на резултат"
        description="Променете данните за резултата по-долу."
      />
      <div className="mt-8">
        <ResultsForm result={result} />
      </div>
    </div>
  );
}
