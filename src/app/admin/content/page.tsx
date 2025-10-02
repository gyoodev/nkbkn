
import { PageHeader } from '@/components/page-header';
import { getSiteContent } from '@/lib/server/data';
import { AdminContentClient } from './_components/content-client';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  
  const [
    about_history, about_history_en,
    about_mission, about_mission_en,
    about_team_text, about_team_text_en,
    terms_content, terms_content_en,
    privacy_content, privacy_content_en,
    slider_title, slider_title_en,
    slider_desc, slider_desc_en,
    terms_title, terms_title_en,
    terms_desc, terms_desc_en,
    privacy_title, privacy_title_en,
    privacy_desc, privacy_desc_en,
    calendar_alert_bg, calendar_alert_en,
    bannerVisible, 
    heroImage, 
    siteLogo, 
  ] = await Promise.all([
    getSiteContent('about_history'), getSiteContent('about_history_en'),
    getSiteContent('about_mission'), getSiteContent('about_mission_en'),
    getSiteContent('about_team_text'), getSiteContent('about_team_text_en'),
    getSiteContent('terms_content'), getSiteContent('terms_content_en'),
    getSiteContent('privacy_content'), getSiteContent('privacy_content_en'),
    getSiteContent('slider_title'), getSiteContent('slider_title_en'),
    getSiteContent('slider_desc'), getSiteContent('slider_desc_en'),
    getSiteContent('terms_title'), getSiteContent('terms_title_en'),
    getSiteContent('terms_desc'), getSiteContent('terms_desc_en'),
    getSiteContent('privacy_title'), getSiteContent('privacy_title_en'),
    getSiteContent('privacy_desc'), getSiteContent('privacy_desc_en'),
    getSiteContent('calendar_alert_bg'), getSiteContent('calendar_alert_en'),
    getSiteContent('dev_banner_visible'),
    getSiteContent('hero_image_url'),
    getSiteContent('site_logo_url'),
  ]);

  const initialContent = {
    about_history, about_history_en,
    about_mission, about_mission_en,
    about_team_text, about_team_text_en,
    terms_content, terms_content_en,
    privacy_content, privacy_content_en,
    slider_title, slider_title_en,
    slider_desc, slider_desc_en,
    terms_title, terms_title_en,
    terms_desc, terms_desc_en,
    privacy_title, privacy_title_en,
    privacy_desc, privacy_desc_en,
    calendar_alert_bg, calendar_alert_en,
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
