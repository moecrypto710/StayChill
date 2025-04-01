import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ListProperty from "./pages/ListProperty";
import Login from "./pages/Login";
import NotFound from "./pages/not-found";
import { useAuth } from "./lib/auth";
import LanguageSwitcher, { LanguageContext } from "./components/LanguageSwitcher";
import { ThemeProvider } from "./components/ThemeSwitcher";
import { useState, useEffect, useContext } from "react";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // Get the current language from context
  const { currentLanguage } = useContext(LanguageContext);
  
  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;
    
    // Apply language-specific class to body for RTL/LTR text rendering
    if (currentLanguage.code === 'ar') {
      document.body.classList.add('ar');
      document.body.classList.remove('en');
    } else {
      document.body.classList.add('en');
      document.body.classList.remove('ar');
    }
  }, [currentLanguage]);
  
  return (
    <div className={`flex flex-col min-h-screen ${currentLanguage.code === 'ar' ? 'ar' : ''}`}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public route - Login page */}
      <Route path="/login">
        <Login />
      </Route>
      
      {/* Protected routes - Require authentication */}
      <Route path="/">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Home />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/properties">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Properties />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/property/:id">
        {(params) => (
          <ProtectedRoute>
            <AuthenticatedLayout>
              <PropertyDetail />
            </AuthenticatedLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/about">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <About />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/contact">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Contact />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/list-property">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <ListProperty />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      
      {/* Catch all route */}
      <Route>
        <ProtectedRoute>
          <AuthenticatedLayout>
            <NotFound />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  // Get language type from LanguageContext
  type LanguageOption = {
    code: 'en' | 'ar';
    name: string;
    direction: 'ltr' | 'rtl';
    nativeName: string;
  };
  
  // Create language state for the app
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>({
    code: (localStorage.getItem('language') as 'en' | 'ar') || 'en',
    name: localStorage.getItem('language') === 'ar' ? 'Arabic' : 'English',
    direction: localStorage.getItem('language') === 'ar' ? 'rtl' : 'ltr',
    nativeName: localStorage.getItem('language') === 'ar' ? 'العربية' : 'English'
  });

  // Function to set the language
  const setAppLanguage = (language: LanguageOption) => {
    setCurrentLanguage(language);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageContext.Provider value={{ currentLanguage, setAppLanguage }}>
            <Router />
          </LanguageContext.Provider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
