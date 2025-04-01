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
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
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
    navigate('/login');
    closeMenu();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-teal-800/95 backdrop-blur-md shadow-lg" 
          : "bg-gradient-to-r from-slate-900/80 via-blue-900/80 to-teal-800/80 backdrop-blur-sm"
      }`}
    >
      <div className="container py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold text-white flex items-center group"
            onClick={closeMenu}
          >
            <div className="bg-white/10 rounded-full p-2 mr-2 group-hover:bg-white/20 transition-all duration-300">
              <UmbrellaIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col items-center">
              <span className="hidden sm:inline tracking-wider">STAY CHILL</span>
              <span className="sm:hidden tracking-wider">SC</span>
              <div className="h-0.5 w-12 bg-gradient-to-r from-teal-400 via-blue-400 to-amber-400 mt-1 hidden sm:block"></div>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            className={`font-medium transition-colors hover:text-amber-300 ${
              isActive('/') ? 'text-amber-300' : 'text-white/90'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/properties" 
            className={`font-medium transition-colors hover:text-amber-300 ${
              isActive('/properties') ? 'text-amber-300' : 'text-white/90'
            }`}
          >
            Properties
          </Link>
          <Link 
            href="/about" 
            className={`font-medium transition-colors hover:text-amber-300 ${
              isActive('/about') ? 'text-amber-300' : 'text-white/90'
            }`}
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className={`font-medium transition-colors hover:text-amber-300 ${
              isActive('/contact') ? 'text-amber-300' : 'text-white/90'
            }`}
          >
            Contact
          </Link>
        </nav>
        
        {/* Desktop Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {!isMobile && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full w-10 h-10 bg-white/10 hover:bg-white/20 text-white"
              >
                <Search className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Search</span>
              </Button>
              
              <LanguageSwitcher />
              
              <ThemeSwitcher />
              
              {isAuthenticated && (
                <Link 
                  href="/list-property" 
                  className="hidden md:inline-block text-teal-300 hover:text-teal-200 font-medium"
                >
                  List Property
                </Link>
              )}
            </>
          )}
          
          {!isAuthenticated ? (
            <Link href="/login">
              <Button 
                variant="default" 
                size={isMobile ? "sm" : "default"} 
                className="rounded-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-white shadow-lg shadow-primary/20"
              >
                {isMobile ? <User className="h-4 w-4" /> : "Sign In"}
              </Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="default" 
                  size={isMobile ? "sm" : "default"} 
                  className="rounded-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-white shadow-lg shadow-primary/20"
                >
                  {isMobile ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.username}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-teal-500/20">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="cursor-pointer hover:bg-white/10 text-white focus:text-white focus:bg-white/10" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 text-teal-300" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <button 
            className="md:hidden flex items-center justify-center text-white/90" 
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
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""} bg-gradient-to-br from-slate-900/95 via-blue-900/95 to-teal-800/95`}>
        <nav className="flex flex-col gap-6">
          <Link 
            href="/" 
            className="text-2xl font-semibold text-white hover:text-amber-300 transition-colors"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            href="/properties" 
            className="text-2xl font-semibold text-white hover:text-amber-300 transition-colors"
            onClick={closeMenu}
          >
            Properties
          </Link>
          <Link 
            href="/about" 
            className="text-2xl font-semibold text-white hover:text-amber-300 transition-colors"
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className="text-2xl font-semibold text-white hover:text-amber-300 transition-colors"
            onClick={closeMenu}
          >
            Contact
          </Link>
          
          {isAuthenticated && (
            <Link 
              href="/list-property" 
              className="text-2xl font-semibold text-white hover:text-amber-300 transition-colors"
              onClick={closeMenu}
            >
              List Your Property
            </Link>
          )}
          
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-center">
                <span className="text-white/80 mr-3">تغيير اللغة</span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white/80 mr-3">وضع الإضاءة</span>
                <ThemeSwitcher />
              </div>
            </div>
            
            {!isAuthenticated ? (
              <Link href="/login">
                <Button 
                  className="w-full rounded-full py-6 text-lg bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-white shadow-lg shadow-primary/20"
                  onClick={closeMenu}
                >
                  Sign In
                </Button>
              </Link>
            ) : (
              <div className="space-y-4">
                <div className="px-4 py-3 bg-white/10 rounded-lg">
                  <p className="font-medium text-white/80">Signed in as:</p>
                  <p className="font-bold text-teal-300">{user?.username}</p>
                </div>
                <Button 
                  variant="outline"
                  className="w-full rounded-full py-6 text-lg border-teal-500/30 text-teal-300 hover:bg-teal-600/20 hover:text-teal-200 hover:border-teal-500/50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5 rtl-mr" />
                  <span>Log Out</span>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
