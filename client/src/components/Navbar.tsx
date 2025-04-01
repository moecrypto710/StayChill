import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  UmbrellaIcon,
  Menu as MenuIcon,
  X as XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-ocean-600 flex items-center">
            <UmbrellaIcon className="mr-2 text-coral-400" />
            <span>Stay Chill</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className={`font-medium transition-colors ${isActive('/') ? 'text-ocean-500' : 'hover:text-ocean-500'}`}>
            Home
          </Link>
          <Link href="/properties" className={`font-medium transition-colors ${isActive('/properties') ? 'text-ocean-500' : 'hover:text-ocean-500'}`}>
            Properties
          </Link>
          <Link href="/about" className={`font-medium transition-colors ${isActive('/about') ? 'text-ocean-500' : 'hover:text-ocean-500'}`}>
            About Us
          </Link>
          <Link href="/contact" className={`font-medium transition-colors ${isActive('/contact') ? 'text-ocean-500' : 'hover:text-ocean-500'}`}>
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link href="/list-property" className="hidden md:inline-block text-ocean-600 hover:text-ocean-700 font-medium">
            List Your Property
          </Link>
          <Button variant="default" className="bg-ocean-500 hover:bg-ocean-600 text-white">
            Sign In
          </Button>
          <button 
            className="md:hidden text-gray-500" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md font-medium hover:bg-ocean-50 hover:text-ocean-500">
              Home
            </Link>
            <Link href="/properties" className="block px-3 py-2 rounded-md font-medium hover:bg-ocean-50 hover:text-ocean-500">
              Properties
            </Link>
            <Link href="/about" className="block px-3 py-2 rounded-md font-medium hover:bg-ocean-50 hover:text-ocean-500">
              About Us
            </Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md font-medium hover:bg-ocean-50 hover:text-ocean-500">
              Contact
            </Link>
            <Link href="/list-property" className="block px-3 py-2 rounded-md font-medium hover:bg-ocean-50 hover:text-ocean-500">
              List Your Property
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
