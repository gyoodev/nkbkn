

import { PageHeader } from '@/components/page-header';
import { getSiteContent } from '@/lib/server/data';
import { AdminContentClient } from './_components/content-client';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  
  const [
    history, 
    mission, 
    team, 
    bannerVisible, 
    heroImage, 
    siteLogo, 
    termsContent, 
    privacyContent,
    sliderTitle,
    sliderDesc
  ] = await Promise.all([
    getSiteContent('about_history'),
    getSiteContent('about_mission'),
    getSiteContent('about_team_text'),
    getSiteContent('dev_banner_visible'),
    getSiteContent('hero_image_url'),
    getSiteContent('site_logo_url'),
    getSiteContent('terms_content'),
    getSiteContent('privacy_content'),
    getSiteContent('slider_title'),
    getSiteContent('slider_desc'),
  ]);

  const initialContent = {
    about_history: history,
    about_mission: mission,
    about_team_text: team,
    terms_content: termsContent,
    privacy_content: privacyContent,
    slider_title: sliderTitle,
    slider_desc: sliderDesc
  };

  const initialDevBannerVisible = bannerVisible === 'true';
  
  return (
    <div className="space-y-8">
      <PageHeader
        title="Управление на съдържанието"
        description="Редактирайте текстовете на различни страници и други общи настройки."
      />
      <AdminContentClient 
        initialContent={initialContent}
        initialDevBannerVisible={initialDevBannerVisible}
        initialHeroImageUrl={heroImage}
        initialSiteLogoUrl={siteLogo}
      />
    </div>
  );
}
