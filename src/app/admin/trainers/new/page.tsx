
import { PageHeader } from '@/components/page-header';
import { TrainerForm } from '../_components/trainer-form';

export default function NewTrainerPage() {
  return (
    <div>
      <PageHeader
        title="Добавяне на нов треньор"
        description="Попълнете формата по-долу, за да добавите нов треньор."
      />
      <div className="mt-8">
        <TrainerForm />
      </div>
    </div>
  );
}
