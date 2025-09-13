
'use client';

import { getNewsPosts } from '@/lib/client/data';
import { NewsClientPage } from './components/news-client-page';
import { useEffect, useState } from 'react';
import type { NewsPost } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/use-language';

function NewsPageSkeleton() {
    return (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden shadow-lg rounded-lg">
                    <Skeleton className="h-56 w-full" />
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function NewsPage() {
  const [newsPosts, setNewsPosts] = useState<Omit<NewsPost, 'comments' | 'content'>[]>([]);
  const [loading, setLoading] = useState(true);
  const { text } = useLanguage();

  useEffect(() => {
      async function loadData() {
          setLoading(true);
          const data = await getNewsPosts();
          setNewsPosts(data);
          setLoading(false);
      }
      loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? <NewsPageSkeleton /> : <NewsClientPage newsPosts={newsPosts} />}
    </div>
  );
}
