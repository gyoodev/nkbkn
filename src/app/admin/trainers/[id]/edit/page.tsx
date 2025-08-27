
import { notFound } from 'next/navigation';
import { getTrainer } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { TrainerForm } from '../../_components/trainer-form';

export default async function EditTrainerPage({ params }: { params: { id: string } }) {
  const trainer = await getTrainer(Number(params.id));

  if (!trainer) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на треньор"
        description="Променете данните за треньора по-долу."
      />
      <div className="mt-8">
        <TrainerForm trainer={trainer} />
      </div>
    </div>
  );
}
