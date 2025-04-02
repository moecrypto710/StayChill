import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import LoginModal from './LoginModal';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageSwitcher';
import { useTranslation } from '@/lib/translations';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);
  
  // Automatic guest login is disabled, use button instead
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  const handleGuestAccess = () => {
    // Log in as guest
    login("guest", "guest123");
    setShowContent(true);
  };
  
  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
  };
  
  return (
    <>
      {!isAuthenticated && !showContent ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-6 text-center">
            <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              {t('welcomeBack')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('accessExclusive')}
            </p>
            <div className="space-y-4">
              <Button
                onClick={handleOpenLoginModal}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                {t('signIn')}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-700"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    {currentLanguage.code === 'ar' ? 'أو' : 'or'}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleGuestAccess} 
                className="w-full border-gray-300"
                dir={currentLanguage.direction}
              >
                {t('continueAsGuest')}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}