import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, Bell, Shield, ChevronRight } from "lucide-react";

export default function BrandPromiseSection() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Why StayChill?</h2>
          <Link href="/about" className="text-emerald-500 text-sm flex items-center hover:underline">
            Learn more <ChevronRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
          <div className="flex-shrink-0 w-64 border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full text-emerald-600">
                <Home className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">Curated Properties</h3>
            </div>
            <p className="text-gray-600 text-sm">Verified properties meeting our high quality standards</p>
          </div>
          
          <div className="flex-shrink-0 w-64 border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full text-emerald-600">
                <Bell className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
            </div>
            <p className="text-gray-600 text-sm">Local team available anytime during your stay</p>
          </div>
          
          <div className="flex-shrink-0 w-64 border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full text-emerald-600">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">Secure Booking</h3>
            </div>
            <p className="text-gray-600 text-sm">Protected reservations and secure payment system</p>
          </div>
        </div>
        
        <div className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 flex items-center justify-between">
          <div className="text-white">
            <h3 className="font-bold">Find your perfect getaway</h3>
            <p className="text-emerald-50 text-sm">Explore Sahel & Ras El Hekma</p>
          </div>
          <Link href="/properties">
            <Button size="sm" variant="secondary" className="whitespace-nowrap bg-white text-emerald-600 hover:bg-emerald-50">
              Browse Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
