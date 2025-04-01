import { useState, useMemo } from 'react';
import { 
  ResponsiveContainer,
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  Tooltip, 
  Cell,
  Legend
} from 'recharts';
import { format, eachDayOfInterval, startOfWeek, endOfMonth, addMonths, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useTheme } from './ThemeSwitcher';
import { useLanguage } from './LanguageSwitcher';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Info } from 'lucide-react';

// Types for price and availability data
interface PricePoint {
  date: string;
  price: number;
  available: boolean;
  bookingCount?: number;
}

export interface AvailabilityData {
  id: number;
  propertyId: number;
  data: PricePoint[];
}

interface PropertyHeatMapProps {
  availabilityData: AvailabilityData;
  onDateSelect?: (date: string, price: number, available: boolean) => void;
  isInteractive?: boolean;
}

// Custom tooltip component for the heatmap
const CustomTooltip = ({ active, payload }: any) => {
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage.code === 'ar';
  const dateLocale = isArabic ? ar : enUS;
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-sm">
          {format(parseISO(data.date), 'PPP', { locale: dateLocale })}
        </p>
        <p className="text-sm">
          <span className="font-medium text-primary">${data.price}</span> / {isArabic ? 'الليلة' : 'night'}
        </p>
        <p className="text-xs mt-1">
          <span className={`inline-block w-2 h-2 rounded-full mr-1 rtl-mr ${
            data.available 
              ? 'bg-emerald-500' 
              : data.bookingCount && data.bookingCount > 0 
                ? 'bg-rose-500' 
                : 'bg-amber-500'
          }`}></span>
          {data.available 
            ? (isArabic ? 'متاح' : 'Available') 
            : data.bookingCount && data.bookingCount > 0 
              ? (isArabic ? 'محجوز' : 'Booked') 
              : (isArabic ? 'غير متاح' : 'Unavailable')}
        </p>
        {data.bookingCount && data.bookingCount > 0 && (
          <p className="text-xs mt-1">
            {isArabic ? `${data.bookingCount} حجوزات` : `${data.bookingCount} bookings`}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function PropertyHeatMap({ 
  availabilityData, 
  onDateSelect,
  isInteractive = true
}: PropertyHeatMapProps) {
  const { theme } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage.code);
  const isArabic = currentLanguage.code === 'ar';
  const dateLocale = isArabic ? ar : enUS;
  
  // Default to current month if no data
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  
  // Prepare data for the selected month
  const monthData = useMemo(() => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = endOfMonth(currentMonth);
    
    // Create an array for each day of the month
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Map each day to a data point
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dataPoint = availabilityData.data.find(d => d.date === dateStr);
      
      if (dataPoint) {
        return {
          day: format(day, 'd'),
          weekday: format(day, 'E', { locale: dateLocale }),
          date: dateStr,
          price: dataPoint.price,
          available: dataPoint.available,
          bookingCount: dataPoint.bookingCount || 0,
          // For chart positioning
          x: parseInt(format(day, 'w')), // Week number
          y: parseInt(format(day, 'i')), // Day of week (0-6)
        };
      }
      
      // For days without data (e.g., previous/next month days visible in calendar)
      return {
        day: format(day, 'd'),
        weekday: format(day, 'E', { locale: dateLocale }),
        date: dateStr,
        price: 0,
        available: false,
        bookingCount: 0,
        x: parseInt(format(day, 'w')), // Week number
        y: parseInt(format(day, 'i')), // Day of week (0-6)
        outOfRange: true,
      };
    });
  }, [currentMonth, availabilityData.data, dateLocale]);
  
  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, -1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  // Handle date selection if interactive
  const handleDotClick = (data: any) => {
    if (isInteractive && onDateSelect && !data.outOfRange) {
      onDateSelect(data.date, data.price, data.available);
    }
  };
  
  // Get color for each data point
  const getDotColor = (data: any) => {
    if (data.outOfRange) return '#e5e7eb'; // gray-200
    if (!data.available) {
      return data.bookingCount > 0 
        ? theme === 'dark' ? '#f43f5e' : '#e11d48' // rose-500 or rose-600 
        : theme === 'dark' ? '#f59e0b' : '#d97706'; // amber-500 or amber-600
    }
    
    // Color based on price (higher price = darker green)
    const priceMax = Math.max(...availabilityData.data.filter(d => d.available).map(d => d.price));
    const priceMin = Math.min(...availabilityData.data.filter(d => d.available).map(d => d.price));
    const range = priceMax - priceMin;
    
    // Normalize price between 0 and 1
    let priceNormalized = range > 0 
      ? (data.price - priceMin) / range 
      : 0.5;
    
    // Adjust the color intensity between emerald-300 and emerald-600
    if (theme === 'dark') {
      // Darker theme colors
      const r = Math.round(52 - (priceNormalized * 30));
      const g = Math.round(211 - (priceNormalized * 100));
      const b = Math.round(153 - (priceNormalized * 80));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Lighter theme colors
      const r = Math.round(16 - (priceNormalized * 10));
      const g = Math.round(185 - (priceNormalized * 50));
      const b = Math.round(129 - (priceNormalized * 50));
      return `rgb(${r}, ${g}, ${b})`;
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2 rtl-mr text-primary" />
          {isArabic 
            ? `توفر وأسعار ${format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}`
            : `${format(currentMonth, 'MMMM yyyy', { locale: dateLocale })} Availability & Prices`
          }
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="mb-2 flex flex-wrap gap-2 items-center">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-1 rtl-mr"></span>
          <span className="text-xs">{isArabic ? 'متاح' : 'Available'}</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-rose-500 rounded-full mr-1 rtl-mr"></span>
          <span className="text-xs">{isArabic ? 'محجوز' : 'Booked'}</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-1 rtl-mr"></span>
          <span className="text-xs">{isArabic ? 'غير متاح' : 'Unavailable'}</span>
        </div>
        <div className="flex items-center ml-auto rtl-ml-auto">
          <DollarSign className="h-3 w-3 text-emerald-600 mr-1 rtl-mr" />
          <span className="text-xs">{isArabic ? 'تدرج اللون يشير إلى السعر' : 'Color shade indicates price'}</span>
        </div>
      </div>
      
      <div className="h-[280px] md:h-[340px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
          >
            <XAxis
              type="number"
              dataKey="x"
              name="week"
              tickLine={false}
              axisLine={false}
              tick={false}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis 
              type="number"
              dataKey="y"
              name="day"
              tickLine={false}
              axisLine={false}
              tick={false}
              reversed={true}
              domain={[0, 6]}
            />
            <ZAxis 
              type="number"
              dataKey="price"
              name="price"
              range={[400, 400]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              name="Calendar"
              data={monthData}
              fill="#8884d8"
              onClick={handleDotClick}
              cursor={isInteractive ? 'pointer' : 'default'}
            >
              {monthData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getDotColor(entry)}
                  opacity={entry.outOfRange ? 0.3 : 1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 text-center mt-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
          <div key={day} className="text-xs text-gray-500 dark:text-gray-400">
            {isArabic ? 
              ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'][idx].substring(0, 3) : 
              day
            }
          </div>
        ))}
      </div>
      
      {isInteractive && (
        <div className="flex items-center justify-center mt-4 text-xs text-gray-500 dark:text-gray-400">
          <Info className="h-3 w-3 mr-1 rtl-mr" />
          {isArabic ? 'انقر على التاريخ للحجز' : 'Click on a date to book'}
        </div>
      )}
    </div>
  );
}