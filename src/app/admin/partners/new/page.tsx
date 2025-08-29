
import { PageHeader } from '@/components/page-header';
import { PartnerForm } from '../_components/partner-form';

export default function NewPartnerPage() {
  return (
    <div>
      <PageHeader
        title="Добавяне на нов партньор"
        description="Попълнете формата по-долу, за да добавите нов партньор."
      />
      <div className="mt-8">
        <PartnerForm />
      </div>
    </div>
  );
}
