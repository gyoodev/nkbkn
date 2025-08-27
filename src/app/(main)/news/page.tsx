import { getNewsPosts } from '@/lib/data';
import type { NewsPost } from '@/lib/types';
import { NewsClientPage } from './components/news-client-page';


export default async function NewsPage() {
  const newsPosts: NewsPost[] = await getNewsPosts();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <NewsClientPage newsPosts={newsPosts} />
    </div>
  );
}
