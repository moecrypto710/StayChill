import { useLocation } from "wouter";
import { Home, Search, User, Building2, MessageSquare, Trophy, MapPin } from "lucide-react";
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
            active={isActive('/properties')}
            onClick={() => navigate('/properties')}
          />
          <NavItem
            icon={<MapPin size={20} />}
            label={t('destinations')}
            active={isActive('/destinations') || location.startsWith('/destinations/')}
            onClick={() => navigate('/destinations')}
          />
          <NavItem
            icon={<MessageSquare size={20} />}
            label={t('inbox')}
            active={isActive('/inbox')}
            onClick={() => {
              if (isAuthenticated) {
                navigate('/inbox');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
          />
          <NavItem
            icon={<Trophy size={20} />}
            label={currentLanguage.code === 'ar' ? 'النقاط' : 'Points'}
            active={isActive('/rewards')}
            onClick={() => {
              if (isAuthenticated) {
                navigate('/rewards');
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            badge="120"
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
  badge?: string;
}

function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      className={`flex flex-col items-center justify-center py-2 transition-all transform hover:scale-110 duration-200 ease-in-out ${
        active 
          ? 'text-green-600' 
          : 'text-gray-500 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
      }`}
      onClick={onClick}
    >
      <div className="mb-1.5 relative">
        {icon}
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[11px] font-medium leading-none">{label}</span>
    </button>
  );
}