
import { PageHeader } from '@/components/page-header';
import { ResultsForm } from '../_components/results-form';
import { getTracks } from '@/lib/server/data';

export default async function NewResultPage() {
  const tracks = await getTracks();
  const trackNames = tracks.map(t => t.name);
  
  return (
    <div>
      <PageHeader
        title="Добавяне на нов резултат"
        description="Попълнете формата по-долу, за да добавите нов резултат от състезание."
      />
      <div className="mt-8">
        <ResultsForm trackNames={trackNames} />
      </div>
    </div>
  );
}
