// Translations object for the application
// Holds text for various elements across multiple languages

export type TranslationKey = 
  | 'home'
  | 'properties' 
  | 'aboutUs' 
  | 'contact'
  | 'signIn'
  | 'signOut'
  | 'listProperty'
  | 'search'
  | 'findYourPerfectStay'
  | 'exploreProperties'
  | 'featuredProperties'
  | 'viewAll'
  | 'language'
  | 'bookNow'
  | 'inquire'
  | 'beachfront'
  | 'pool'
  | 'wifi'
  | 'airConditioning'
  | 'guests'
  | 'bedrooms'
  | 'bathrooms'
  | 'perNight'
  | 'viewDetails'
  | 'changeLanguage'
  | 'myAccount'
  | 'logOut';

export type Language = 'en' | 'ar';

// Define translations
export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    home: 'Home',
    properties: 'Properties',
    aboutUs: 'About Us',
    contact: 'Contact',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    listProperty: 'List Property',
    search: 'Search',
    findYourPerfectStay: 'Find Your Perfect Stay in Sahel',
    exploreProperties: 'Explore Properties',
    featuredProperties: 'Featured Properties',
    viewAll: 'View All',
    language: 'Language',
    bookNow: 'Book Now',
    inquire: 'Inquire',
    beachfront: 'Beachfront',
    pool: 'Pool',
    wifi: 'Wi-Fi',
    airConditioning: 'Air Conditioning',
    guests: 'Guests',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    perNight: 'per night',
    viewDetails: 'View Details',
    changeLanguage: 'Change Language',
    myAccount: 'My Account',
    logOut: 'Log Out'
  },
  ar: {
    home: 'الرئيسية',
    properties: 'العقارات',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    listProperty: 'اعرض عقارك',
    search: 'بحث',
    findYourPerfectStay: 'اعثر على إقامتك المثالية في الساحل',
    exploreProperties: 'استكشف العقارات',
    featuredProperties: 'عقارات مميزة',
    viewAll: 'عرض الكل',
    language: 'اللغة',
    bookNow: 'احجز الآن',
    inquire: 'استفسر',
    beachfront: 'واجهة بحرية',
    pool: 'حمام سباحة',
    wifi: 'واي فاي',
    airConditioning: 'تكييف هواء',
    guests: 'ضيوف',
    bedrooms: 'غرف نوم',
    bathrooms: 'حمامات',
    perNight: 'لليلة',
    viewDetails: 'عرض التفاصيل',
    changeLanguage: 'تغيير اللغة',
    myAccount: 'حسابي',
    logOut: 'تسجيل الخروج'
  }
};

// Hook to use translations
export function useTranslation(lang: Language) {
  const t = (key: TranslationKey) => translations[lang][key];
  return { t };
}