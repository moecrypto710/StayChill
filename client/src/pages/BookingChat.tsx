import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Home, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/LanguageSwitcher';
import ChatInterface from '@/components/ChatInterface';
import { useAuth } from '@/lib/auth';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Booking {
  id: number;
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  paymentStatus: string | null;
  totalAmount: string | null;
}

interface Property {
  id: number;
  title: string;
  location: string;
  images: string[];
}

export default function BookingChat() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const bookingId = parseInt(id);
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage.direction === 'rtl';
  const { user } = useAuth();

  const translations = {
    en: {
      chatWithHost: 'Chat with Host',
      bookingDetails: 'Booking Details',
      loading: 'Loading...',
      back: 'Back to Booking Details',
      property: 'Property',
      dates: 'Dates',
      to: 'to',
    },
    ar: {
      chatWithHost: 'محادثة مع المضيف',
      bookingDetails: 'تفاصيل الحجز',
      loading: 'جاري التحميل...',
      back: 'العودة إلى تفاصيل الحجز',
      property: 'العقار',
      dates: 'التواريخ',
      to: 'إلى',
    }
  };

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en;

  // Fetch booking
  const {
    data: booking,
    isLoading: isLoadingBooking,
    isError: isErrorBooking
  } = useQuery({
    queryKey: ['/api/bookings', bookingId],
    queryFn: async () => {
      if (isNaN(bookingId)) throw new Error('Invalid booking ID');
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }
      return response.json() as Promise<Booking>;
    },
    enabled: !isNaN(bookingId)
  });

  // Fetch property details
  const {
    data: property,
    isLoading: isLoadingProperty
  } = useQuery({
    queryKey: ['/api/properties', booking?.propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${booking?.propertyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      return response.json() as Promise<Property>;
    },
    enabled: !!booking?.propertyId
  });

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      currentLanguage.code === 'ar' ? 'ar-EG' : undefined,
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  // Loading state
  if (isLoadingBooking || !booking || !user) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setLocation(`/bookings/${bookingId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <h1 className="text-2xl font-bold">{t.chatWithHost}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        {/* Booking info sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t.bookingDetails}</CardTitle>
              <CardDescription>#{booking.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Property */}
              <div className="flex items-start">
                <Home className="h-5 w-5 mt-0.5 text-muted-foreground mr-2" />
                <div>
                  <h3 className="font-medium">{t.property}</h3>
                  <p>
                    {isLoadingProperty ? t.loading : property?.title}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground mr-2" />
                <div>
                  <h3 className="font-medium">{t.dates}</h3>
                  <p>
                    {formatDate(booking.checkIn)} {t.to} {formatDate(booking.checkOut)}
                  </p>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation(`/bookings/${bookingId}`)}
              >
                {t.back}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Chat interface */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <ChatInterface 
            bookingId={bookingId} 
            currentUser={{
              id: user.id,
              username: user.username,
              email: user.email
            }}
          />
        </div>
      </div>
    </div>
  );
}