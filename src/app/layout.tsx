import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/use-language';
import { DevBanner } from '@/components/dev-banner';
import { CookieBanner } from '@/components/cookie-banner';
import fs from 'fs/promises';
import path from 'path';

export const metadata: Metadata = {
  title: 'НКБКН - Национална комисия за Български конни надбягвания',
  description: 'Official website of the National Commission for Bulgarian Horse Racing.',
};

async function getBannerVisibility() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'config', 'settings.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const settings = JSON.parse(fileContent);
        return settings.dev_banner_visible === true;
    } catch (error: any) {
        // If the file doesn't exist, that's okay, just default to false.
        // This is expected on first run.
        if (error.code !== 'ENOENT') {
            console.error("Could not read settings.json:", error);
        }
        return false;
    }
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
