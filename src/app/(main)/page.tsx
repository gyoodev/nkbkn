import { getNewsPosts } from '@/lib/data';
import type { NewsPost } from '@/lib/types';
import { HomeClientPage } from './components/home-client-page';

export default async function HomePage() {
  const posts: NewsPost[] = await getNewsPosts();

  return <HomeClientPage posts={posts} />;
}
