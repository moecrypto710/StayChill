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
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 text-white pt-16 pb-8">
      <div className="container">
        {/* Wave divider at the top */}
        <div className="absolute top-0 inset-x-0 h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMzY0ODAyMCI+PHBhdGggZD0iTTEyODAgMEw2NDAgNzAgMCAwdjE0MGgxMjgweiIvPjwvZz48L3N2Zz4=')] bg-bottom bg-no-repeat opacity-30 transform rotate-180"></div>
      
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Logo & About - 4 columns on large screens */}
          <div className="lg:col-span-4">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-3">
                <UmbrellaIcon className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold tracking-wider">STAY CHILL</h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-teal-400 via-blue-400 to-amber-400 mx-auto lg:mx-0 mt-3"></div>
            </div>
            
            <p className="text-white/80 mb-6 text-sm leading-relaxed text-center lg:text-left">
              Premium vacation rentals in Egypt's most beautiful coastal destinations. 
              Find your perfect beachside getaway in Sahel and Ras El Hekma.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h4 className="text-base font-semibold mb-3 text-center lg:text-left">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white text-sm focus:border-teal-400/50 focus:ring-teal-400/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  size="sm"
                  className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 text-white rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4 justify-center lg:justify-start">
              <a 
                href="#" 
                className="bg-white/10 backdrop-blur-sm p-2.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="bg-white/10 backdrop-blur-sm p-2.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a 
                href="#" 
                className="bg-white/10 backdrop-blur-sm p-2.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
          
          {/* Quick Links - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-teal-300">Destinations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/properties?location=Sahel" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Sahel
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties?location=Ras%20El%20Hekma" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Ras El Hekma
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  North Coast
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Marina
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Marassi
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-teal-300">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/list-property" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  List Your Property
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-teal-300">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/contact" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Safety Information
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Cancellation Options
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-white/80 hover:text-amber-300 transition-colors flex items-center"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-4 text-teal-300">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-white/80">
                  123 Beach Road, North Coast, Egypt
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-white/80">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400 shrink-0" />
                <span className="text-white/80">info@staychill.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom footer - Copyright & Legal Links */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} STAY CHILL. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/about" 
                className="text-white/60 hover:text-amber-300 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/about" 
                className="text-white/60 hover:text-amber-300 transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link 
                href="/about" 
                className="text-white/60 hover:text-amber-300 transition-colors text-sm"
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
