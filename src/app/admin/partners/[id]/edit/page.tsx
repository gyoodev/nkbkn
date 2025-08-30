
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { PartnerForm } from '../../_components/partner-form';
import { getPartner } from '@/lib/server/data';

export default async function EditPartnerPage({ params }: { params: { id: string } }) {
  const partner = await getPartner(Number(params.id));

  if (!partner) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на партньор"
        description="Променете данните за партньора по-долу."
      />
      <div className="mt-8">
        <PartnerForm partner={partner} />
      </div>
    </div>
  );
}
