import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trophy,
  Gift,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  Sparkles,
  ChevronRight,
  Ticket,
  BadgePercent,
  Hotel,
  Coffee,
  Car,
  Plane,
  HeartHandshake,
  HandCoins
} from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

// Types
interface RewardTier {
  name: string;
  points: number;
  benefits: string[];
  colorClass: string;
}

interface RewardPoint {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  expiresAt: string | null;
  transactionType: 'earned' | 'redeemed' | 'expired';
}

interface Reward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  category: 'discount' | 'upgrade' | 'experience' | 'service';
  image: string;
  available: boolean;
}

// Mock data for rewards tiers
const rewardTiers: RewardTier[] = [
  {
    name: 'Bronze',
    points: 1000,
    benefits: [
      'Early check-in when available',
      'Late check-out when available',
      '5% discount on bookings'
    ],
    colorClass: 'bg-amber-700'
  },
  {
    name: 'Silver',
    points: 5000,
    benefits: [
      'All Bronze benefits',
      '10% discount on bookings',
      'Free room upgrade when available',
      'Welcome amenity'
    ],
    colorClass: 'bg-slate-400'
  },
  {
    name: 'Gold',
    points: 10000,
    benefits: [
      'All Silver benefits',
      '15% discount on bookings',
      'Guaranteed room upgrade',
      'Free airport transfer',
      'Access to exclusive properties'
    ],
    colorClass: 'bg-amber-500'
  },
  {
    name: 'Platinum',
    points: 25000,
    benefits: [
      'All Gold benefits',
      '20% discount on bookings',
      'Personal concierge service',
      'Free breakfast',
      'Flexible cancellation policy',
      'Exclusive access to limited events'
    ],
    colorClass: 'bg-zinc-800'
  }
];

