import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  Search,
  ChevronRight,
  Calendar,
  Home,
  Loader2,
  Bell,
  Filter,
  CheckCheck
} from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

// Types
interface ChatRoom {
  id: number;
  bookingId: number;
  title: string;
  createdAt: string;
  lastMessageAt: string;
  lastMessage?: {
    content: string;
    senderId: number;
    createdAt: string;
    isRead: boolean;
  };
  property?: {
    id: number;
    title: string;
    images: string[];
  };
  unreadCount: number;
}

interface Booking {
  id: number;
  propertyId: number;
  propertyTitle?: string;
  propertyImage?: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

export default function Inbox() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);
  const isRTL = currentLanguage.direction === 'rtl';
  const dateLocale = currentLanguage.code === 'ar' ? ar : enUS;

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all chat rooms for the current user
  const {
    data: chatRooms,
    isLoading: isLoadingRooms,
    refetch: refetchRooms
  } = useQuery({
    queryKey: ['/api/chat/rooms'],
    queryFn: async () => {
      const response = await fetch('/api/chat/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms');
      }
      return response.json() as Promise<ChatRoom[]>;
    },
    enabled: !!user
  });

  // Fetch bookings
  const {
    data: bookings,
    isLoading: isLoadingBookings
  } = useQuery({
    queryKey: ['/api/bookings'],
    queryFn: async () => {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      return response.json() as Promise<Booking[]>;
    },
    enabled: !!user
  });

  // Poll for new messages every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchRooms();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetchRooms]);

  // Format date in a readable format
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, 'p', { locale: dateLocale }); // 'p' for time format
    } else if (isYesterday(date)) {
      return currentLanguage.code === 'ar' ? 'أمس' : 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE', { locale: dateLocale }); // Day name
    } else {
      return format(date, 'PP', { locale: dateLocale }); // Date format
    }
  };

  // Filter rooms based on search query and unread filter
  const filteredRooms = chatRooms
    ? chatRooms
        .filter(room => {
          // Search filter
          if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            return (
              room.title.toLowerCase().includes(searchLower) ||
              (room.property?.title?.toLowerCase().includes(searchLower)) ||
              (room.lastMessage?.content?.toLowerCase().includes(searchLower))
            );
          }
          return true;
        })
        .filter(room => {
          // Unread filter
          if (activeFilter === 'unread') {
            return room.unreadCount > 0;
          }
          return true;
        })
        .sort((a, b) => {
          // Sort by date, newest first
          return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        })
    : [];

  // Loading state
  if (!user) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <Button
          onClick={() => setLocation('/login')}
          className="gap-2"
        >
          {currentLanguage.code === 'ar' ? 'تسجيل الدخول للوصول إلى الرسائل' : 'Sign in to access messages'}
        </Button>
      </div>
    );
  }

  if (isLoadingRooms || isLoadingBookings) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">
            {currentLanguage.code === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">
            {currentLanguage.code === 'ar' ? 'الرسائل' : 'Messages'}
          </h1>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary text-white">
              {filteredRooms.reduce((total, room) => total + (room.unreadCount || 0), 0)}
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={currentLanguage.code === 'ar' ? 'بحث في الرسائل...' : 'Search messages...'}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className="ring focus:ring-primary-ring"
            >
              <MessageSquare className="h-5 w-5" /> {currentLanguage.code === 'ar' ? 'الكل' : 'All'}
            </Button>
            <Button
              variant={activeFilter === 'unread' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('unread')}
              className="ring focus:ring-primary-ring"
            >
              <Bell className="h-5 w-5" /> {currentLanguage.code === 'ar' ? 'غير مقروءة' : 'Unread'}
            </Button>
          </div>
        </div>

        {/* Chat Room List */}
        <div className="bg-background border rounded-lg shadow-md">
          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="messages" className="flex-1">
                <MessageSquare className="h-5 w-5 mr-2" />
                {currentLanguage.code === 'ar' ? 'المحادثات' : 'Conversations'}
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex-1">
                <Calendar className="h-5 w-5 mr-2" />
                {currentLanguage.code === 'ar' ? 'الحجوزات' : 'Bookings'}
              </TabsTrigger>
            </TabsList>

            {/* Messages Tab Content */}
            <TabsContent value="messages" className="p-0">
              <ScrollArea className="h-[60vh]">
                <div className="divide-y divide-muted-foreground">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 transition-colors ${room.unreadCount > 0 ? 'bg-accent/20' : ''}`}
                      onClick={() => setLocation(`/bookings/${room.bookingId}/chat`)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={room.property?.images?.[0] || ''}
                          alt={room.property?.title || room.title}
                        />
                        <AvatarFallback>
                          {room.title.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate text-primary">{room.property?.title || room.title}</h3>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatMessageDate(room.lastMessageAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground truncate max-w-[18rem]">
                            {room.lastMessage?.content || (currentLanguage.code === 'ar' ? 'ابدأ المحادثة الآن' : 'Start the conversation')}
                          </p>
                          {room.unreadCount > 0 && <Badge className="ml-2">{room.unreadCount}</Badge>}
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="bookings">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  {!bookings || bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                      <p className="mt-4 text-muted-foreground">
                        {currentLanguage.code === 'ar'
                          ? 'ليس لديك أي حجوزات حتى الآن.'
                          : 'You have no bookings yet.'}
                      </p>
                      <Button
                        className="mt-4"
                        variant="outline"
                        onClick={() => setLocation('/properties')}
                      >
                        {currentLanguage.code === 'ar' ? 'تصفح العقارات' : 'Browse Properties'}
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[60vh]">
                      <div className="divide-y">
                        {bookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="p-4 flex items-center gap-4 cursor-pointer hover:bg-accent/50 transition-colors"
                            onClick={() => setLocation(`/bookings/${booking.id}`)}
                          >
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={booking.propertyImage || ''}
                                alt={booking.propertyTitle || `Booking #${booking.id}`}
                              />
                              <AvatarFallback>
                                <Home className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate">
                                  {booking.propertyTitle || `${currentLanguage.code === 'ar' ? 'حجز رقم' : 'Booking'} #${booking.id}`}
                                </h3>
                                <Badge
                                  variant={booking.status === 'confirmed' ? 'default' :
                                    booking.status === 'cancelled' ? 'destructive' : 'outline'}
                                >
                                  {booking.status === 'confirmed'
                                    ? (currentLanguage.code === 'ar' ? 'مؤكد' : 'Confirmed')
                                    : booking.status === 'cancelled'
                                      ? (currentLanguage.code === 'ar' ? 'ملغي' : 'Cancelled')
                                      : booking.status === 'pending'
                                        ? (currentLanguage.code === 'ar' ? 'قيد الانتظار' : 'Pending')
                                        : booking.status}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-muted-foreground">
                                  {new Date(booking.checkIn).toLocaleDateString(
                                    currentLanguage.code === 'ar' ? 'ar-EG' : undefined,
                                    { day: 'numeric', month: 'short', year: 'numeric' }
                                  )}
                                  {' - '}
                                  {new Date(booking.checkOut).toLocaleDateString(
                                    currentLanguage.code === 'ar' ? 'ar-EG' : undefined,
                                    { day: 'numeric', month: 'short', year: 'numeric' }
                                  )}
                                </p>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/bookings/${booking.id}/chat`);
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {currentLanguage.code === 'ar' ? 'المحادثة' : 'Chat'}
                            </Button>

                            <ChevronRight className={`h-5 w-5 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}