
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { OwnerForm } from '../../_components/owner-form';
import { getOwner } from '@/lib/server/data';

export default async function EditOwnerPage({ params }: { params: { id: string } }) {
  const owner = await getOwner(Number(params.id));

  if (!owner) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на собственик"
        description="Променете данните за собственика по-долу."
      />
      <div className="mt-8">
        <OwnerForm owner={owner} />
      </div>
    </div>
  );
}
