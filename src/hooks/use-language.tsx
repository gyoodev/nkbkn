
'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { translateText } from '@/ai/flows/translate-flow';

type Language = 'bg' | 'en';

type Translations = {
  [key: string]: string;
};

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  text: Translations;
  translateDynamic: (textToTranslate: string, isHtml?: boolean) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const baseTranslations: Record<Language, Translations> = {
  bg: {
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
    heroTitle: 'СТРАСТ, АДРЕНАЛИН И ЛЮБОВ КЪМ КОНЕТЕ',
    heroSubtitle: 'Официалният дом на българските конни надбягвания.',
    raceCalendar: 'Състезателен календар',
    latestNews: 'Последни новини',
    latestFromTheTrack: 'Най-новото от пистата',
    latestFromTheTrackDescription: 'Последни новини, събития и актуализации от света на конните надбягвания в България.',
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
    updateProfile: 'Актуализирай профила',
    updatingProfile: 'Актуализиране...',
    profilePageDescription: 'Преглеждайте и актуализирайте информацията за вашия профил.',
    username: 'Потребителско име',
    fullName: 'Пълно име',
    website: 'Уебсайт',
    uploadAvatar: 'Качи аватар',
    aboutPageTitle: 'За Националната комисия за Български конни надбягвания',
    aboutPageDescription: 'Научете повече за нашата история, мисия и екипа, който стои зад развитието на конните надбягвания в България.',
    aboutHistoryTitle: 'Нашата история',
    aboutMissionTitle: 'Нашата мисия',
    aboutTeamTitle: 'Нашият екип',
    calendarPageDescription: 'Прегледайте предстоящите състезателни дни и събития.',
    racesFor: 'Състезания за',
    noRacesScheduled: 'Няма планирани състезания за тази дата.',
    participants: 'участници',
    selectDateWithRaces: 'Моля, изберете дата със събития, за да видите състезанията.',
    importantNotice: 'Важно съобщение!',
    championship2026: 'Републиканският шампионат за 2024 г. няма да се проведе. Очаквайте информация за сезон 2026!',
    jockeysPageTitle: 'Нашите жокеи',
    jockeysPageDescription: 'Запознайте се с талантливите жокеи, които се състезават на пистите в България.',
    wins: 'Победи',
    mounts: 'Участия',
    winRate: '% победи',
    trainersPageTitle: 'Нашите треньори',
    trainersPageDescription: 'Открийте опитните треньори, които подготвят шампионите на пистата.',
    achievements: 'Постижения',
    horsesPageTitle: 'Картотека на коне',
    horsesPageDescription: 'Разгледайте базата данни с всички регистрирани коне, участващи в надбягванията.',
    horseNameTable: 'Име на коня',
    sire: 'Баща',
    dam: 'Майка',
    age: 'Възраст',
    bestTime: 'Най-добро време',
    tracksPageDescription: 'Информация за хиподрумите в България.',
    trackLength: 'Дължина на пистата',
    trackType: 'Тип на настилката',
    trackTypeSand: 'Пясъчна',
    navigateToTrack: 'Навигация до пистата',
    galleryPageTitle: 'Галерия',
    galleryPageDescription: 'Разгледайте снимки от последните събития и състезания.',
    views: 'Преглеждания',
    likes: 'Харесвания',
    like: 'Харесай',
    contactPageTitle: 'Свържете се с нас',
    contactPageDescription: 'Имате въпроси или предложения? Използвайте формата по-долу или някой от другите методи за контакт.',
    sendMessage: 'Изпратете ни съобщение',
    submit: 'Изпрати',
    findUs: 'Намерете ни',
    followUs: 'Последвайте ни',
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
    cookieBannerText: 'Този уебсайт използва "бисквитки", за да гарантира, че получавате най-доброто изживяване. Като продължавате да използвате сайта, вие се съгласявате с нашата политика за поверителност.',
    privacyPolicy: 'Политика за поверителност',
    accept: 'Приемам',
    ourTrustedPartners: 'Нашите доверени партньори',
    race: 'Състезание',
    date: 'Дата',
    trackName: 'Хиподрум',
    winner: 'Победител',
    time: 'Време',
    latestResults: 'Последни резултати',
    latestResultsDescription: 'Вижте победителите от последните проведени състезания.',
    ownersPageTitle: 'Собственици',
    ownersPageDescription: 'Разгледайте профилите на собствениците на коне в българските надбягвания.',
  },
  en: {
    appName: 'NCBHR',
    appNameFull: 'National Commission for Bulgarian Horse Racing',
    readMore: 'Read More',
    allRightsReserved: 'All rights reserved',
    developedBy: 'Developed by GKDEV',
    home: 'Home',
    about: 'About',
    news: 'News',
    contact: 'Contact',
    gallery: 'Gallery',
    loading: 'Loading...',
    aboutCommissionShort: 'About Us',
    jockeys: 'Jockeys',
    trainers: 'Trainers',
    owners: 'Owners',
    horses: 'Horses',
    tracks: 'Tracks',
    forms: 'Forms',
    calendar: 'Calendar',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    adminPanel: 'Admin Panel',
    heroTitle: 'PASSION, ADRENALINE AND LOVE FOR HORSES',
    heroSubtitle: 'The official home of Bulgarian horse racing.',
    raceCalendar: 'Race Calendar',
    latestNews: 'Latest News',
    latestFromTheTrack: 'Latest from the Track',
    latestFromTheTrackDescription: 'Latest news, events, and updates from the world of horse racing in Bulgaria.',
    aboutUs: 'About Us',
    history: 'History',
    mission: 'Mission',
    team: 'Team',
    races: 'Races',
    results: 'Results',
    resources: 'Resources',
    termsShort: 'Terms',
    privacyShort: 'Privacy',
    faq: 'FAQ',
    loginPrompt: 'Log in to your account to access all features.',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    loggingIn: 'Logging in...',
    signUpPrompt: 'Create your account to take full advantage of the platform.',
    signingUp: 'Signing up...',
    alreadyHaveAccount: 'Already have an account?',
    updateProfile: 'Update Profile',
    updatingProfile: 'Updating...',
    profilePageDescription: 'View and update your profile information.',
    username: 'Username',
    fullName: 'Full Name',
    website: 'Website',
    uploadAvatar: 'Upload Avatar',
    aboutPageTitle: 'About the National Commission for Bulgarian Horse Racing',
    aboutPageDescription: 'Learn more about our history, mission, and the team behind the development of horse racing in Bulgaria.',
    aboutHistoryTitle: 'Our History',
    aboutMissionTitle: 'Our Mission',
    aboutTeamTitle: 'Our Team',
    calendarPageDescription: 'Browse upcoming race days and events.',
    racesFor: 'Races for',
    noRacesScheduled: 'No races scheduled for this date.',
    participants: 'participants',
    selectDateWithRaces: 'Please select a date with events to see the races.',
    importantNotice: 'Important Notice!',
    championship2026: 'The 2024 National Championship will not be held. Expect information for the 2026 season!',
    jockeysPageTitle: 'Our Jockeys',
    jockeysPageDescription: 'Meet the talented jockeys competing on the tracks in Bulgaria.',
    wins: 'Wins',
    mounts: 'Mounts',
    winRate: 'Win Rate',
    trainersPageTitle: 'Our Trainers',
    trainersPageDescription: 'Discover the experienced trainers who prepare the champions on the track.',
    achievements: 'Achievements',
    horsesPageTitle: 'Horse Registry',
    horsesPageDescription: 'Browse the database of all registered horses participating in the races.',
    horseNameTable: 'Horse Name',
    sire: 'Sire',
    dam: 'Dam',
    age: 'Age',
    bestTime: 'Best Time',
    tracksPageDescription: 'Information about the race tracks in Bulgaria.',
    trackLength: 'Track Length',
    trackType: 'Track Type',
    trackTypeSand: 'Sand',
    navigateToTrack: 'Navigate to Track',
    galleryPageTitle: 'Gallery',
    galleryPageDescription: 'Browse photos from the latest events and races.',
    views: 'Views',
    likes: 'Likes',
    like: 'Like',
    contactPageTitle: 'Contact Us',
    contactPageDescription: 'Have questions or suggestions? Use the form below or one of the other contact methods.',
    sendMessage: 'Send us a message',
    submit: 'Submit',
    findUs: 'Find Us',
    followUs: 'Follow Us',
    faqTitle: 'Frequently Asked Questions',
    faqDescription: 'Find answers to the most frequently asked questions.',
    faq1_q: 'How can I register a horse for participation?',
    faq1_a: 'To register a horse, you must fill out the corresponding form from the "Forms" section and submit it to the commission. The horse must meet all veterinary and administrative requirements.',
    faq2_q: 'Where can I find results from past races?',
    faq2_a: 'Results from all held races can be found in the "Results" section of our website.',
    faq3_q: 'What are the requirements to become a jockey?',
    faq3_a: 'To become a licensed jockey, you must go through a training process and meet certain physical and practical standards. More information can be found in our regulations.',
    faq4_q: 'Are races held during the winter?',
    faq4_a: 'The racing season is usually during the warm months of the year. Please follow our "Calendar" for up-to-date information on dates.',
    faq5_q: 'Can I bet on the races?',
    faq5_a: 'Currently, the commission does not organize or regulate betting. Any information regarding betting will be officially announced on the site.',
    registrationForms: 'Registration Forms',
    registrationFormsDescription: 'Choose the type of registration you wish to make and fill in the required data.',
    jockeyApplication: 'Jockey Application',
    jockeyApplicationDescription: 'Fill out to apply for a jockey license.',
    trainerApplication: 'Trainer Application',
    trainerApplicationDescription: 'Fill out to apply for a trainer license.',
    ownerApplication: 'Owner Application',
    ownerApplicationDescription: 'Fill out to register as a horse owner.',
    horseApplication: 'Horse Application',
    horseApplicationDescription: 'Fill out to register a new horse in the system.',
    submitApplication: 'Submit Application',
    sending: 'Sending...',
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Date of Birth',
    egn: 'Personal ID',
    address: 'Address',
    contactEmail: 'Contact Email',
    contactPhone: 'Contact Phone',
    horseCount: 'Number of Horses',
    horseName: 'Horse Name',
    gender: 'Gender',
    selectGender: 'Select Gender',
    mare: 'Mare',
    stallion: 'Stallion',
    gelding: 'Gelding',
    passportNumber: 'Passport Number',
    ownerContactEmail: "Owner's Contact Email",
    ownerContactPhone: "Owner's Contact Phone",
    cookieBannerText: 'This website uses cookies to ensure you get the best experience. By continuing to use the site, you agree to our privacy policy.',
    privacyPolicy: 'Privacy Policy',
    accept: 'Accept',
    ourTrustedPartners: 'Our Trusted Partners',
    race: 'Race',
    date: 'Date',
    trackName: 'Track',
    winner: 'Winner',
    time: 'Time',
    latestResults: 'Latest Results',
    latestResultsDescription: 'See the winners from the latest races.',
    ownersPageTitle: 'Owners',
    ownersPageDescription: 'Browse the profiles of horse owners in Bulgarian racing.',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bg');
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'bg' ? 'en' : 'bg';
    setLanguage(newLang);
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
  }, [language]);

  const translateDynamic = useCallback(async (textToTranslate: string, isHtml: boolean = false): Promise<string> => {
    if (language === 'bg' || !textToTranslate) {
      return textToTranslate;
    }
    
    const cacheKey = `${language}:${textToTranslate}`;
    if (dynamicTranslations[cacheKey]) {
      return dynamicTranslations[cacheKey];
    }
    
    setDynamicTranslations(prev => ({...prev, [cacheKey]: 'Loading...'}));

    try {
        const translated = await translateText({ text: textToTranslate, targetLang: language, isHtml });
        if (translated) {
            setDynamicTranslations(prev => ({...prev, [cacheKey]: translated}));
            return translated;
        }
    } catch (error) {
        console.error("Dynamic translation failed:", error);
    }

    // Fallback to original text if translation fails
    setDynamicTranslations(prev => ({...prev, [cacheKey]: textToTranslate}));
    return textToTranslate;
  }, [language, dynamicTranslations]);

  const text = useMemo(() => baseTranslations[language], [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, text, translateDynamic }}>
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

export const useDynamicTranslation = (textToTranslate: string | null | undefined, isHtml: boolean = false): string => {
    const { language, translateDynamic } = useLanguage();
    const [translatedText, setTranslatedText] = useState(textToTranslate || '');

    useEffect(() => {
        if (!textToTranslate) {
            setTranslatedText('');
            return;
        }

        if (language === 'bg') {
            setTranslatedText(textToTranslate);
            return;
        }

        let isMounted = true;
        setTranslatedText('Loading...');

        translateDynamic(textToTranslate, isHtml).then(result => {
            if (isMounted) {
                setTranslatedText(result);
            }
        });

        return () => {
            isMounted = false;
        };

    }, [textToTranslate, language, translateDynamic, isHtml]);

    return translatedText;
}
