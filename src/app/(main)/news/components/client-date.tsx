'use client';

import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState } from 'react';

export function ClientDate({ dateString }: { dateString: string }) {
  const { language } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (date: string) => {
    if (!isClient) {
      return new Date(date).toLocaleDateString('en-CA');
    }
    return new Date(date).toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  };

  return <>{formatDate(dateString)}</>;
}
