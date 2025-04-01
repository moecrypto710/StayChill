import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  UmbrellaIcon,
  Menu as MenuIcon,
  X as XIcon,
  User,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();

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

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md shadow-md" 
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold text-primary flex items-center"
            onClick={closeMenu}
          >
            <UmbrellaIcon className="w-6 h-6 mr-2 text-primary" />
            <span className="hidden sm:inline">Stay Chill</span>
            <span className="sm:hidden">SC</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            className={`font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/properties" 
            className={`font-medium transition-colors hover:text-primary ${
              isActive('/properties') ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Properties
          </Link>
          <Link 
            href="/about" 
            className={`font-medium transition-colors hover:text-primary ${
              isActive('/about') ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className={`font-medium transition-colors hover:text-primary ${
              isActive('/contact') ? 'text-primary' : 'text-foreground/80'
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
                className="rounded-full w-10 h-10"
              >
                <Search className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Search</span>
              </Button>
              
              <Link 
                href="/list-property" 
                className="hidden md:inline-block text-primary hover:text-primary/80 font-medium"
              >
                List Property
              </Link>
            </>
          )}
          
          <Button 
            variant="default" 
            size={isMobile ? "sm" : "default"} 
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            {isMobile ? <User className="h-4 w-4" /> : "Sign In"}
          </Button>
          
          <button 
            className="md:hidden flex items-center justify-center text-foreground/80" 
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
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <nav className="flex flex-col gap-6">
          <Link 
            href="/" 
            className="text-2xl font-semibold hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            href="/properties" 
            className="text-2xl font-semibold hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            Properties
          </Link>
          <Link 
            href="/about" 
            className="text-2xl font-semibold hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className="text-2xl font-semibold hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            Contact
          </Link>
          <Link 
            href="/list-property" 
            className="text-2xl font-semibold hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            List Your Property
          </Link>
          
          <div className="mt-auto pt-6 border-t">
            <Button 
              className="w-full rounded-full py-6 text-lg btn-primary"
              onClick={closeMenu}
            >
              Sign In
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
