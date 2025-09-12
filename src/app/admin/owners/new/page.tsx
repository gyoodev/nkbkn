

import { PageHeader } from '@/components/page-header';
import { OwnerForm } from '../_components/owner-form';

export default function NewOwnerPage() {
  return (
    <div>
      <PageHeader
        title="Добавяне на нов собственик"
        description="Попълнете формата по-долу, за да добавите нов собственик."
      />
      <div className="mt-8">
        <OwnerForm />
      </div>
    </div>
  );
}
