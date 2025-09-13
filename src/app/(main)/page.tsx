


import { getSiteContent } from '@/lib/server/data';
import type { NewsPost } from '@/lib/types';
import { HomeClientPage } from './components/home-client-page';
import { createServerClient } from '@/lib/supabase/server';


export default async function HomePage() {
  const supabase = createServerClient();
  const { data: newsData, error } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
  const posts: NewsPost[] = (newsData || []).map((post: any) => ({ ...post, href: `/news/${post.id}`}));
  
  // Fetch all data in parallel
  const [
    heroImageUrl, 
    heroTitleBg, 
    heroTitleEn,
    heroSubtitleBg,
    heroSubtitleEn
  ] = await Promise.all([
    getSiteContent('hero_image_url'),
    getSiteContent('slider_title_bg'),
    getSiteContent('slider_title_en'),
    getSiteContent('slider_desc_bg'),
    getSiteContent('slider_desc_en')
  ]);

  return <HomeClientPage 
            posts={posts} 
            heroImageUrl={heroImageUrl}
            heroTitle={{ bg: heroTitleBg, en: heroTitleEn }}
            heroSubtitle={{ bg: heroSubtitleBg, en: heroSubtitleEn }}
        />;
}
