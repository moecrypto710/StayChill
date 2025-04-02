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
  | 'personalized_recommendations'
  | 'preferences'
  | 'travel_preferences'
  | 'travel_preferences_desc'
  | 'budget'
  | 'select_budget'
  | 'budget_low'
  | 'budget_medium'
  | 'budget_high'
  | 'travel_style'
  | 'select_all_that_apply'
  | 'preferred_activities'
  | 'destination_types'
  | 'family_friendly'
  | 'family_friendly_desc'
  | 'accessibility_needs'
  | 'accessibility_needs_desc'
  | 'seasonal_preference'
  | 'select_season'
  | 'summer'
  | 'winter'
  | 'spring'
  | 'fall'
  | 'any_season'
  | 'trip_duration'
  | 'select_duration'
  | 'weekend'
  | 'week'
  | 'two_weeks'
  | 'month'
  | 'longer'
  | 'max_distance_km'
  | 'max_distance_desc'
  | 'saving'
  | 'save_preferences'
  | 'generating'
  | 'get_new_recommendations'
  | 'set_travel_preferences'
  | 'set_travel_preferences_desc'
  | 'set_preferences'
  | 'recommended'
  | 'saved'
  | 'viewed'
  | 'no_new_recommendations'
  | 'no_new_recommendations_desc'
  | 'generate_recommendations'
  | 'no_saved_recommendations'
  | 'no_saved_recommendations_desc'
  | 'no_viewed_recommendations'
  | 'no_viewed_recommendations_desc'
  | 'match'
  | 'recommendation_default_reason'
  | 'view_again'
  | 'recommendations_generated'
  | 'recommendations_generated_desc'
  | 'error_generating_recommendations'
  | 'preferences_saved'
  | 'preferences_saved_desc'
  | 'error_saving_preferences'
  | 'try_again_later'
  | 'error_saving_recommendation'
  | 'oops_something_went_wrong'
  | 'error_loading_recommendations'
  | 'refresh'
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
export const translations: Record<Language, Partial<Record<TranslationKey, string>>> = {
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
    inbox: 'Inbox',
    
    // Recommendations page translations
    personalized_recommendations: 'Personalized Recommendations',
    preferences: 'Preferences',
    travel_preferences: 'Travel Preferences',
    travel_preferences_desc: 'Set your travel preferences to get personalized property recommendations',
    budget: 'Budget',
    select_budget: 'Select your budget',
    budget_low: 'Economy',
    budget_medium: 'Mid-range',
    budget_high: 'Luxury',
    travel_style: 'Travel Style',
    select_all_that_apply: 'Select all that apply',
    preferred_activities: 'Preferred Activities',
    destination_types: 'Destination Types',
    family_friendly: 'Family Friendly',
    family_friendly_desc: 'Suitable for children and families',
    accessibility_needs: 'Accessibility Needs',
    accessibility_needs_desc: 'Properties with accessible facilities',
    seasonal_preference: 'Seasonal Preference',
    select_season: 'Select season',
    summer: 'Summer',
    winter: 'Winter',
    spring: 'Spring',
    fall: 'Fall',
    any_season: 'Any season',
    trip_duration: 'Trip Duration',
    select_duration: 'Select duration',
    weekend: 'Weekend getaway',
    week: 'One week',
    two_weeks: 'Two weeks',
    month: 'One month',
    longer: 'Longer stay',
    max_distance_km: 'Maximum Distance (km)',
    max_distance_desc: 'Maximum distance from your preferred location',
    saving: 'Saving...',
    save_preferences: 'Save Preferences',
    generating: 'Generating...',
    get_new_recommendations: 'Get New Recommendations',
    set_travel_preferences: 'Set Your Travel Preferences',
    set_travel_preferences_desc: 'Tell us what you\'re looking for to get personalized property recommendations',
    set_preferences: 'Set Preferences',
    recommended: 'Recommended',
    saved: 'Saved',
    viewed: 'Viewed',
    no_new_recommendations: 'No New Recommendations',
    no_new_recommendations_desc: 'We\'ve run out of recommendations based on your preferences',
    generate_recommendations: 'Generate Recommendations',
    no_saved_recommendations: 'No Saved Recommendations',
    no_saved_recommendations_desc: 'You haven\'t saved any recommendations yet',
    no_viewed_recommendations: 'No Viewed Recommendations',
    no_viewed_recommendations_desc: 'You haven\'t viewed any recommendations yet',
    match: 'Match',
    recommendation_default_reason: 'This property matches your travel preferences',
    view_again: 'View Again',
    recommendations_generated: 'Recommendations Generated',
    recommendations_generated_desc: 'New property recommendations are ready for you',
    error_generating_recommendations: 'Error Generating Recommendations',
    preferences_saved: 'Preferences Saved',
    preferences_saved_desc: 'Your travel preferences have been updated',
    error_saving_preferences: 'Error Saving Preferences',
    try_again_later: 'Please try again later',
    error_saving_recommendation: 'Error Saving Recommendation',
    oops_something_went_wrong: 'Oops! Something went wrong',
    error_loading_recommendations: 'We couldn\'t load your recommendations',
    refresh: 'Refresh Page'
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
    inbox: 'الرسائل',
    
    // Recommendations page translations
    personalized_recommendations: 'توصيات مخصصة',
    preferences: 'التفضيلات',
    travel_preferences: 'تفضيلات السفر',
    travel_preferences_desc: 'حدد تفضيلاتك للحصول على توصيات مخصصة للعقارات',
    budget: 'الميزانية',
    select_budget: 'اختر ميزانيتك',
    budget_low: 'اقتصادي',
    budget_medium: 'متوسط',
    budget_high: 'فاخر',
    travel_style: 'نمط السفر',
    select_all_that_apply: 'اختر كل ما ينطبق',
    preferred_activities: 'الأنشطة المفضلة',
    destination_types: 'أنواع الوجهات',
    family_friendly: 'مناسب للعائلات',
    family_friendly_desc: 'مناسب للأطفال والعائلات',
    accessibility_needs: 'احتياجات الوصول',
    accessibility_needs_desc: 'عقارات مع مرافق يمكن الوصول إليها',
    seasonal_preference: 'التفضيل الموسمي',
    select_season: 'اختر الموسم',
    summer: 'الصيف',
    winter: 'الشتاء',
    spring: 'الربيع',
    fall: 'الخريف',
    any_season: 'أي موسم',
    trip_duration: 'مدة الرحلة',
    select_duration: 'اختر المدة',
    weekend: 'عطلة نهاية الأسبوع',
    week: 'أسبوع واحد',
    two_weeks: 'أسبوعان',
    month: 'شهر واحد',
    longer: 'إقامة أطول',
    max_distance_km: 'المسافة القصوى (كم)',
    max_distance_desc: 'أقصى مسافة من موقعك المفضل',
    saving: 'جاري الحفظ...',
    save_preferences: 'حفظ التفضيلات',
    generating: 'جاري التوليد...',
    get_new_recommendations: 'الحصول على توصيات جديدة',
    set_travel_preferences: 'حدد تفضيلات السفر الخاصة بك',
    set_travel_preferences_desc: 'أخبرنا عما تبحث عنه للحصول على توصيات عقارات مخصصة',
    set_preferences: 'تحديد التفضيلات',
    recommended: 'موصى به',
    saved: 'محفوظ',
    viewed: 'تمت المشاهدة',
    no_new_recommendations: 'لا توجد توصيات جديدة',
    no_new_recommendations_desc: 'لقد نفدت التوصيات بناءً على تفضيلاتك',
    generate_recommendations: 'توليد توصيات',
    no_saved_recommendations: 'لا توجد توصيات محفوظة',
    no_saved_recommendations_desc: 'لم تقم بحفظ أي توصيات بعد',
    no_viewed_recommendations: 'لا توجد توصيات تمت مشاهدتها',
    no_viewed_recommendations_desc: 'لم تشاهد أي توصيات بعد',
    match: 'تطابق',
    recommendation_default_reason: 'هذا العقار يتطابق مع تفضيلات السفر الخاصة بك',
    view_again: 'مشاهدة مرة أخرى',
    recommendations_generated: 'تم توليد التوصيات',
    recommendations_generated_desc: 'توصيات عقارات جديدة جاهزة لك',
    error_generating_recommendations: 'خطأ في توليد التوصيات',
    preferences_saved: 'تم حفظ التفضيلات',
    preferences_saved_desc: 'تم تحديث تفضيلات السفر الخاصة بك',
    error_saving_preferences: 'خطأ في حفظ التفضيلات',
    try_again_later: 'يرجى المحاولة مرة أخرى لاحقًا',
    error_saving_recommendation: 'خطأ في حفظ التوصية',
    oops_something_went_wrong: 'عفوًا! حدث خطأ ما',
    error_loading_recommendations: 'تعذر تحميل التوصيات الخاصة بك',
    refresh: 'تحديث الصفحة'
  }
};

// Hook to use translations
export function useTranslation(lang?: Language) {
  // Use the language from localStorage or default to English
  const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') as Language || 'en' : 'en';
  const currentLang = lang || storedLang;
  
  // Check if current language is RTL (Arabic in our case)
  const isRtl = currentLang === 'ar';
  
  const t = (key: TranslationKey) => {
    // Return the translation for the key, fallback to English if not found
    return translations[currentLang][key] || 
           translations['en'][key] || 
           key;
  };
  
  return { t, isRtl, currentLang };
}