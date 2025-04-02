import { 
  UmbrellaIcon, 
  Facebook, 
  Instagram, 
  Twitter,
  Mail,
  Phone,
  MapPin,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <footer className="bg-gray-900 text-white py-8">
      <div className="container">
        {/* Compact footer top section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Logo and subscription */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <UmbrellaIcon className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold">StayChill</h2>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">
              Premium vacation rentals in Egypt's coastal destinations
            </p>
            
            {/* Simplified newsletter */}
            <form onSubmit={handleSubmit} className="flex mb-4">
              <Input
                type="email"
                placeholder="Email for updates"
                className="bg-gray-800 border-gray-700 text-sm rounded-l-md rounded-r-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 rounded-l-none"
              >
                Join
              </Button>
            </form>
            
            {/* Simplified social icons */}
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Mobile-friendly tabs for links */}
          <div className="md:w-2/3">
            <Tabs defaultValue="destinations" className="w-full">
              <TabsList className="w-full bg-gray-800 mb-3 h-10">
                <TabsTrigger value="destinations" className="text-xs">Destinations</TabsTrigger>
                <TabsTrigger value="company" className="text-xs">Company</TabsTrigger>
                <TabsTrigger value="support" className="text-xs">Support</TabsTrigger>
                <TabsTrigger value="contact" className="text-xs">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="destinations" className="mt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["Sahel", "Ras El Hekma", "North Coast", "Marina", "Marassi"].map(dest => (
                    <Link 
                      key={dest}
                      href={`/properties?location=${encodeURIComponent(dest)}`}
                      className="text-gray-400 hover:text-emerald-400 text-sm flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {dest}
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="company" className="mt-0">
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
                      className="text-gray-400 hover:text-emerald-400 text-sm flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="support" className="mt-0">
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
                      className="text-gray-400 hover:text-emerald-400 text-sm flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="mt-0">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-gray-400 text-sm">123 Beach Road, North Coast, Egypt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-gray-400 text-sm">+20 123 456 7890</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-gray-400 text-sm">info@staychill.com</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Simplified bottom footer */}
        <div className="border-t border-gray-800 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs">
            © {currentYear} StayChill. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map(item => (
              <Link 
                key={item}
                href="/about" 
                className="text-gray-500 hover:text-emerald-400 text-xs"
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
