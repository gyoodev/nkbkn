

import { getNewsPosts, getSiteContent } from '@/lib/server/data';
import type { NewsPost } from '@/lib/types';
import { HomeClientPage } from './components/home-client-page';


export default async function HomePage() {
  const posts: NewsPost[] = await getNewsPosts();
  const heroImageUrl = await getSiteContent('hero_image_url');

  return <HomeClientPage posts={posts} heroImageUrl={heroImageUrl} />;
}
