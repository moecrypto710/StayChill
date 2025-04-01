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
import { DateRange } from "@/lib/types";
import { Search, Calendar, Users, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Modern beach image with better quality and mobile optimization
const heroImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

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
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
      <div className="relative container h-full flex flex-col justify-center">
        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Discover Your Perfect <span className="text-primary/90">Beachside Getaway</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Premium vacation rentals in Sahel & Ras El Hekma
            </p>
          </div>
          
          {/* Search Form - Responsive design */}
          <div className="bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 text-primary/80" />
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
                  <Calendar className="h-4 w-4 text-primary/80" />
                  <span>When</span>
                </Label>
                <DateRangePicker 
                  date={dateRange} 
                  onDateChange={(date) => date && setDateRange(date)}
                  className="border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Users className="h-4 w-4 text-primary/80" />
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
                className="w-full rounded-full btn-primary group"
                onClick={handleSearch}
                size={isMobile ? "default" : "lg"}
              >
                <Search className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                {isMobile ? "Search" : "Search Available Properties"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
