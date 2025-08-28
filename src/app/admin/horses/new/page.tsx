
import { PageHeader } from '@/components/page-header';
import { HorseForm } from '../_components/horse-form';

export default function NewHorsePage() {
  return (
    <div>
      <PageHeader
        title="Добавяне на нов кон"
        description="Попълнете формата по-долу, за да добавите нов кон."
      />
      <div className="mt-8">
        <HorseForm />
      </div>
    </div>
  );
}
