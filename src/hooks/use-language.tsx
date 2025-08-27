'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type Language = 'bg' | 'en';
type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  text: Record<string, string>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  bg: {
    // General
    appName: 'НКБКН',
    appNameFull: 'Национална комисия за Български конни надбягвания',
    contactUs: 'Свържете се с нас',
    // Sidebar
    home: 'Начало',
    jockeys: 'Жокеи',
    trainers: 'Треньори',
    horses: 'Коне',
    tracks: 'Хиподруми',
    gallery: 'Галерия',
    racePreview: 'Превю на състезание',
    contact: 'Контакти',
    // Pages
    homeTitle: 'Добре дошли в НКБКН',
    homeSubtitle: 'Официалният дом на българските конни надбягвания.',
    homeDescription: 'Разгледайте профили на жокеи, треньори и коне. Намерете информация за писти, разгледайте галерии от състезания и генерирайте прегледи на предстоящи събития.',
    exploreJockeys: 'Разгледайте жокеите',
    exploreTrainers: 'Разгледайте треньорите',
    viewGallery: 'Вижте галерията',
    generatePreview: 'Генерирай превю',
    jockeysPageTitle: 'Профили на жокеи',
    jockeysPageDescription: 'Статистики и информация за водещите жокеи в България.',
    trainersPageTitle: 'Профили на треньори',
    trainersPageDescription: 'Постижения и информация за най-добрите треньори.',
    horsesPageTitle: 'База данни с коне',
    horsesPageDescription: 'Регистрирани състезателни коне, родословие и минали резултати.',
    tracksPageTitle: 'Локатор на писти',
    tracksPageDescription: 'Интерактивна карта и информация за пистите в България.',
    galleryPageTitle: 'Галерия от състезания',
    galleryPageDescription: 'Подбрана колекция от снимки и видеа от минали състезания.',
    racePreviewPageTitle: 'Генератор на превюта за състезания',
    racePreviewPageDescription: 'Използвайте нашия AI инструмент за генериране на прегледи за предстоящи събития.',
    contactPageTitle: 'Информация за контакт',
    contactPageDescription: 'Изпратете ни запитване или ни последвайте в социалните мрежи.',
    // Forms & Buttons
    submit: 'Изпрати',
    name: 'Име',
    email: 'Имейл',
    message: 'Съобщение',
    // Horse Table
    horseName: 'Име на коня',
    sire: 'Баща',
    dam: 'Майка',
    age: 'Възраст',
    owner: 'Собственик',
    // Race Preview Form
    raceName: 'Име на състезанието',
    trackName: 'Име на пистата',
    date: 'Дата',
    time: 'Час',
    horseNames: 'Имена на конете (разделени със запетая)',
    jockeyNames: 'Имена на жокеите (разделени със запетая)',
    trainerNames: 'Имена на треньорите (разделени със запетая)',
    raceDescription: 'Описание на състезанието (по избор)',
    generate: 'Генерирай',
    generating: 'Генериране...',
    generatedPreview: 'Генерирано превю',
  },
  en: {
    // General
    appName: 'NCBHR',
    appNameFull: 'National Commission for Bulgarian Horse Racing',
    contactUs: 'Contact Us',
    // Sidebar
    home: 'Home',
    jockeys: 'Jockeys',
    trainers: 'Trainers',
    horses: 'Horses',
    tracks: 'Tracks',
    gallery: 'Gallery',
    racePreview: 'Race Preview',
    contact: 'Contact',
    // Pages
    homeTitle: 'Welcome to NCBHR',
    homeSubtitle: 'The official home of Bulgarian horse racing.',
    homeDescription: 'Explore profiles of jockeys, trainers, and horses. Find information on tracks, view race galleries, and generate previews for upcoming events.',
    exploreJockeys: 'Explore Jockeys',
    exploreTrainers: 'Explore Trainers',
    viewGallery: 'View Gallery',
    generatePreview: 'Generate Preview',
    jockeysPageTitle: 'Jockey Profiles',
    jockeysPageDescription: 'Statistics and information about the leading jockeys in Bulgaria.',
    trainersPageTitle: 'Trainer Profiles',
    trainersPageDescription: 'Achievements and information about the top trainers.',
    horsesPageTitle: 'Horse Database',
    horsesPageDescription: 'Registered racehorses, lineage, and past results.',
    tracksPageTitle: 'Track Locator',
    tracksPageDescription: 'Interactive map and information about tracks in Bulgaria.',
    galleryPageTitle: 'Race Gallery',
    galleryPageDescription: 'A curated collection of photos and videos from past races.',
    racePreviewPageTitle: 'Race Preview Generator',
    racePreviewPageDescription: 'Use our AI tool to generate previews for upcoming events.',
    contactPageTitle: 'Contact Information',
    contactPageDescription: 'Send us an inquiry or follow us on social media.',
    // Forms & Buttons
    submit: 'Submit',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    // Horse Table
    horseName: 'Horse Name',
    sire: 'Sire',
    dam: 'Dam',
    age: 'Age',
    owner: 'Owner',
    // Race Preview Form
    raceName: 'Race Name',
    trackName: 'Track Name',
    date: 'Date',
    time: 'Time',
    horseNames: 'Horse Names (comma-separated)',
    jockeyNames: 'Jockey Names (comma-separated)',
    trainerNames: 'Trainer Names (comma-separated)',
    raceDescription: 'Race Description (optional)',
    generate: 'Generate',
    generating: 'Generating...',
    generatedPreview: 'Generated Preview',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bg');

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'bg' ? 'en' : 'bg'));
  };

  const text = useMemo(() => translations[language], [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, text }}>
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
