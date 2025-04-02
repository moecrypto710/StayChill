import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ListProperty from "./pages/ListProperty";
import NotFound from "./pages/not-found";
import { useAuth } from "./lib/auth";
import LanguageSwitcher, { LanguageContext } from "./components/LanguageSwitcher";
import { ThemeProvider } from "./components/ThemeSwitcher";
import { useState, useEffect, useContext } from "react";
import Dashboard from "./pages/Dashboard"; // Import the Dashboard component
import BookingChat from "./pages/BookingChat"; // Import the BookingChat component
import BookingDetail from "./pages/BookingDetail"; // Import the BookingDetail component
import Inbox from "./pages/Inbox"; // Import the Inbox component
import Rewards from "./pages/Rewards"; // Import the Rewards component


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
      <BottomNavigation />
    </div>
  );
}

function Router() {
  return (
    <Switch>
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

      <Route path="/dashboard"> {/* Added dashboard route */}
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/bookings/:id/chat"> {/* Chat route for a specific booking */}
        <ProtectedRoute>
          <AuthenticatedLayout>
            <BookingChat />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/bookings/:id"> {/* Booking detail route */}
        <ProtectedRoute>
          <AuthenticatedLayout>
            <BookingDetail />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/inbox"> {/* Inbox/Messages route */}
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Inbox />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/rewards"> {/* Rewards route */}
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Rewards />
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