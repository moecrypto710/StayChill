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
import { DateRange } from "@/lib/types";
import { Search, MapPin, Home, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from './LanguageSwitcher';
import { useTranslation } from "@/lib/translations";

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
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);
  const isRtl = currentLanguage.direction === 'rtl';

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

  if (!mounted) return null;

  return (
    <section className="py-6 md:py-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Hero text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              {isRtl ? (
                <>اعثر على المكان المثالي لل<span className="text-emerald-500">{t('stayInEgypt')}</span></>
              ) : (
                <>Find the perfect place to <span className="text-emerald-500">{t('stayInEgypt')}</span></>
              )}
            </h1>
            <p className="text-sm sm:text-md text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('discoverProperties')}
            </p>
          </div>
          
          {/* Compact Search Form */}
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700">
              <div className="p-2 flex-1">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{t('where')}</p>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full border-0 p-0 shadow-none focus:ring-0 text-gray-600 dark:text-gray-300 h-7 text-sm">
                    <SelectValue placeholder={t('anywhere')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Locations">{t('anywhere')}</SelectItem>
                    <SelectItem value="Sahel">Sahel</SelectItem>
                    <SelectItem value="Ras El Hekma">Ras El Hekma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2 flex-1">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{t('when')}</p>
                <DateRangePicker 
                  date={dateRange} 
                  onDateChange={(date) => date && setDateRange(date as any)}
                  className="border-0 p-0 shadow-none focus:ring-0 text-sm"
                />
              </div>
              
              <div className="p-2 flex-1 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{t('who')}</p>
                  <Select value={guestCount} onValueChange={setGuestCount}>
                    <SelectTrigger className="w-full border-0 p-0 shadow-none focus:ring-0 text-gray-600 dark:text-gray-300 h-7 text-sm">
                      <SelectValue placeholder={t('addGuests')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Person">1 {t('guests')}</SelectItem>
                      <SelectItem value="2 People">2 {t('guests')}</SelectItem>
                      <SelectItem value="3 People">3 {t('guests')}</SelectItem>
                      <SelectItem value="4 People">4 {t('guests')}</SelectItem>
                      <SelectItem value="5+ People">5+ {t('guests')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="rounded-full bg-primary hover:bg-primary/90 text-white"
                  size="sm"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4 mr-1" />
                  <span>{t('search')}</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Compact Stats bar */}
          <div className="flex flex-wrap gap-4 justify-center mt-6 text-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Home className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('verifiedProperties')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('averageRating')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('primeLocations')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
