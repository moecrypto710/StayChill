import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import LoginModal from './LoginModal';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Automatically log in as guest if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login("guest", "guest123");
    }
  }, [isLoading, isAuthenticated, login]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  // Login button on the navbar will open this modal
  const handleCloseModal = () => {
    setShowLoginModal(false);
  };
  
  return (
    <>
      {/* Always show content - no welcome screen */}
      {children}
      
      {/* Login modal is now controlled by Navbar */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseModal} 
      />
    </>
  );
}