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
  | 'logOut'
  | 'username'
  | 'password'
  | 'email'
  | 'confirmPassword'
  | 'createAccount'
  | 'welcomeBack'
  | 'accessExclusive'
  | 'registerSuccess'
  | 'continueAsGuest'
  | 'termsAgreement'
  | 'loginSuccess'
  | 'stayInEgypt'
  | 'discoverProperties'
  | 'where'
  | 'when'
  | 'who'
  | 'addGuests'
  | 'anywhere'
  | 'verifiedProperties'
  | 'averageRating'
  | 'primeLocations'
  | 'favorites'
  | 'rewards'
  | 'account'
  | 'explore'
  | 'bookings'
  | 'trips'
  | 'inbox';

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
    logOut: 'Log Out',
    username: 'Username',
    password: 'Password',
    email: 'Email Address',
    confirmPassword: 'Confirm Password',
    createAccount: 'Create Account',
    welcomeBack: 'Welcome to Stay Chill',
    accessExclusive: 'Sign in to access exclusive features and manage your bookings',
    registerSuccess: 'Registration successful! You can now log in to your account',
    continueAsGuest: 'Continue as Guest',
    termsAgreement: 'By continuing, you agree to Stay Chill\'s Terms of Service and Privacy Policy.',
    loginSuccess: 'Login successful!',
    stayInEgypt: 'stay in Egypt',
    discoverProperties: 'Discover amazing properties in Sahel & Ras El Hekma with panoramic sea views',
    where: 'Where',
    when: 'When',
    who: 'Who',
    addGuests: 'Add guests',
    anywhere: 'Anywhere',
    verifiedProperties: '200+ Verified Properties',
    averageRating: '4.8 Average Rating',
    primeLocations: 'Prime Beachfront Locations',
    favorites: 'Favorites',
    rewards: 'Rewards',
    account: 'Account',
    explore: 'Explore',
    bookings: 'Bookings',
    trips: 'Trips',
    inbox: 'Inbox'
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
    logOut: 'تسجيل الخروج',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    email: 'البريد الإلكتروني',
    confirmPassword: 'تأكيد كلمة المرور',
    createAccount: 'إنشاء حساب',
    welcomeBack: 'مرحبًا بك في ستاي تشيل',
    accessExclusive: 'سجل الدخول للوصول إلى المميزات الحصرية وإدارة حجوزاتك',
    registerSuccess: 'تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول إلى حسابك',
    continueAsGuest: 'المتابعة كضيف',
    termsAgreement: 'بالمتابعة، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بستاي تشيل.',
    loginSuccess: 'تم تسجيل الدخول بنجاح!',
    stayInEgypt: 'إقامة في مصر',
    discoverProperties: 'اكتشف عقارات رائعة في الساحل ورأس الحكمة مع إطلالات بانورامية على البحر',
    where: 'أين',
    when: 'متى',
    who: 'من',
    addGuests: 'إضافة ضيوف',
    anywhere: 'أي مكان',
    verifiedProperties: '+200 عقار موثق',
    averageRating: 'متوسط تقييم 4.8',
    primeLocations: 'مواقع مميزة على الشاطئ',
    favorites: 'المفضلة',
    rewards: 'المكافآت والنقاط',
    account: 'الحساب',
    explore: 'استكشاف',
    bookings: 'الحجوزات',
    trips: 'رحلاتي',
    inbox: 'الرسائل'
  }
};

// Hook to use translations
export function useTranslation(lang: Language) {
  const t = (key: TranslationKey) => translations[lang][key];
  return { t };
}