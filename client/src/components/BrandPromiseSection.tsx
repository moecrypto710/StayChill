import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, Bell, Shield } from "lucide-react";

export default function BrandPromiseSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Stay Chill?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best vacation rental experience in Egypt's most beautiful coastal destinations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-ocean-100 rounded-full text-ocean-600">
              <Home className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Curated Properties</h3>
            <p className="text-gray-600">We personally verify all properties to ensure they meet our high standards of quality, comfort, and location</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-ocean-100 rounded-full text-ocean-600">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Local Support</h3>
            <p className="text-gray-600">Our team is available 24/7 to assist you during your stay and ensure everything goes smoothly</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-ocean-100 rounded-full text-ocean-600">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Booking</h3>
            <p className="text-gray-600">Book with confidence knowing that your reservation and payment are protected by our secure system</p>
          </div>
        </div>
        
        <div className="mt-16 bg-sand-100 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold mb-2">Ready to Experience the Perfect Getaway?</h3>
            <p className="text-gray-600">Find your dream vacation rental in Sahel or Ras El Hekma today</p>
          </div>
          <Link href="/properties">
            <Button className="px-8 py-6 bg-coral-500 hover:bg-coral-600 text-white whitespace-nowrap">
              Start Browsing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
