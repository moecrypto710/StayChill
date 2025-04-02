import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "@/lib/types";
import { Search, Calendar, Users, MapPin, Home, Star, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Higher quality beach image with vibrant colors
const heroImageUrl = "https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [guestCount, setGuestCount] = useState("1 Person");
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  // Make sure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (selectedLocation !== "All Locations") {
      searchParams.set("location", selectedLocation);
    }
    
    if (dateRange?.from && dateRange?.to) {
      searchParams.set("checkIn", dateRange.from.toISOString());
      searchParams.set("checkOut", dateRange.to.toISOString());
    }
    
    if (guestCount !== "1 Person") {
      const guestNumber = guestCount.split(" ")[0];
      searchParams.set("guests", guestNumber);
    }
    
    setLocation(`/properties?${searchParams.toString()}`);
  };

  // Set CSS variable for hero image to avoid style attribute
  useEffect(() => {
    document.documentElement.style.setProperty('--hero-image', `url(${heroImageUrl})`);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-6 md:py-12 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Hero text */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Find the perfect place to <span className="text-rose-500">stay in Egypt</span>
            </h1>
            <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover amazing properties in Sahel & Ras El Hekma with panoramic sea views and luxury amenities
            </p>
          </div>
          
          {/* Search Form - Airbnb-like design */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
              <div className="p-2 md:p-3 md:pl-6 flex-1">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Where</p>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full border-0 p-0 shadow-none focus:ring-0 text-gray-600 dark:text-gray-300">
                      <SelectValue placeholder="Select a destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Locations">Anywhere</SelectItem>
                      <SelectItem value="Sahel">Sahel</SelectItem>
                      <SelectItem value="Ras El Hekma">Ras El Hekma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-2 md:p-3 md:px-6 flex-1">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">When</p>
                  <DateRangePicker 
                    date={dateRange} 
                    onDateChange={(date) => date && setDateRange(date as any)}
                    className="border-0 p-0 shadow-none focus:ring-0"
                  />
                </div>
              </div>
              
              <div className="p-2 md:p-3 md:px-6 flex-1 md:flex md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Who</p>
                  <Select value={guestCount} onValueChange={setGuestCount}>
                    <SelectTrigger className="w-full border-0 p-0 shadow-none focus:ring-0 text-gray-600 dark:text-gray-300">
                      <SelectValue placeholder="Add guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Person">1 Person</SelectItem>
                      <SelectItem value="2 People">2 People</SelectItem>
                      <SelectItem value="3 People">3 People</SelectItem>
                      <SelectItem value="4 People">4 People</SelectItem>
                      <SelectItem value="5+ People">5+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="hidden md:flex mt-3 md:mt-0 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white"
                  size="sm"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            {/* Mobile search button */}
            <div className="mt-4 md:hidden">
              <Button 
                className="w-full rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          {/* Stats bar - Similar to Airbnb's trust indicators */}
          <div className="flex flex-wrap gap-6 justify-center mt-12 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-2 p-2 rounded-full bg-rose-100 dark:bg-rose-900/20">
                <Home className="h-5 w-5 text-rose-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">200+ Verified Properties</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 p-2 rounded-full bg-rose-100 dark:bg-rose-900/20">
                <Star className="h-5 w-5 text-rose-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">4.8 Average Rating</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 p-2 rounded-full bg-rose-100 dark:bg-rose-900/20">
                <MapPin className="h-5 w-5 text-rose-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Prime Beachfront Locations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
