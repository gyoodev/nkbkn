
import { PageHeader } from '@/components/page-header';
import { NewsPostForm } from '../_components/news-form';

export default function NewNewsPostPage() {
  return (
    <div>
      <PageHeader
        title="Създаване на нова публикация"
        description="Попълнете формата по-долу, за да създадете нова новина."
      />
      <div className="mt-8">
        <NewsPostForm />
      </div>
    </div>
  );
}
