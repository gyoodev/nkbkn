
import { notFound } from 'next/navigation';
import { getJockey } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { JockeyForm } from '../../_components/jockey-form';

export default async function EditJockeyPage({ params }: { params: { id: string } }) {
  const jockey = await getJockey(Number(params.id));

  if (!jockey) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на жокей"
        description="Променете данните за жокея по-долу."
      />
      <div className="mt-8">
        <JockeyForm jockey={jockey} />
      </div>
    </div>
  );
}
