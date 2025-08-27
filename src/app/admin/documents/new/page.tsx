import { PageHeader } from '@/components/page-header';
import { DocumentForm } from '../_components/document-form';

export default function NewDocumentPage() {
  return (
    <div>
      <PageHeader
        title="Качване на нов документ"
        description="Попълнете формата по-долу, за да качите нов файл."
      />
      <div className="mt-8">
        <DocumentForm />
      </div>
    </div>
  );
}