export default function Rewards() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);
  const isRTL = currentLanguage.direction === 'rtl';
  const dateLocale = currentLanguage.code === 'ar' ? ar : enUS;
  
  // Fetch user rewards data
  const {
    data: rewardsData,
    isLoading: isLoadingRewards
  } = useQuery({
    queryKey: ['/api/rewards'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/rewards');
        if (!response.ok) {
          // Fallback for demo
          return {
            points: 3200,
            tier: 'Silver',
            totalEarned: 5700,
            pointsToNextTier: 1800,
            nextTier: 'Gold',
            transactions: [
              {
                id: 1,
                amount: 500,
                description: 'Booking completed: Luxurious Beachfront Villa',
                createdAt: '2025-03-15T10:30:00Z',
                expiresAt: '2026-03-15T10:30:00Z', 
                transactionType: 'earned'
              },
              {
                id: 2,
                amount: 200,
                description: 'Referral bonus: John Smith',
                createdAt: '2025-03-10T14:20:00Z',
                expiresAt: '2026-03-10T14:20:00Z',
                transactionType: 'earned'
              },
              {
                id: 3,
                amount: 1000,
                description: 'Welcome bonus',
                createdAt: '2025-02-20T09:15:00Z',
                expiresAt: '2026-02-20T09:15:00Z',
                transactionType: 'earned'
              },
              {
                id: 4,
                amount: 300,
                description: 'Redeemed for room upgrade',
                createdAt: '2025-03-05T16:45:00Z',
                expiresAt: null,
                transactionType: 'redeemed'
              },
              {
                id: 5,
                amount: 1500,
                description: 'Booking completed: Stunning Panoramic Villa',
                createdAt: '2025-01-25T11:10:00Z',
                expiresAt: '2026-01-25T11:10:00Z',
                transactionType: 'earned'
              },
              {
                id: 6,
                amount: 200,
                description: 'Points expired',
                createdAt: '2025-01-15T08:30:00Z',
                expiresAt: '2025-01-15T08:30:00Z',
                transactionType: 'expired'
              }
            ] as RewardPoint[],
            availableRewards: [
              {
                id: 1,
                name: '10% Discount',
                description: 'Get 10% off your next booking',
                pointsCost: 500,
                category: 'discount',
                image: '/assets/discount.jpg',
                available: true
              },
              {
                id: 2,
                name: 'Room Upgrade',
                description: 'Upgrade to the next room category',
                pointsCost: 1000,
                category: 'upgrade',
                image: '/assets/upgrade.jpg',
                available: true
              },
              {
                id: 3,
                name: 'Late Check-out',
                description: 'Extend your stay until 4 PM',
                pointsCost: 300,
                category: 'service',
                image: '/assets/checkout.jpg',
                available: true
              },
              {
                id: 4,
                name: 'Beach Dinner',
                description: 'Romantic dinner on the beach',
                pointsCost: 2000,
                category: 'experience',
                image: '/assets/experience.jpg',
                available: true
              },
              {
                id: 5,
                name: 'Airport Transfer',
                description: 'Free airport transfer',
                pointsCost: 800,
                category: 'service',
                image: '/assets/transfer.jpg',
                available: true
              }
            ] as Reward[]
          };
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching rewards data:', error);
        throw error;
      }
    },
    enabled: !!user
  });

  // Get the current tier info
  const currentTier = rewardTiers.find(tier => tier.name === rewardsData?.tier);
  const nextTier = rewardTiers.find(tier => tier.name === rewardsData?.nextTier);
  
  // Calculate progress to next tier
  const progressToNextTier = nextTier && rewardsData 
    ? ((rewardsData.points - (currentTier?.points || 0)) / (nextTier.points - (currentTier?.points || 0))) * 100
    : 0;

  // Loading state
  if (!user) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <Button
          onClick={() => setLocation('/login')}
          className="gap-2"
        >
          {currentLanguage.code === 'ar' ? 'تسجيل الدخول للوصول إلى النقاط والمكافآت' : 'Sign in to access rewards'}
        </Button>
      </div>
    );
  }

  if (isLoadingRewards) {
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

  // Organize transactions by type
  const earnedPoints = rewardsData?.transactions?.filter(t => t.transactionType === 'earned') || [];
  const redeemedPoints = rewardsData?.transactions?.filter(t => t.transactionType === 'redeemed') || [];
  const expiredPoints = rewardsData?.transactions?.filter(t => t.transactionType === 'expired') || [];

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PP', { locale: dateLocale });
  };

  // Category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'discount':
        return <BadgePercent className="h-5 w-5" />;
      case 'upgrade':
        return <Hotel className="h-5 w-5" />;
      case 'experience':
        return <HeartHandshake className="h-5 w-5" />;
      case 'service':
        return <Coffee className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div className="container py-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {currentLanguage.code === 'ar' ? 'المكافآت والنقاط' : 'Rewards & Points'}
          </h1>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Badge variant="outline" className="text-sm gap-2">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              {currentLanguage.code === 'ar' ? 'مستوى' : 'Tier'}: {rewardsData?.tier}
            </Badge>
          </div>
        </div>

        {/* Points summary card */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">
                {currentLanguage.code === 'ar' ? 'رصيد النقاط' : 'Points Balance'}
              </CardTitle>
              <Trophy className="h-8 w-8 text-white opacity-80" />
            </div>
            <CardDescription className="text-white/80">
              {currentLanguage.code === 'ar' 
                ? `إجمالي النقاط المكتسبة: ${rewardsData?.totalEarned}`
                : `Total points earned: ${rewardsData?.totalEarned}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {rewardsData?.points.toLocaleString()}
            </div>
            
            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {currentLanguage.code === 'ar' 
                      ? 'المستوى الحالي:'
                      : 'Current tier:'} {rewardsData?.tier}
                  </span>
                  <span>
                    {currentLanguage.code === 'ar' 
                      ? 'المستوى التالي:'
                      : 'Next tier:'} {rewardsData?.nextTier}
                  </span>
                </div>
                <Progress value={progressToNextTier} className="h-2 bg-white/20" />
                <p className="text-sm text-white/80">
                  {currentLanguage.code === 'ar'
                    ? `${rewardsData?.pointsToNextTier} نقطة للوصول إلى المستوى التالي`
                    : `${rewardsData?.pointsToNextTier} points to next tier`}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {}}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                {currentLanguage.code === 'ar' ? 'كيفية كسب النقاط' : 'How to earn'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {}}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Gift className="h-4 w-4 mr-2" />
                {currentLanguage.code === 'ar' ? 'استبدال النقاط' : 'Redeem points'}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Reward tiers */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentLanguage.code === 'ar' ? 'مستويات المكافآت' : 'Reward Tiers'}
            </CardTitle>
            <CardDescription>
              {currentLanguage.code === 'ar' 
                ? 'استكشف المزايا على كل مستوى من مستويات المكافآت'
                : 'Explore the benefits at each tier of our rewards program'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewardTiers.map((tier) => (
                <Card 
                  key={tier.name} 
                  className={`border-2 ${tier.name === rewardsData?.tier ? 'border-primary' : 'border-muted'}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                      <div className={`h-4 w-4 rounded-full ${tier.colorClass}`}></div>
                    </div>
                    <CardDescription>
                      {currentLanguage.code === 'ar' 
                        ? `${tier.points.toLocaleString()} نقطة`
                        : `${tier.points.toLocaleString()} points`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-2 text-sm">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-emerald-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  {tier.name === rewardsData?.tier && (
                    <CardFooter className="bg-muted/50 pt-2">
                      <p className="text-sm flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                        {currentLanguage.code === 'ar' ? 'المستوى الحالي' : 'Your current tier'}
                      </p>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available rewards */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentLanguage.code === 'ar' ? 'المكافآت المتاحة' : 'Available Rewards'}
            </CardTitle>
            <CardDescription>
              {currentLanguage.code === 'ar' 
                ? 'اكتشف المكافآت التي يمكنك استبدالها بنقاطك'
                : 'Discover rewards you can redeem with your points'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewardsData?.availableRewards.map((reward) => (
                <Card key={reward.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white">
                      {getCategoryIcon(reward.category)}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{reward.name}</CardTitle>
                      <Badge variant="outline" className="font-normal">
                        {reward.pointsCost} {currentLanguage.code === 'ar' ? 'نقطة' : 'pts'}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {reward.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled={rewardsData?.points < reward.pointsCost}
                    >
                      {currentLanguage.code === 'ar' ? 'استبدال' : 'Redeem'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transactions history */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentLanguage.code === 'ar' ? 'سجل النقاط' : 'Points History'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="earned">
              <TabsList className="w-full">
                <TabsTrigger value="earned" className="flex-1">
                  <Star className="h-4 w-4 mr-2" />
                  {currentLanguage.code === 'ar' ? 'النقاط المكتسبة' : 'Points Earned'}
                </TabsTrigger>
                <TabsTrigger value="redeemed" className="flex-1">
                  <HandCoins className="h-4 w-4 mr-2" />
                  {currentLanguage.code === 'ar' ? 'النقاط المستبدلة' : 'Points Redeemed'}
                </TabsTrigger>
                <TabsTrigger value="expired" className="flex-1">
                  <Clock className="h-4 w-4 mr-2" />
                  {currentLanguage.code === 'ar' ? 'النقاط المنتهية' : 'Points Expired'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="earned">
                <ScrollArea className="h-[300px]">
                  {earnedPoints.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      {currentLanguage.code === 'ar' 
                        ? 'لا توجد نقاط مكتسبة للعرض'
                        : 'No earned points to display'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {earnedPoints.map((point) => (
                        <div key={point.id} className="flex justify-between items-center border-b pb-3">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-3">
                              <Star className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                              <p className="font-medium">{point.description}</p>
                              <div className="flex items-center text-sm text-muted-foreground space-x-2 rtl:space-x-reverse">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(point.createdAt)}</span>
                                {point.expiresAt && (
                                  <>
                                    <Separator orientation="vertical" className="h-3" />
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {currentLanguage.code === 'ar' 
                                        ? `تنتهي في ${formatDate(point.expiresAt)}`
                                        : `Expires ${formatDate(point.expiresAt)}`}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-emerald-500">
                            +{point.amount}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="redeemed">
                <ScrollArea className="h-[300px]">
                  {redeemedPoints.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      {currentLanguage.code === 'ar' 
                        ? 'لا توجد نقاط مستبدلة للعرض'
                        : 'No redeemed points to display'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {redeemedPoints.map((point) => (
                        <div key={point.id} className="flex justify-between items-center border-b pb-3">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                              <Gift className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium">{point.description}</p>
                              <div className="flex items-center text-sm text-muted-foreground space-x-2 rtl:space-x-reverse">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(point.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-blue-500">
                            -{point.amount}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="expired">
                <ScrollArea className="h-[300px]">
                  {expiredPoints.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                      {currentLanguage.code === 'ar' 
                        ? 'لا توجد نقاط منتهية للعرض'
                        : 'No expired points to display'}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {expiredPoints.map((point) => (
                        <div key={point.id} className="flex justify-between items-center border-b pb-3">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3">
                              <Clock className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium">{point.description}</p>
                              <div className="flex items-center text-sm text-muted-foreground space-x-2 rtl:space-x-reverse">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(point.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-gray-500">
                            -{point.amount}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}