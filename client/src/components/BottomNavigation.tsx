import { useLocation } from "wouter";
import { Home, Search, Heart, User, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "@/lib/translations";
import { useLanguage } from "./LanguageSwitcher";
import LoginModal from "./LoginModal";
import { useState } from "react";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 shadow-lg py-3 border-t border-gray-300 dark:border-gray-700">
        <div className="flex justify-around">
          <NavItem
            icon={<Home size={20} />}
            label={t('home')}
            active={isActive('/')}
            onClick={() => navigate('/')}
          />
          <NavItem
            icon={<Search size={20} />}
            label={t('search')}
            active={isActive('/search')}
            onClick={() => navigate('/properties')}
          />
          <NavItem
            icon={<Building2 size={20} />}
            label={t('properties')}
            active={isActive('/properties')}
            onClick={() => navigate('/properties')}
          />
          <NavItem
            icon={<Heart size={20} />}
            label={t('favorites')}
            active={isActive('/favorites')}
            onClick={() => {
              if (isAuthenticated) {
                navigate('/favorites');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />
          <NavItem
            icon={<User size={20} />}
            label={t('account')}
            active={isActive('/profile')}
            onClick={() => {
              if (isAuthenticated) {
                navigate('/profile');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      className={`flex flex-col items-center justify-center py-2 transition-all transform hover:scale-110 duration-200 ease-in-out ${
        active 
          ? 'text-green-600' 
          : 'text-gray-500 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
      }`}
      onClick={onClick}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}