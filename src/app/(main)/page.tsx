

import { getNewsPosts, getSiteContent } from '@/lib/server/data';
import type { NewsPost } from '@/lib/types';
import { HomeClientPage } from './components/home-client-page';


export default async function HomePage() {
  // Fetch all data in parallel
  const [posts, heroImageUrl, heroTitle, heroSubtitle] = await Promise.all([
    getNewsPosts(),
    getSiteContent('hero_image_url'),
    getSiteContent('slider_title'),
    getSiteContent('hero_subtitle')
  ]);

  return <HomeClientPage 
            posts={posts} 
            heroImageUrl={heroImageUrl}
            heroTitle={heroTitle}
            heroSubtitle={heroSubtitle}
        />;
}
