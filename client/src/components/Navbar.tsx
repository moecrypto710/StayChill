import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  UmbrellaIcon,
  Menu as MenuIcon,
  X as XIcon,
  User,
  Search,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth";
import LanguageSwitcher, { useLanguage } from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import LoginModal from "./LoginModal";
import { useTranslation } from "@/lib/translations";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white shadow-md dark:bg-gray-900" 
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold text-emerald-500 flex items-center group"
            onClick={closeMenu}
          >
            <div className="p-1 mr-2 group-hover:text-emerald-600 transition-all duration-300">
              <UmbrellaIcon className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="hidden sm:inline tracking-tight">staychill</span>
              <span className="sm:hidden tracking-tight">sc</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`font-medium transition-colors hover:text-emerald-500 ${
              isActive('/') ? 'text-emerald-500' : 'text-gray-700 dark:text-gray-300'
            }`}
            dir={currentLanguage.direction}
          >
            {t('home')}
          </Link>
          <Link 
            href="/properties" 
            className={`font-medium transition-colors hover:text-emerald-500 ${
              isActive('/properties') ? 'text-emerald-500' : 'text-gray-700 dark:text-gray-300'
            }`}
            dir={currentLanguage.direction}
          >
            {t('properties')}
          </Link>
          <Link 
            href="/about" 
            className={`font-medium transition-colors hover:text-emerald-500 ${
              isActive('/about') ? 'text-emerald-500' : 'text-gray-700 dark:text-gray-300'
            }`}
            dir={currentLanguage.direction}
          >
            {t('aboutUs')}
          </Link>
          <Link 
            href="/contact" 
            className={`font-medium transition-colors hover:text-emerald-500 ${
              isActive('/contact') ? 'text-emerald-500' : 'text-gray-700 dark:text-gray-300'
            }`}
            dir={currentLanguage.direction}
          >
            {t('contact')}
          </Link>
          
          {/* Language and Theme Switchers */}
          <div className="flex items-center gap-2 ml-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </nav>
        
        {/* Desktop Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {!isMobile && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Search className="h-4 w-4 mr-2" />
                <span>{t('search')}</span>
              </Button>
              
              {isAuthenticated && (
                <Link 
                  href="/list-property" 
                  className="hidden md:inline-block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    dir={currentLanguage.direction}
                  >
                    {t('listProperty')}
                  </Button>
                </Link>
              )}
            </>
          )}
          
          {!isAuthenticated ? (
            <Button 
              variant="default" 
              size="sm"
              className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              onClick={() => setIsLoginModalOpen(true)}
              dir={currentLanguage.direction}
            >
              {isMobile ? <User className="h-4 w-4" /> : t('signIn')}
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full flex items-center gap-2 border-gray-300 dark:border-gray-700"
                >
                  <MenuIcon className="h-4 w-4" />
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel dir={currentLanguage.direction}>
                  {currentLanguage.code === 'ar' ? `مرحباً، ${user?.username}` : `Welcome, ${user?.username}`}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" dir={currentLanguage.direction}>
                  {currentLanguage.code === 'ar' ? 'رحلاتي' : 'My Trips'}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" dir={currentLanguage.direction}>
                  {currentLanguage.code === 'ar' ? 'المفضلة' : 'Wishlists'}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" dir={currentLanguage.direction}>
                  {currentLanguage.code === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout} dir={currentLanguage.direction}>
                  <LogOut className={`${currentLanguage.code === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  <span>{t('logOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <button 
            className="md:hidden flex items-center justify-center text-gray-700 dark:text-gray-300" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu with animation */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""} bg-white dark:bg-gray-900`}>
        <nav className="flex flex-col gap-6 p-4">
          <Link 
            href="/" 
            className="text-xl font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors"
            onClick={closeMenu}
            dir={currentLanguage.direction}
          >
            {t('home')}
          </Link>
          <Link 
            href="/properties" 
            className="text-xl font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors"
            onClick={closeMenu}
            dir={currentLanguage.direction}
          >
            {t('properties')}
          </Link>
          <Link 
            href="/about" 
            className="text-xl font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors"
            onClick={closeMenu}
            dir={currentLanguage.direction}
          >
            {t('aboutUs')}
          </Link>
          <Link 
            href="/contact" 
            className="text-xl font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors"
            onClick={closeMenu}
            dir={currentLanguage.direction}
          >
            {t('contact')}
          </Link>
          
          <div className="my-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            {isAuthenticated && (
              <Link 
                href="/list-property" 
                className="text-xl font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors"
                onClick={closeMenu}
                dir={currentLanguage.direction}
              >
                {t('listProperty')}
              </Link>
            )}
          </div>
          
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 dark:text-gray-300" dir={currentLanguage.direction}>{t('language')}</span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-700 dark:text-gray-300">
                {currentLanguage.code === 'ar' ? 'المظهر' : 'Theme'}
              </span>
              <ThemeSwitcher />
            </div>
            
            {!isAuthenticated ? (
              <Button 
                className="w-full rounded-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                onClick={() => {
                  closeMenu();
                  setIsLoginModalOpen(true);
                }}
                dir={currentLanguage.direction}
              >
                {t('signIn')}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium text-gray-600 dark:text-gray-400" dir={currentLanguage.direction}>
                    {currentLanguage.code === 'ar' ? 'مسجل الدخول كـ:' : 'Signed in as:'}
                  </p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">{user?.username}</p>
                </div>
                <Button 
                  variant="outline"
                  className="w-full rounded-full py-5 text-emerald-500 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900 dark:hover:bg-emerald-900/20"
                  onClick={handleLogout}
                  dir={currentLanguage.direction}
                >
                  <LogOut className={`${currentLanguage.code === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5`} />
                  <span>{t('logOut')}</span>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
}
