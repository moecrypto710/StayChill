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

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
