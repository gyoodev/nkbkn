import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/use-language';
import { AuthProvider } from '@/hooks/use-auth';
import { DevBanner } from '@/components/dev-banner';
import { CookieBanner } from '@/components/cookie-banner';
import { createServerClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'НКБКН - Национална комисия за Български конни надбягвания',
  description: 'Official website of the National Commission for Bulgarian Horse Racing.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

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
        <DevBanner />
        <LanguageProvider>
          <AuthProvider session={session}>
            {children}
            <Toaster />
            <CookieBanner />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
