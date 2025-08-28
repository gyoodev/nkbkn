
import { notFound } from 'next/navigation';
import { getHorse } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { HorseForm } from '../../_components/horse-form';

export default async function EditHorsePage({ params }: { params: { id: string } }) {
  const horse = await getHorse(Number(params.id));

  if (!horse) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на кон"
        description="Променете данните за коня по-долу."
      />
      <div className="mt-8">
        <HorseForm horse={horse} />
      </div>
    </div>
  );
}
