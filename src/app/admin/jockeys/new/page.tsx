
import { PageHeader } from '@/components/page-header';
import { JockeyForm } from '../_components/jockey-form';

export default function NewJockeyPage() {
  return (
    <div>
      <PageHeader
        title="Добавяне на нов жокей"
        description="Попълнете формата по-долу, за да добавите нов жокей."
      />
      <div className="mt-8">
        <JockeyForm />
      </div>
    </div>
  );
}
