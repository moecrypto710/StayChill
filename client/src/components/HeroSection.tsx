import { useState } from "react";
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

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [guestCount, setGuestCount] = useState("1 Person");

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (selectedLocation !== "All Locations") {
      searchParams.set("location", selectedLocation);
    }
    
    if (dateRange.from && dateRange.to) {
      searchParams.set("checkIn", dateRange.from.toISOString());
      searchParams.set("checkOut", dateRange.to.toISOString());
    }
    
    if (guestCount !== "1 Person") {
      const guestNumber = guestCount.split(" ")[0];
      searchParams.set("guests", guestNumber);
    }
    
    setLocation(`/properties?${searchParams.toString()}`);
  };

  return (
    <section className="relative h-[500px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"}}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Your Perfect Beachside Getaway</h1>
          <p className="text-xl text-white mb-8">Premium vacation rentals in Sahel & Ras El Hekma</p>
          
          {/* Search Form */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Locations">All Locations</SelectItem>
                    <SelectItem value="Sahel">Sahel</SelectItem>
                    <SelectItem value="Ras El Hekma">Ras El Hekma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Check-in / Check-out</Label>
                <DateRangePicker 
                  date={dateRange} 
                  onDateChange={setDateRange} 
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1">Guests</Label>
                <Select value={guestCount} onValueChange={setGuestCount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select guest count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 Person">1 Person</SelectItem>
                    <SelectItem value="2 People">2 People</SelectItem>
                    <SelectItem value="3 People">3 People</SelectItem>
                    <SelectItem value="4+ People">4+ People</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                onClick={handleSearch}
              >
                Search Available Properties
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
