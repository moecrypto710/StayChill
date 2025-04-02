import { 
  UmbrellaIcon, 
  Facebook, 
  Instagram, 
  Twitter,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState<string>("destinations");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    alert(`Thanks for subscribing with: ${email}!`);
    setEmail("");
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container">
        {/* Compact footer top section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Logo and subscription */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <UmbrellaIcon className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold">StayChill</h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Premium vacation rentals in Egypt's coastal destinations
            </p>
            
            {/* Simplified newsletter */}
            <form onSubmit={handleSubmit} className="flex mb-4">
              <Input
                type="email"
                placeholder="Email for updates"
                className="rounded-l-md rounded-r-none focus:ring-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 rounded-l-none text-white"
              >
                Join
              </Button>
            </form>
            
            {/* Simplified social icons */}
            <div className="flex gap-3">
              <a href="#" className="text-gray-500 hover:text-emerald-500" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-500" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-500" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Mobile-friendly footer sections */}
          <div className="md:w-2/3">
            <div className="flex mb-4 border-b border-gray-200 dark:border-gray-800">
              {["destinations", "company", "support", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    activeSection === section 
                      ? "text-emerald-500 border-b-2 border-emerald-500" 
                      : "text-gray-600 dark:text-gray-400 hover:text-emerald-500"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
            
            {activeSection === "destinations" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Sahel", "Ras El Hekma", "North Coast", "Marina", "Marassi"].map(dest => (
                  <Link 
                    key={dest}
                    href={`/properties?location=${encodeURIComponent(dest)}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 text-sm flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    {dest}
                  </Link>
                ))}
              </div>
            )}
            
            {activeSection === "company" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  {name: "About Us", href: "/about"}, 
                  {name: "How It Works", href: "/about"}, 
                  {name: "List Property", href: "/list-property"},
                  {name: "Careers", href: "/about"},
                  {name: "Contact", href: "/contact"}
                ].map(item => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 text-sm flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            
            {activeSection === "support" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  {name: "Help Center", href: "/contact"}, 
                  {name: "Safety Info", href: "/about"}, 
                  {name: "Cancellations", href: "/about"},
                  {name: "Trust & Safety", href: "/about"},
                  {name: "FAQ", href: "/contact"}
                ].map(item => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 text-sm flex items-center"
                  >
                    <ChevronRight className="h-3 w-3 mr-1" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            
            {activeSection === "contact" && (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">123 Beach Road, North Coast, Egypt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">+20 123 456 7890</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">info@staychill.com</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Simplified bottom footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs">
            © {currentYear} StayChill. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map(item => (
              <Link 
                key={item}
                href="/about" 
                className="text-gray-500 hover:text-emerald-500 text-xs"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
