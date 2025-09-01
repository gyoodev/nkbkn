
import { PageHeader } from '@/components/page-header';
import { getSiteContent } from '@/lib/server/data';
import { AdminContentClient } from './_components/content-client';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  
  const [history, mission, team, bannerVisible, heroImage, siteLogo] = await Promise.all([
    getSiteContent('about_history'),
    getSiteContent('about_mission'),
    getSiteContent('about_team_text'),
    getSiteContent('dev_banner_visible'),
    getSiteContent('hero_image_url'),
    getSiteContent('site_logo_url'),
  ]);

  const initialContent = {
    about_history: history,
    about_mission: mission,
    about_team_text: team,
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
