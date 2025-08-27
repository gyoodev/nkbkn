
import { notFound } from 'next/navigation';
import { getNewsPost } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { NewsPostForm } from '../../_components/news-form';

export default async function EditNewsPostPage({ params }: { params: { id: string } }) {
  const post = await getNewsPost(params.id);

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <PageHeader
        title="Редактиране на публикация"
        description="Променете данните за новината по-долу."
      />
      <div className="mt-8">
        <NewsPostForm post={post} />
      </div>
    </div>
  );
}
