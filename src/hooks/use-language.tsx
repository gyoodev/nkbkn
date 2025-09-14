
'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { translateText } from '@/ai/flows/translate-flow';

type Language = 'bg' | 'en';

type Translations = {
  [key: string]: string;
};

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  text: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const baseTranslations: Record<Language, Translations> = {
  bg: {
    // General
    appName: 'НКБКН',
    appNameFull: 'Национална комисия за Български конни надбягвания',
    readMore: 'Прочети повече',
    allRightsReserved: 'Всички права запазени',
    developedBy: 'Разработено от GKDEV',
    home: 'Начало',
    about: 'За нас',
    news: 'Новини',
    contact: 'Контакти',
    gallery: 'Галерия',
    loading: 'Зареждане...',
    // Header & Nav
    aboutCommissionShort: 'За комисията',
    jockeys: 'Жокеи',
    trainers: 'Треньoри',
    owners: 'Собственици',
    horses: 'Коне',
    tracks: 'Хиподруми',
    forms: 'Формуляри',
    calendar: 'Календар',
    login: 'Вход',
    logout: 'Изход',
    profile: 'Профил',
    adminPanel: 'Админ панел',
    // Home Page
    heroTitle: 'СТРАСТ, АДРЕНАЛИН И ЛЮБОВ КЪМ КОНЕТЕ',
    heroSubtitle: 'Официалният дом на българските конни надбягвания.',
    raceCalendar: 'Състезателен календар',
    latestNews: 'Последни новини',
    latestFromTheTrack: 'Най-новото от пистата',
    latestFromTheTrackDescription: 'Последни новини, събития и актуализации от света на конните надбягвания в България.',
    // Footer
    aboutUs: 'За нас',
    history: 'История',
    mission: 'Мисия',
    team: 'Екип',
    races: 'Състезания',
    results: 'Резултати',
    resources: 'Ресурси',
    termsShort: 'Условия',
    privacyShort: 'Поверителност',
    faq: 'ЧЗВ',
    // Auth Pages
    loginPrompt: 'Влезте в своя профил, за да получите достъп до всички функции.',
    email: 'Имейл',
    password: 'Парола',
    rememberMe: 'Запомни ме',
    noAccount: 'Нямате акаунт?',
    signUp: 'Регистрация',
    loggingIn: 'Влизане...',
    signUpPrompt: 'Създайте своя акаунт, за да се възползвате от пълните възможности на платформата.',
    signingUp: 'Регистриране...',
    alreadyHaveAccount: 'Вече имате акаунт?',
    // Profile Page
    updateProfile: 'Актуализирай профила',
    updatingProfile: 'Актуализиране...',
    profilePageDescription: 'Преглеждайте и актуализирайте информацията за вашия профил.',
    username: 'Потребителско име',
    fullName: 'Пълно име',
    website: 'Уебсайт',
    uploadAvatar: 'Качи аватар',
    // About Page
    aboutPageTitle: 'За Националната комисия за Български конни надбягвания',
    aboutPageDescription: 'Научете повече за нашата история, мисия и екипа, който стои зад развитието на конните надбягвания в България.',
    aboutHistoryTitle: 'Нашата история',
    aboutMissionTitle: 'Нашата мисия',
    aboutTeamTitle: 'Нашият екип',
    // Calendar Page
    calendarPageDescription: 'Прегледайте предстоящите състезателни дни и събития.',
    racesFor: 'Състезания за',
    noRacesScheduled: 'Няма планирани състезания за тази дата.',
    participants: 'участници',
    selectDateWithRaces: 'Моля, изберете дата със събития, за да видите състезанията.',
    importantNotice: 'Важно съобщение!',
    championship2026: 'Републиканският шампионат за 2024 г. няма да се проведе. Очаквайте информация за сезон 2026!',
    // Jockeys Page
    jockeysPageTitle: 'Нашите жокеи',
    jockeysPageDescription: 'Запознайте се с талантливите жокеи, които се състезават на пистите в България.',
    wins: 'Победи',
    mounts: 'Участия',
    winRate: '% победи',
    // Trainers Page
    trainersPageTitle: 'Нашите треньори',
    trainersPageDescription: 'Открийте опитните треньори, които подготвят шампионите на пистата.',
    achievements: 'Постижения',
    // Horses Page
    horsesPageTitle: 'Картотека на коне',
    horsesPageDescription: 'Разгледайте базата данни с всички регистрирани коне, участващи в надбягванията.',
    horseNameTable: 'Име на коня',
    sire: 'Баща',
    dam: 'Майка',
    age: 'Възраст',
    bestTime: 'Най-добро време',
    // Tracks Page
    tracksPageDescription: 'Информация за хиподрумите в България.',
    trackLength: 'Дължина на пистата',
    trackType: 'Тип на настилката',
    trackTypeSand: 'Пясъчна',
    navigateToTrack: 'Навигация до пистата',
    // Gallery Page
    galleryPageTitle: 'Галерия',
    galleryPageDescription: 'Разгледайте снимки от последните събития и състезания.',
    // News Post Page
    views: 'Преглеждания',
    likes: 'Харесвания',
    like: 'Харесай',
    // Contact Page
    contactPageTitle: 'Свържете се с нас',
    contactPageDescription: 'Имате въпроси или предложения? Използвайте формата по-долу или някой от другите методи за контакт.',
    sendMessage: 'Изпратете ни съобщение',
    submit: 'Изпрати',
    findUs: 'Намерете ни',
    followUs: 'Последвайте ни',
    // FAQ Page
    faqTitle: 'Често задавани въпроси',
    faqDescription: 'Намерете отговори на най-често задаваните въпроси.',
    faq1_q: 'Как мога да регистрирам кон за участие?',
    faq1_a: 'За да регистрирате кон, трябва да попълните съответния формуляр от секция "Формуляри" и да го изпратите до комисията. Конят трябва да отговаря на всички ветеринарни и административни изисквания.',
    faq2_q: 'Къде мога да намеря резултати от минали състезания?',
    faq2_a: 'Резултати от всички проведени състезания можете да намерите в секция "Резултати" на нашия уебсайт.',
    faq3_q: 'Какви са изискванията, за да стана жокей?',
    faq3_a: 'За да станете лицензиран жокей, трябва да преминете през процес на обучение и да покриете определени физически и практически нормативи. Повече информация можете да намерите в нашите правилници.',
    faq4_q: 'Провеждат ли се състезания през зимата?',
    faq4_a: 'Състезателният сезон обикновено е през топлите месеци от годината. Моля, следете нашия "Календар" за актуална информация относно датите на провеждане.',
    faq5_q: 'Мога ли да залагам на състезанията?',
    faq5_a: 'Към момента комисията не организира и не регулира залози. Всяка информация относно залози ще бъде официално обявена на сайта.',
    // Forms Page
    registrationForms: 'Формуляри за регистрация',
    registrationFormsDescription: 'Изберете типа регистрация, който желаете да направите, и попълнете необходимите данни.',
    jockeyApplication: 'Заявка за жокей',
    jockeyApplicationDescription: 'Попълнете, за да кандидатствате за лиценз за жокей.',
    trainerApplication: 'Заявка за треньор',
    trainerApplicationDescription: 'Попълнете, за да кандидатствате за лиценз за треньор.',
    ownerApplication: 'Заявка за собственик',
    ownerApplicationDescription: 'Попълнете, за да се регистрирате като собственик на коне.',
    horseApplication: 'Заявка за кон',
    horseApplicationDescription: 'Попълнете, за да регистрирате нов кон в системата.',
    submitApplication: 'Подай заявка',
    sending: 'Изпращане...',
    firstName: 'Име',
    lastName: 'Фамилия',
    dateOfBirth: 'Дата на раждане',
    egn: 'ЕГН',
    address: 'Адрес',
    contactEmail: 'Имейл за контакт',
    contactPhone: 'Телефон за контакт',
    horseCount: 'Брой коне',
    horseName: 'Име на коня',
    gender: 'Пол',
    selectGender: 'Избери пол',
    mare: 'Кобила',
    stallion: 'Жребец',
    gelding: 'Кастрат',
    passportNumber: 'Паспортен номер',
    ownerContactEmail: 'Имейл на собственика',
    ownerContactPhone: 'Телефон на собственика',
    // Cookie Banner
    cookieBannerText: 'Този уебсайт използва "бисквитки", за да гарантира, че получавате най-доброто изживяване. Като продължавате да използвате сайта, вие се съгласявате с нашата политика за поверителност.',
    privacyPolicy: 'Политика за поверителност',
    accept: 'Приемам',
    // Partners
    ourTrustedPartners: 'Нашите доверени партньори',
  },
  en: {
    // English translations will be added here
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bg');

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'bg' ? 'en' : 'bg'));
  };

  const text = useMemo(() => {
    return baseTranslations[language];
  }, [language]);

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
