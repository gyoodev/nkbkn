
import { PageHeader } from '@/components/page-header';
import { getSiteContent } from '@/lib/server/data';
import { AdminContentClient } from './_components/content-client';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  
  const [
    history_bg, history_en,
    mission_bg, mission_en,
    team_bg, team_en,
    terms_content, terms_content_en,
    privacy_content, privacy_content_en,
    slider_title_bg, slider_title_en,
    slider_desc_bg, slider_desc_en,
    bannerVisible, 
    heroImage, 
    siteLogo, 
  ] = await Promise.all([
    getSiteContent('about_history'), getSiteContent('about_history_en'),
    getSiteContent('about_mission'), getSiteContent('about_mission_en'),
    getSiteContent('about_team_text'), getSiteContent('about_team_text_en'),
    getSiteContent('terms_content'), getSiteContent('terms_content_en'),
    getSiteContent('privacy_content'), getSiteContent('privacy_content_en'),
    getSiteContent('slider_title_bg'), getSiteContent('slider_title_en'),
    getSiteContent('slider_desc_bg'), getSiteContent('slider_desc_en'),
    getSiteContent('dev_banner_visible'),
    getSiteContent('hero_image_url'),
    getSiteContent('site_logo_url'),
  ]);

  const initialContent = {
    about_history_bg: history_bg, about_history_en: history_en,
    about_mission_bg: mission_bg, about_mission_en: mission_en,
    about_team_text_bg: team_bg, about_team_text_en: team_en,
    terms_content_bg: terms_content, terms_content_en: terms_content_en,
    privacy_content_bg: privacy_content, privacy_content_en: privacy_content_en,
    slider_title_bg: slider_title_bg, slider_title_en: slider_title_en,
    slider_desc_bg: slider_desc_bg, slider_desc_en: slider_desc_en,
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
