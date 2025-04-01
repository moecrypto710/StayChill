import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CtaSection() {
  return (
    <section className="py-16 bg-ocean-600 relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"}}>
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Own a Property in Sahel or Ras El Hekma?</h2>
          <p className="text-xl text-white mb-8">Join our community of property owners and start earning from your vacation home today</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/list-property">
              <Button 
                className="px-8 py-6 bg-white text-ocean-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                List Your Property
              </Button>
            </Link>
            <Link href="/about">
              <Button 
                variant="outline" 
                className="px-8 py-6 bg-transparent border-2 border-white text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
