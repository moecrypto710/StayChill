import { UmbrellaIcon } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="text-2xl font-bold mb-4 flex items-center">
              <UmbrellaIcon className="mr-2 text-coral-400" />
              <span>Stay Chill</span>
            </div>
            <p className="text-gray-400 mb-4">Premium vacation rentals in Egypt's most beautiful coastal destinations.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Destinations</h4>
            <ul className="space-y-2">
              <li><Link href="/properties?location=Sahel" className="text-gray-400 hover:text-white transition-colors">Sahel</Link></li>
              <li><Link href="/properties?location=Ras%20El%20Hekma" className="text-gray-400 hover:text-white transition-colors">Ras El Hekma</Link></li>
              <li><Link href="/properties" className="text-gray-400 hover:text-white transition-colors">North Coast</Link></li>
              <li><Link href="/properties" className="text-gray-400 hover:text-white transition-colors">Marina</Link></li>
              <li><Link href="/properties" className="text-gray-400 hover:text-white transition-colors">Marassi</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/list-property" className="text-gray-400 hover:text-white transition-colors">List Your Property</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Safety Information</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Cancellation Options</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Trust & Safety</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© {new Date().getFullYear()} Stay Chill. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
