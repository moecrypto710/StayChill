import { useState, useEffect, createContext, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { Language as LangCode, translations } from '@/lib/translations';

// Type for language
type LanguageOption = {
  code: LangCode;
  name: string;
  direction: 'ltr' | 'rtl';
  nativeName: string;
};

// Context for current language across the app
type LanguageContextType = {
  currentLanguage: LanguageOption;
  setAppLanguage: (lang: LanguageOption) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: {
    code: 'en',
    name: 'English',
    direction: 'ltr',
    nativeName: 'English'
  },
  setAppLanguage: () => {}
});

export const useLanguage = () => useContext(LanguageContext);

// Available languages
const languages: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    direction: 'ltr',
    nativeName: 'English'
  },
  {
    code: 'ar',
    name: 'Arabic',
    direction: 'rtl',
    nativeName: 'العربية'
  }
];

export default function LanguageSwitcher() {
  // Get browser language or previous selection
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(
    languages.find(lang => lang.code === localStorage.getItem('language') as LangCode) || languages[0]
  );

  // Set initial document direction and language on mount
  useEffect(() => {
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.direction;
    localStorage.setItem('language', currentLanguage.code);
    
    // Add the corresponding language class to the body
    if (currentLanguage.code === 'ar') {
      document.body.classList.add('ar');
      document.body.classList.remove('en');
    } else {
      document.body.classList.add('en');
      document.body.classList.remove('ar');
    }
  }, [currentLanguage]);

  // Switch language
  const switchLanguage = (language: LanguageOption) => {
    setCurrentLanguage(language);
  };

  // Get the translation for "Change Language" based on current language
  const changeLanguageText = translations[currentLanguage.code].changeLanguage;

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setAppLanguage: switchLanguage 
    }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-10 h-10 bg-white/10 hover:bg-white/20 text-white"
            aria-label={changeLanguageText}
          >
            <Languages className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-teal-500/20">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className={`cursor-pointer hover:bg-white/10 focus:bg-white/10 ${
                currentLanguage.code === language.code ? 'bg-white/10 text-teal-300' : 'text-white'
              }`}
              onClick={() => switchLanguage(language)}
            >
              <span className={language.code === 'ar' ? 'ar' : ''}>{language.nativeName}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </LanguageContext.Provider>
  );
}