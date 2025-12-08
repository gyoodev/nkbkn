import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/use-language';
import { DevBanner } from '@/components/dev-banner';
import { CookieBanner } from '@/components/cookie-banner';
import { getSiteContent } from '@/lib/server/data';

export const metadata: Metadata = {
  title: 'НКБКН - Национална комисия за Български конни надбягвания',
  description: 'Official website of the National Commission for Bulgarian Horse Racing.',
  icons: {
    icon: '/img/favicon/favicon.ico',
    shortcut: '/img/favicon/favicon-16x16.png',
    apple: '/img/favicon/apple-touch-icon.png',
  },
  manifest: '/img/favicon/site.webmanifest',
};

async function getBannerVisibility() {
    const value = await getSiteContent('dev_banner_visible');
    return value === 'true';
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const showDevBanner = await getBannerVisibility();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        {showDevBanner && <DevBanner />}
        <LanguageProvider>
            {children}
            <Toaster />
            <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
