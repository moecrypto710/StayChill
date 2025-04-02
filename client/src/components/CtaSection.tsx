import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, Info } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-8 bg-gradient-to-br from-emerald-600 to-emerald-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0 md:mr-6 md:max-w-md">
            <h2 className="text-2xl font-bold text-white">Own a property in Sahel?</h2>
            <p className="text-emerald-100 mt-2 text-sm md:text-base">List your vacation home and start earning today</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/list-property">
              <Button 
                size="sm"
                className="bg-white text-emerald-600 hover:bg-emerald-50 flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                List Your Property
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="outline" 
                size="sm"
                className="border border-white text-white hover:bg-white/10 flex items-center"
              >
                <Info className="h-4 w-4 mr-2" />
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
