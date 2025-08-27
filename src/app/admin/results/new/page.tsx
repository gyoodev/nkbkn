
import { PageHeader } from '@/components/page-header';
import { ResultsForm } from '../_components/results-form';

export default function NewResultPage() {
  return (
    <div>
      <PageHeader
        title="Добавяне на нов резултат"
        description="Попълнете формата по-долу, за да добавите нов резултат от състезание."
      />
      <div className="mt-8">
        <ResultsForm />
      </div>
    </div>
  );
}
