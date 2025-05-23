import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  ArrowLeft, 
  Calendar, 
  Home, 
  CreditCard, 
  Loader2, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/LanguageSwitcher';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
}

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const bookingId = parseInt(id);
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage.direction === 'rtl';

  const translations = {
    en: {
      bookingDetails: 'Booking Details',
      property: 'Property',
      dates: 'Dates',
      guests: 'Guests',
      status: 'Status',
      payment: 'Payment',
      total: 'Total',
      loading: 'Loading...',
      back: 'Back to Dashboard',
      chatWithHost: 'Chat with Host',
      to: 'to',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      paid: 'Paid',
      unpaid: 'Unpaid',
      processing: 'Processing',
      rateStay: 'Rate Your Stay',
      bookingProgress: 'Booking Progress',
      viewOnMap: 'View on Map',
      submitReview: 'Submit Review',
      upcoming: 'Upcoming',
      completed: 'Completed',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      amenities: 'Amenities',
      locationInfo: 'Location Info',
      bookingTimeline: 'Booking Timeline',
      tripProgress: 'Trip Progress'
    },
    ar: {
      bookingDetails: 'تفاصيل الحجز',
      property: 'العقار',
      dates: 'التواريخ',
      guests: 'الضيوف',
      status: 'الحالة',
      payment: 'الدفع',
      total: 'المجموع',
      loading: 'جاري التحميل...',
      back: 'العودة إلى لوحة التحكم',
      chatWithHost: 'محادثة مع المضيف',
      to: 'إلى',
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      cancelled: 'ملغي',
      paid: 'مدفوع',
      unpaid: 'غير مدفوع',
      processing: 'قيد المعالجة',
      rateStay: 'قيّم إقامتك',
      bookingProgress: 'تقدم الحجز',
      viewOnMap: 'عرض على الخريطة',
      submitReview: 'إرسال التقييم',
      upcoming: 'قادم',
      completed: 'مكتمل',
      checkIn: 'تسجيل الوصول',
      checkOut: 'تسجيل المغادرة',
      amenities: 'المرافق',
      locationInfo: 'معلومات الموقع',
      bookingTimeline: 'الجدول الزمني للحجز',
      tripProgress: 'تقدم الرحلة'
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

  // Navigate to chat
  const handleChatClick = () => {
    setLocation(`/bookings/${bookingId}/chat`);
  };

  // Get status text and color
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { text: t.confirmed, color: 'bg-green-500' };
      case 'cancelled':
        return { text: t.cancelled, color: 'bg-red-500' };
      case 'pending':
      default:
        return { text: t.pending, color: 'bg-amber-500' };
    }
  };

  // Get payment status text and color
  const getPaymentStatusDisplay = (status: string | null) => {
    switch (status) {
      case 'paid':
        return { text: t.paid, color: 'bg-green-500' };
      case 'processing':
        return { text: t.processing, color: 'bg-blue-500' };
      case 'failed':
        return { text: t.unpaid, color: 'bg-red-500' };
      default:
        return { text: t.unpaid, color: 'bg-gray-500' };
    }
  };

  // Loading state
  if (isLoadingBooking || !booking) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isErrorBooking) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <p className="text-red-500">Error loading booking</p>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/dashboard')} 
            className="mt-4"
          >
            {t.back}
          </Button>
        </div>
      </div>
    );
  }

  const bookingStatus = getStatusDisplay(booking.status);
  const paymentStatus = getPaymentStatusDisplay(booking.paymentStatus);
  
  // Calculate trip progress based on today's date relative to booking dates
  const calculateTripProgress = () => {
    const today = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    if (today < checkIn) {
      return { 
        stage: 'upcoming', 
        text: t.upcoming, 
        progress: 0,
        icon: <Clock className="h-5 w-5 text-amber-500" />
      };
    } else if (today > checkOut) {
      return { 
        stage: 'completed', 
        text: t.completed, 
        progress: 100,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
      };
    } else {
      // During the stay
      const totalDuration = checkOut.getTime() - checkIn.getTime();
      const elapsed = today.getTime() - checkIn.getTime();
      const progressPercent = Math.round((elapsed / totalDuration) * 100);
      return { 
        stage: 'active', 
        text: `${progressPercent}%`, 
        progress: progressPercent,
        icon: <Calendar className="h-5 w-5 text-primary" />
      };
    }
  };
  
  const tripProgress = calculateTripProgress();
  
  return (
    <div className="container py-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLocation('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.back}
          </Button>
          <h1 className="text-2xl font-bold">{t.bookingDetails}</h1>
        </div>
        <Button onClick={handleChatClick}>
          <MessageCircle className="h-4 w-4 mr-2" />
          {t.chatWithHost}
        </Button>
      </div>
      
      {/* Trip Timeline */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t.tripProgress}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                {tripProgress.icon}
                <span className="ml-2 font-medium">{tripProgress.text}</span>
              </div>
              <Badge 
                variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'outline'}
              >
                {bookingStatus.text}
              </Badge>
            </div>
            <Progress value={tripProgress.progress} className="h-2" />
            
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <div className="flex flex-col items-center">
                <span className="font-medium">{t.checkIn}</span>
                <span>{formatDate(booking.checkIn)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-medium">{t.checkOut}</span>
                <span>{formatDate(booking.checkOut)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking details */}
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
                <p className="text-sm text-muted-foreground">
                  {isLoadingProperty ? '' : property?.location}
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

            {/* Guests */}
            <div className="flex items-start">
              <div className="mr-2 mt-0.5 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">{t.guests}</h3>
                <p>{booking.guests}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start">
              <div className="mr-2 mt-0.5 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">{t.status}</h3>
                <div className="flex items-center mt-1">
                  <div className={`w-3 h-3 rounded-full mr-2 ${bookingStatus.color}`} />
                  <p>{bookingStatus.text}</p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 mt-0.5 text-muted-foreground mr-2" />
              <div>
                <h3 className="font-medium">{t.payment}</h3>
                <div className="flex items-center mt-1">
                  <div className={`w-3 h-3 rounded-full mr-2 ${paymentStatus.color}`} />
                  <p>{paymentStatus.text}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between py-4">
            <p className="font-medium">{t.total}:</p>
            <p className="font-bold">
              ${booking.totalAmount || (isLoadingProperty ? t.loading : property?.price || 0)}
            </p>
          </CardFooter>
        </Card>

        {/* Property preview */}
        {!isLoadingProperty && property && (
          <div className="space-y-6">
            <Card>
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={property.images[0] || 'https://placehold.co/600x400?text=No+Image'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {tripProgress.stage === 'completed' && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary hover:bg-primary/90">
                      <Star className="h-3 w-3 mr-1" fill="currentColor" /> 
                      {t.rateStay}
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{property.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 inline-block text-muted-foreground" />
                  {property.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                    <p className="font-medium">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                    <p className="font-medium">{property.bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price / night</p>
                    <p className="font-medium">${property.price}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setLocation(`/property/${property.id}`)}
                >
                  View Property
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {t.viewOnMap}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Rating Section (only visible for completed stays) */}
            {tripProgress.stage === 'completed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.rateStay}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-8 w-8 cursor-pointer hover:text-primary transition-colors" 
                        fill="none"
                      />
                    ))}
                  </div>
                  <Button className="w-full">
                    {t.submitReview}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}