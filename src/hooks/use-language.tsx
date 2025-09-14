
'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { translateText } from '@/ai/flows/translate-flow';

type Language = 'bg' | 'en';
type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  text: (key: string) => string;
  isLoaded: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const baseTranslations: Record<Language, Record<string, string>> = {
  bg: {},
  en: {},
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bg');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(true);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'bg' ? 'en' : 'bg'));
    setTranslations({}); // Clear cache on language change
  };

  const text = useCallback((key: string): string => {
    const baseText = baseTranslations['bg'][key] || key;

    if (language === 'bg') {
        return baseText;
    }

    if (translations[key]) {
        return translations[key];
    }
    
    // If we have a translation in the english map, use it
    if (baseTranslations['en'][key]) {
        return baseTranslations['en'][key];
    }

    // Fallback to API
    if (baseText && typeof window !== 'undefined') {
        setIsLoaded(false);
        translateText({ text: baseText, targetLang: language })
            .then(translatedText => {
                if(translatedText) {
                    setTranslations(prev => ({ ...prev, [key]: translatedText }));
                }
            })
            .finally(() => setIsLoaded(true));
    }

    return 'Loading...';

  }, [language, translations]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, text, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
