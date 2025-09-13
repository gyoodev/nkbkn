

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
    latestFromTheTrackDescription: 'Всичко най-актуално и интересно от пистите в България – новини, анализи и предстоящи събития.',
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
    owners: 'Собственици',
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
    rememberMe: 'Запомни ме',


    // Pages
    homeTitle: 'Добре дошли в НКБКН',
    homeSubtitle: 'Официалният дом на българските конни надбягвания.',
    homeDescription: 'Разгледайте профили на жокеи, треньори и коне. Намерете информация за писти, разгледайте галерии от състезания и генерирайте прегледи на предстоящи събития.',
    aboutPageTitle: 'За комисията',
    aboutPageDescription: 'Научете повече за нашата история, мисия и хората, които стоят зад Националната комисия за български конни надбягвания.',
    aboutHistoryTitle: 'Нашата история',
    aboutMissionTitle: 'Нашата мисия',
    aboutTeamTitle: 'Нашият екип',
    exploreJockeys: 'Разгледайте жокеите',
    exploreTrainers: 'Разгледайте треньорите',
    viewGallery: 'Вижте галерията',
    generatePreview: 'Генерирай превю',
    jockeysPageTitle: 'Профили на жокеи',
    jockeysPageDescription: 'Статистики и информация за водещите жокеи в България.',
    trainersPageTitle: 'Профили на треньори',
    trainersPageDescription: 'Постижения и информация за най-добрите треньори.',
    ownersPageTitle: 'Собственици на коне',
    ownersPageDescription: 'Информация за регистрираните собственици в системата.',
    horsesPageTitle: 'База данни с коне',
    horsesPageDescription: 'Регистрирани състезателни коне, родословие и минали резултати.',
    tracksPageTitle: 'Локатор на писти',
    tracksPageDescription: 'Информация за хиподрумите в България.',
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
    resultsPageDescription: 'Официални резултати от последните състезания.',
    latestResults: 'Последни резултати',
    latestResultsDescription: 'Прегледайте класирането от последните проведени надбягвания.',
    race: 'Състезание',
    date: 'Дата',
    trackName: 'Хиподрум',
    winner: 'Победител',
    jockey: 'Жокей',
    time: 'Време',

    // Forms & Buttons
    submit: 'Изпрати',
    sending: 'Изпращане...',
    submitApplication: 'Изпрати заявка',
    name: 'Име',
    email: 'Имейл',
    password: 'Парола',
    message: 'Съобщение',
    sendMessage: 'Изпратете ни съобщение',
    findUs: 'Намерете ни',
    followUs: 'Последвайте ни',

    // Forms Page
    registrationForms: 'Формуляри за регистрация',
    registrationFormsDescription: 'Изберете типа заявка и попълнете съответния формуляр. Нашата комисия ще се свърже с вас след преглед на кандидатурата.',
    jockeyApplication: 'Заявка за жокей',
    jockeyApplicationDescription: 'Кандидатствайте за лиценз',
    trainerApplication: 'Заявка за треньор',
    trainerApplicationDescription: 'Кандидатствайте за лиценз',
    ownerApplication: 'Заявка за собственик',
    ownerApplicationDescription: 'Регистрирайте се в системата',
    horseApplication: 'Заявка за кон',
    horseApplicationDescription: 'Регистрирайте нов състезателен кон',
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
    selectGender: 'Изберете пол',
    mare: 'Кобила',
    stallion: 'Жребец',
    gelding: 'Кастрат',
    passportNumber: 'Номер на паспорт',
    age: 'Възраст',
    sire: 'Баща',
    dam: 'Майка',
    owner: 'Собственик',
    ownerContactEmail: 'Имейл за контакт със собственика',
    ownerContactPhone: 'Телефон за контакт със собственика',

    // Horse Table
    horseNameTable: 'Име на коня',
    bestTime: 'Най-добро време',
    
    // Race Preview Form
    raceNameLabel: 'Име на състезанието',
    trackNameLabel: 'Име на пистата',
    dateLabel: 'Дата',
    timeLabel: 'Час',
    horseNamesLabel: 'Имена на конете (разделени със запетая)',
    jockeyNamesLabel: 'Имена на жокеите (разделени със запетая)',
    trainerNamesLabel: 'Имена на треньорите (разделени със запетая)',
    raceDescriptionLabel: 'Описание на състезанието (по избор)',
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
    noJockeysAdded: 'Няма добавени жокеи',
    noJockeysAddedDescription: 'В момента няма добавени профили на жокеи в системата.',
    
    // Trainers Page
    achievements: 'Постижения',
    noTrainersAdded: 'Няма добавени треньори',
    noTrainersAddedDescription: 'В момента няма добавени профили на треньори в системата.',

    // Owners Page
    noOwnersAdded: 'Няма добавени собственици',
    noOwnersAddedDescription: 'В момента няма добавени профили на собственици в системата.',

    // Horses Page
    noHorsesRegistered: 'Няма регистрирани коне',
    noHorsesRegisteredDescription: 'В момента няма регистрирани коне в системата.',


    // Tracks Page
    interactiveMapComingSoon: 'Интерактивна карта - скоро',
    trackLength: 'Дължина на пистата',
    trackType: 'Вид писта',
    trackTypeSand: 'Пясъчна',
    navigateToTrack: 'Навигиране към хиподрума',

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
    importantNotice: 'Важно съобщение',
    championship2026: 'В момента сме в процес на организиране на държавно първенство за 2026г. Очаквайте новини скоро!',


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
    faq1_q: 'Как мога да регистрирам кон, жокей, треньор или собственик?',
    faq1_a: 'Регистрацията се извършва изцяло онлайн. Отидете в секция "Формуляри", изберете типа заявка, който ви интересува (жокей, треньор, кон или собственик) и попълнете съответните данни. Нашата комисия ще прегледа кандидатурата ви и ще се свърже с вас.',
    faq2_q: 'Къде мога да намеря правилниците и други официални документи?',
    faq2_a: 'Всички официални документи, включително правилници за провеждане на състезания и формуляри за кандидатстване, могат да бъдат намерени и изтеглени от секция "Правилници и Формуляри" в главното меню на сайта.',
    faq3_q: 'Как мога да видя резултати от минали състезания?',
    faq3_a: 'Всички официални резултати се публикуват в секция "Резултати" на нашия уебсайт. Там можете да намерите подробна информация за класирането от проведените надбягвания.',
    faq4_q: 'Какво е текущото състояние на хиподрума в с. Гецово?',
    faq4_a: 'Хиподрумът в момента е в процес на планиране за възстановяване. Нашият екип работи активно, за да бъде готов за Държавното първенство през сезон 2026. Можете да следите напредъка в секция "Новини".',
    faq5_q: 'Как се определят датите в състезателния календар?',
    faq5_a: 'Състезателният календар се изготвя от комисията в началото на всяка година, като се вземат предвид климатичните условия, състоянието на пистите и международни събития. Календарът подлежи на промени, за които уведомяваме своевременно в секция "Календар" и "Новини".',

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
    latestFromTheTrackDescription: 'All the latest and most interesting news from the tracks in Bulgaria - news, analysis, and upcoming events.',
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
    owners: 'Owners',
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
    rememberMe: 'Remember me',

    // Pages
    homeTitle: 'Welcome to NCBHR',
    homeSubtitle: 'The official home of Bulgarian horse racing.',
    homeDescription: 'Explore profiles of jockeys, trainers, and horses. Find information on tracks, view race galleries, and generate previews for upcoming events.',
    aboutPageTitle: 'About the Commission',
    aboutPageDescription: 'Learn more about our history, mission, and the people behind the National Commission for Bulgarian Horse Racing.',
    aboutHistoryTitle: 'Our History',
    aboutMissionTitle: 'Our Mission',
    aboutTeamTitle: 'Our Team',
    exploreJockeys: 'Explore Jockeys',
    exploreTrainers: 'Explore Trainers',
    viewGallery: 'View Gallery',
    generatePreview: 'Generate Preview',
    jockeysPageTitle: 'Jockey Profiles',
    jockeysPageDescription: 'Statistics and information about the leading jockeys in Bulgaria.',
    trainersPageTitle: 'Trainer Profiles',
    trainersPageDescription: 'Achievements and information about the top trainers.',
    ownersPageTitle: 'Horse Owners',
    ownersPageDescription: 'Information about the registered owners in the system.',
    horsesPageTitle: 'Horse Database',
    horsesPageDescription: 'Registered racehorses, lineage, and past results.',
    tracksPageTitle: 'Track Locator',
    tracksPageDescription: 'Information about the racetracks in Bulgaria.',
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
    resultsPageDescription: 'Official results from the latest races.',
    latestResults: 'Latest Results',
    latestResultsDescription: 'Review the standings from the most recent races.',
    race: 'Race',
    date: 'Date',
    trackName: 'Track',
    winner: 'Winner',
    jockey: 'Jockey',
    time: 'Time',


    // Forms & Buttons
    submit: 'Submit',
    sending: 'Sending...',
    submitApplication: 'Submit Application',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    message: 'Message',
    sendMessage: 'Send us a message',
    findUs: 'Find Us',
    followUs: 'Follow Us',

    // Forms Page
    registrationForms: 'Registration Forms',
    registrationFormsDescription: 'Select the application type and fill out the form. Our commission will review your application and contact you.',
    jockeyApplication: 'Jockey Application',
    jockeyApplicationDescription: 'Apply for a license',
    trainerApplication: 'Trainer Application',
    trainerApplicationDescription: 'Apply for a license',
    ownerApplication: 'Owner Application',
    ownerApplicationDescription: 'Register in the system',
    horseApplication: 'Horse Application',
    horseApplicationDescription: 'Register a new racehorse',
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
    selectGender: 'Select gender',
    mare: 'Mare',
    stallion: 'Stallion',
    gelding: 'Gelding',
    passportNumber: 'Passport Number',
    age: 'Age',
    sire: 'Sire',
    dam: 'Dam',
    owner: 'Owner',
    ownerContactEmail: "Owner's Contact Email",
    ownerContactPhone: "Owner's Contact Phone",
    
    // Horse Table
    horseNameTable: 'Horse Name',
    bestTime: 'Best Time',

    // Race Preview Form
    raceNameLabel: 'Race Name',
    trackNameLabel: 'Track Name',
    dateLabel: 'Date',
    timeLabel: 'Time',
    horseNamesLabel: 'Horse Names (comma-separated)',
    jockeyNamesLabel: 'Jockey Names (comma-separated)',
    trainerNamesLabel: 'Trainer Names (comma-separated)',
    raceDescriptionLabel: 'Race Description (optional)',
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
    noJockeysAdded: 'No Jockeys Added',
    noJockeysAddedDescription: 'There are currently no jockey profiles in the system.',

    // Trainers Page
    achievements: 'Achievements',
    noTrainersAdded: 'No Trainers Added',
    noTrainersAddedDescription: 'There are currently no trainer profiles in the system.',

    // Owners Page
    noOwnersAdded: 'No Owners Added',
    noOwnersAddedDescription: 'There are currently no owner profiles in the system.',

    // Horses Page
    noHorsesRegistered: 'No Horses Registered',
    noHorsesRegisteredDescription: 'There are currently no registered horses in the system.',

    // Tracks Page
    interactiveMapComingSoon: 'Interactive Map - Coming Soon',
    trackLength: 'Track Length',
    trackType: 'Track Type',
    trackTypeSand: 'Sand',
    navigateToTrack: 'Navigate to Track',

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
    importantNotice: 'Important Notice',
    championship2026: 'We are currently in the process of organizing the 2026 national championship. News coming soon!',

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
    faq1_q: 'How can I register a horse, jockey, trainer, or owner?',
    faq1_a: 'Registration is done entirely online. Go to the "Forms" section, select the type of application you are interested in (jockey, trainer, horse, or owner) and fill in the relevant data. Our committee will review your application and contact you.',
    faq2_q: 'Where can I find the rulebooks and other official documents?',
    faq2_a: 'All official documents, including race regulations and application forms, can be found and downloaded from the "Regulations and Forms" section in the main menu of the site.',
    faq3_q: 'How can I see results from past races?',
    faq3_a: 'All official results are published in the "Results" section of our website. There you can find detailed information about the rankings from the races held.',
    faq4_q: 'What is the current state of the racecourse in the village of Getsovo?',
    faq4_a: 'The racecourse is currently being planned for restoration. Our team is working actively to have it ready for the 2026 National Championship. You can follow the progress in the "News" section.',
    faq5_q: 'How are the dates in the race calendar determined?',
    faq5_a: 'The race calendar is prepared by the committee at the beginning of each year, taking into account weather conditions, track conditions, and international events. The calendar is subject to change, which we announce promptly in the "Calendar" and "News" sections.',
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
