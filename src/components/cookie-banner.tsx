'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Cookie } from 'lucide-react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { text } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'true') {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    setShowBanner(false);
    localStorage.setItem('cookie_consent', 'true');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
             <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <p className="text-sm">
              {text.cookieBannerText}{' '}
              <Link href="/privacy" className="underline hover:text-primary">
                {text.privacyPolicy}
              </Link>
              .
            </p>
          </div>
          <Button onClick={acceptCookies} size="sm" className="flex-shrink-0">
            {text.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
