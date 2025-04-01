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
    <section className="hero-section">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30"></div>
      
      {/* Animated wave pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMzY0ODAyMCI+PHBhdGggZD0iTTEyODAgMEw2NDAgNzAgMCAwdjE0MGgxMjgweiIvPjwvZz48L3N2Zz4=')] bg-bottom bg-no-repeat opacity-30"></div>
      
      <div className="relative container h-full flex flex-col justify-center">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 pt-10">
          {/* Badge */}
          <Badge className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium text-sm px-4 py-1.5 border-none">
            Experience Coastal Luxury
          </Badge>
          
          {/* Hero text */}
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Find Your <span className="text-primary">Dream Getaway</span> in Egypt's Finest Beaches
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
              Exclusive vacation rentals with panoramic sea views, luxury amenities, and unforgettable experiences in Sahel & Ras El Hekma
            </p>
          </div>
          
          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center text-white">
              <Home className="h-5 w-5 mr-2 text-primary" />
              <span className="font-bold mr-1.5">200+</span> Properties
            </div>
            <div className="flex items-center text-white">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <span className="font-bold mr-1.5">2</span> Prime Locations
            </div>
            <div className="flex items-center text-white">
              <Star className="h-5 w-5 mr-2 text-primary" />
              <span className="font-bold mr-1.5">4.8</span> Rating
            </div>
          </div>
          
          {/* Search Form - Glassmorphism design */}
          <div className="bg-white/90 backdrop-blur-md p-5 md:p-6 rounded-xl shadow-xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Where</span>
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full border-gray-200 hover:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Locations">All Locations</SelectItem>
                    <SelectItem value="Sahel">Sahel</SelectItem>
                    <SelectItem value="Ras El Hekma">Ras El Hekma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>When</span>
                </Label>
                <DateRangePicker 
                  date={dateRange} 
                  onDateChange={(date) => date && setDateRange(date as any)}
                  className="border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Who</span>
                </Label>
                <Select value={guestCount} onValueChange={setGuestCount}>
                  <SelectTrigger className="w-full border-gray-200 hover:border-primary/50 focus:ring-primary/20">
                    <SelectValue placeholder="Select guest count" />
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
            </div>
            <div className="mt-5">
              <Button 
                className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium shadow-lg shadow-primary/30 group"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                {isMobile ? "Search" : "Find Available Properties"}
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
