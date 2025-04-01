import { 
  UmbrellaIcon, 
  Facebook, 
  Instagram, 
  Twitter, 
  Send,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    alert(`Thanks for subscribing with: ${email}!`);
    setEmail("");
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Logo & About - 4 columns on large screens */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <UmbrellaIcon className="h-8 w-8 mr-3 text-primary" />
              <span className="text-2xl font-bold">Stay Chill</span>
            </div>
            
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Premium vacation rentals in Egypt's most beautiful coastal destinations. 
              Find your perfect beachside getaway in Sahel and Ras El Hekma.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="text-base font-semibold mb-3">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800/50 border-gray-700 text-white text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-primary/90">Destinations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/properties?location=Sahel" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Sahel
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties?location=Ras%20El%20Hekma" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Ras El Hekma
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  North Coast
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Marina
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Marassi
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-primary/90">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/list-property" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  List Your Property
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-primary/90">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Safety Information
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-primary transition-colors flex items-center"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-primary/90">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary/80 mt-0.5 shrink-0" />
                <span className="text-gray-300">
                  123 Beach Road, North Coast, Egypt
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary/80 shrink-0" />
                <span className="text-gray-300">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary/80 shrink-0" />
                <span className="text-gray-300">info@staychill.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom footer - Copyright & Legal Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Stay Chill. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/about" 
                className="text-gray-400 hover:text-primary transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/about" 
                className="text-gray-400 hover:text-primary transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link 
                href="/about" 
                className="text-gray-400 hover:text-primary transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
