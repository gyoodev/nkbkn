
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
    language: 'Език',
    bulgarian: 'Български',
    english: 'English',
    allRightsReserved: 'Всички права запазени',
    developedBy: 'Разработено от GKDEV',
    accept: 'Приемам',
    privacyPolicy: 'Политика за поверителност',
    cookieBannerText: 'Този уебсайт използва бисквитки, за да подобри вашето потребителско изживяване. Като продължавате да използвате сайта, вие се съгласявате с нашата',

    // Header & Nav
    siteHeader: 'Конни надбягвания в България',

    // Hero
    heroTitle: 'СТРАСТ, АДРЕНАЛИН И ЛЮБОВ КЪМ КОНЕТЕ',
    raceCalendar: 'Календар на състезанията',
    latestNews: 'Последни новини',

    // News Section
    latestFromTheTrack: 'Последни новини от пистата',
    latestFromTheTrackDescription: 'Бъдете в крак с всички събития от света на конните надбягвания в България.',
    readMore: 'Прочети повече',

    // Footer
    aboutUs: 'За нас',
    history: 'История',
    mission: 'Мисия',
    team: 'Екип',
    races: 'Състезания',
    calendar: 'Календар',
    results: 'Резултати',
    news: 'Новини',
    resources: 'Ресурси',
    regulations: 'Правилници',
    forms: 'Формуляри',
    newsletter: 'Бюлетин',
    newsletterSubscribe: 'Абонирайте се за нашия бюлетин, за да получавате последните новини.',
    yourEmail: 'Вашият имейл',
    subscribe: 'Абонирай се',

    // Sidebar & Auth
    home: 'Начало',
    aboutCommissionShort: 'НКБКН',
    jockeys: 'Жокеи',
    trainers: 'Треньoри',
    horses: 'Коне',
    tracks: 'Хиподрум',
    gallery: 'Галерия',
    racePreview: 'Превю на състезание',
    contact: 'Контакти',
    login: 'Вход',
    logout: 'Изход',
    profile: 'Профил',
    loginPrompt: 'Въведете вашия имейл по-долу, за да влезете в профила си.',
    loggingIn: 'Влизане...',
    noAccount: 'Нямате акаунт?',
    signUp: 'Регистрация',
    signUpPrompt: 'Въведете вашата информация, за да създадете акаунт.',
    signingUp: 'Регистриране...',
    alreadyHaveAccount: 'Вече имате акаунт?',
    adminPanel: 'Админ панел',


    // Pages
    homeTitle: 'Добре дошли в НКБКН',
    homeSubtitle: 'Официалният дом на българските конни надбягвания.',
    homeDescription: 'Разгледайте профили на жокеи, треньори и коне. Намерете информация за писти, разгледайте галерии от състезания и генерирайте прегледи на предстоящи събития.',
    aboutPageTitle: 'За комисията',
    aboutPageDescription: 'Мисия, цели и структура на Националната комисия за български конни надбягвания.',
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
    calendarPageTitle: 'Календар на състезанията',
    calendarPageDescription: 'Вижте предстоящите състезания и информация за тях.',
    racePreviewHelperText: 'Тук ще бъде показан календарът със състезания. Междувременно, можете да използвате формата по-долу, за да генерирате превю за конкретно състезание.',
    contactPageTitle: 'Информация за контакт',
    contactPageDescription: 'Изпратете ни запитване или ни последвайте в социалните мрежи.',
    profilePageTitle: 'Вашият профил',
    profilePageDescription: 'Преглеждайте и актуализирайте информацията за вашия профил.',
    updateProfile: 'Актуализирай профила',
    updatingProfile: 'Актуализиране...',
    profileUpdated: 'Профилът е актуализиран успешно!',
    username: 'Потребителско име',
    fullName: 'Пълно име',
    website: 'Уебсайт',
    yourRole: 'Вашата роля',

    // Forms & Buttons
    submit: 'Изпрати',
    name: 'Име',
    email: 'Имейл',
    password: 'Парола',
    message: 'Съобщение',
    sendMessage: 'Изпратете ни съобщение',
    findUs: 'Намерете ни',
    followUs: 'Последвайте ни',
    addressStreet: 'ул. "Състезателна" 1',
    addressCity: '1000 София, България',

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
    raceDetails: 'Данни за състезанието',
    raceDetailsDescription: 'Попълнете формата, за да генерирате превю.',
    generatedPreviewDescription: 'Генерираното от AI превю ще се появи тук.',
    noPreviewGenerated: 'Все още няма генерирано превю.',

    // Jockeys Page
    wins: 'Победи',
    mounts: 'Участия',
    winRate: 'Процент победи',
    
    // Trainers Page
    achievements: 'Постижения',
    
    // Tracks Page
    interactiveMapComingSoon: 'Интерактивна карта - скоро',

    // News Post Page
    views: 'Прочитания',
    likes: 'Харесвания',
    comments: 'Коментари',
    like: 'Харесай',
    shareYourThoughts: 'Споделете мнението си',
    writeCommentPlaceholder: 'Напишете коментар...',
    postComment: 'Публикувай коментар',

    // Calendar Page new
    racesFor: 'Състезания за',
    noRacesScheduled: 'Няма планирани състезания за тази дата.',
    selectDateWithRaces: 'Изберете дата с маркирани събития, за да видите състезанията.',
    participants: 'участници',

    // Legal pages
    termsTitle: 'Условия и правила за ползване',
    termsDescription: 'Моля, прочетете внимателно нашите условия и правила.',
    privacyTitle: 'Политика за поверителност',
    privacyDescription: 'Вашата поверителност е важна за нас.',
    faqTitle: 'Често задавани въпроси',
    faqDescription: 'Намерете отговори на най-често задаваните въпроси.',
    termsShort: 'Условия за ползване',
    privacyShort: 'Поверителност',
    faq: 'ЧЗВ',
    ourTrustedPartners: 'Нашите доверени партньори',
  },
  en: {
    // General
    appName: 'NCBHR',
    appNameFull: 'National Commission for Bulgarian Horse Racing',
    contactUs: 'Contact Us',
    language: 'Language',
    bulgarian: 'Български',
    english: 'English',
    allRightsReserved: 'All rights reserved',
    developedBy: 'Developed by GKDEV',
    accept: 'Accept',
    privacyPolicy: 'Privacy Policy',
    cookieBannerText: 'This website uses cookies to enhance your user experience. By continuing to use the site, you agree to our',

    // Header & Nav
    siteHeader: 'Horse Racing in Bulgaria',

    // Hero
    heroTitle: 'PASSION, ADRENALINE AND LOVE FOR HORSES',
    raceCalendar: 'Race Calendar',
    latestNews: 'Latest News',

    // News Section
    latestFromTheTrack: 'Latest From The Track',
    latestFromTheTrackDescription: 'Stay up to date with all horse racing events in Bulgaria.',
    readMore: 'Read More',

    // Footer
    aboutUs: 'About Us',
    history: 'History',
    mission: 'Mission',
    team: 'Team',
    races: 'Races',
    calendar: 'Calendar',
    results: 'Results',
    news: 'News',
    resources: 'Resources',
    regulations: 'Regulations',
    forms: 'Forms',
    newsletter: 'Newsletter',
    newsletterSubscribe: 'Subscribe to our newsletter to get the latest news.',
    yourEmail: 'Your Email',
    subscribe: 'Subscribe',

    // Sidebar & Auth
    home: 'Home',
    aboutCommissionShort: 'NCBHR',
    jockeys: 'Jockeys',
    trainers: 'Trainers',
    horses: 'Horses',
    tracks: 'Track',
    gallery: 'Gallery',
    racePreview: 'Race Preview',
    contact: 'Contact',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    loginPrompt: 'Enter your email below to login to your account.',
    loggingIn: 'Logging in...',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    signUpPrompt: 'Enter your information to create an account.',
    signingUp: 'Signing up...',
    alreadyHaveAccount: 'Already have an account?',
    adminPanel: 'Admin Panel',

    // Pages
    homeTitle: 'Welcome to NCBHR',
    homeSubtitle: 'The official home of Bulgarian horse racing.',
    homeDescription: 'Explore profiles of jockeys, trainers, and horses. Find information on tracks, view race galleries, and generate previews for upcoming events.',
    aboutPageTitle: 'About the Commission',
    aboutPageDescription: 'Mission, goals, and structure of the National Commission for Bulgarian Horse Racing.',
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
    calendarPageTitle: 'Race Calendar',
    calendarPageDescription: 'See upcoming races and information about them.',
    racePreviewHelperText: 'The race calendar will be displayed here. In the meantime, you can use the form below to generate a preview for a specific race.',
    contactPageTitle: 'Contact Information',
    contactPageDescription: 'Send us an inquiry or follow us on social media.',
    profilePageTitle: 'Your Profile',
    profilePageDescription: 'View and update your profile information.',
    updateProfile: 'Update Profile',
    updatingProfile: 'Updating...',
    profileUpdated: 'Profile updated successfully!',
    username: 'Username',
    fullName: 'Full Name',
    website: 'Website',
    yourRole: 'Your Role',

    // Forms & Buttons
    submit: 'Submit',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    message: 'Message',
    sendMessage: 'Send us a message',
    findUs: 'Find Us',
    followUs: 'Follow Us',
    addressStreet: '1 "Sastezatelna" Str.',
    addressCity: '1000 Sofia, Bulgaria',

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
    raceDetails: 'Race Details',
    raceDetailsDescription: 'Fill in the form to generate a preview.',
    generatedPreviewDescription: 'The AI-generated preview will appear here.',
    noPreviewGenerated: 'No preview generated yet.',

    // Jockeys Page
    wins: 'Wins',
    mounts: 'Mounts',
    winRate: 'Win Rate',

    // Trainers Page
    achievements: 'Achievements',

    // Tracks Page
    interactiveMapComingSoon: 'Interactive Map - Coming Soon',

    // News Post Page
    views: 'Views',
    likes: 'Likes',
    comments: 'Comments',
    like: 'Like',
    shareYourThoughts: 'Share your thoughts',
    writeCommentPlaceholder: 'Write a comment...',
    postComment: 'Post Comment',
    
    // Calendar Page new
    racesFor: 'Races for',
    noRacesScheduled: 'No races scheduled for this date.',
    selectDateWithRaces: 'Select a date with marked events to see the races.',
    participants: 'participants',

    // Legal pages
    termsTitle: 'Terms and Conditions',
    termsDescription: 'Please read our terms and conditions carefully.',
    privacyTitle: 'Privacy Policy',
    privacyDescription: 'Your privacy is important to us.',
    faqTitle: 'Frequently Asked Questions',
    faqDescription: 'Find answers to the most common questions.',
    termsShort: 'Terms of Use',
    privacyShort: 'Privacy Policy',
    faq: 'FAQ',
    ourTrustedPartners: 'Our Trusted Partners',
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

    
    