import { notFound } from 'next/navigation';
import { getNewsPost } from '@/lib/data';
import { NewsPostClientPage } from './components/news-post-client-page';

export const dynamic = 'force-dynamic';

export default async function NewsPostPage({ params }: { params: { id: string } }) {
  const post = await getNewsPost(params.id);

  if (!post) {
    notFound();
  }

  return <NewsPostClientPage post={post} />;
}
