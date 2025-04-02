import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  User,
  KeyRound,
  Mail,
  Phone,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Home,
  History,
  LogOut,
  Loader2,
  Calendar,
  Image as ImageIcon,
  Camera
} from 'lucide-react';

// Define the form schema
const profileSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  name: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  avatar: z.string().optional(),
});

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  newPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  confirmPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User preference schema
const preferencesSchema = z.object({
  notifications: z.boolean().default(true),
  emailUpdates: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  language: z.string().default('en'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

// Mock recent activity data
interface Activity {
  id: number;
  type: 'booking' | 'message' | 'review' | 'account' | 'payment';
  description: string;
  date: string;
  link?: string;
}

export default function Profile() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isRTL = currentLanguage.direction === 'rtl';
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  
  // Get user profile data
  const {
    data: profileData,
    isLoading: isLoadingProfile,
  } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      try {
        // Typically we'd fetch from API, but for demo we'll use the auth user
        // For display purposes, create a slightly extended version of the user
        if (!user) throw new Error('User not found');
        
        return {
          ...user,
          name: 'Guest User', // Example display name
          phone: '+20 123 456 7890',
          country: 'Egypt',
          city: 'Cairo',
          avatar: null,
          joinedDate: '2024-11-15T00:00:00Z',
          verifiedEmail: true,
          recentActivities: [
            {
              id: 1,
              type: 'booking',
              description: 'Booked Luxurious Beachfront Villa',
              date: '2025-03-15T14:30:00Z',
              link: '/bookings/1'
            },
            {
              id: 2,
              type: 'message',
              description: 'New message from property owner',
              date: '2025-03-12T09:15:00Z',
              link: '/inbox'
            },
            {
              id: 3,
              type: 'account',
              description: 'Updated account information',
              date: '2025-03-10T16:45:00Z'
            },
            {
              id: 4,
              type: 'payment',
              description: 'Payment processed for booking #1024',
              date: '2025-03-05T11:20:00Z',
              link: '/bookings/1024'
            },
            {
              id: 5,
              type: 'review',
              description: 'Left a review for Beach Resort',
              date: '2025-02-28T15:10:00Z',
              link: '/property/3'
            }
          ] as Activity[]
        };
      } catch (error) {
        console.error('Error fetching profile data:', error);
        throw error;
      }
    },
    enabled: !!user
  });

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      name: '',
      phone: '',
      country: '',
      city: '',
      avatar: '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Preferences form
  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: true,
      emailUpdates: true,
      darkMode: false,
      language: currentLanguage.code,
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profileData) {
      profileForm.reset({
        username: profileData.username,
        email: profileData.email,
        name: profileData.name || '',
        phone: profileData.phone || '',
        country: profileData.country || '',
        city: profileData.city || '',
        avatar: profileData.avatar || '',
      });
    }
  }, [profileData, profileForm]);

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // In a real app, you would make an API call here
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: currentLanguage.code === 'ar' 
          ? 'تم تحديث الملف الشخصي بنجاح' 
          : 'Profile updated successfully',
        description: currentLanguage.code === 'ar'
          ? 'تم حفظ التغييرات التي أجريتها على ملفك الشخصي'
          : 'The changes you made to your profile have been saved',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
    },
    onError: () => {
      toast({
        title: currentLanguage.code === 'ar' 
          ? 'فشل تحديث الملف الشخصي' 
          : 'Failed to update profile',
        description: currentLanguage.code === 'ar'
          ? 'حدث خطأ أثناء تحديث ملفك الشخصي. يرجى المحاولة مرة أخرى'
          : 'An error occurred while updating your profile. Please try again',
        variant: 'destructive',
      });
    },
  });

  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      // In a real app, you would make an API call here
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: currentLanguage.code === 'ar' 
          ? 'تم تحديث كلمة المرور بنجاح' 
          : 'Password updated successfully',
        description: currentLanguage.code === 'ar'
          ? 'تم تغيير كلمة المرور الخاصة بك'
          : 'Your password has been changed',
      });
      passwordForm.reset();
    },
    onError: () => {
      toast({
        title: currentLanguage.code === 'ar' 
          ? 'فشل تحديث كلمة المرور' 
          : 'Failed to update password',
        description: currentLanguage.code === 'ar'
          ? 'حدث خطأ أثناء تحديث كلمة المرور. يرجى المحاولة مرة أخرى'
          : 'An error occurred while updating your password. Please try again',
        variant: 'destructive',
      });
    },
  });

  // Preferences update mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: PreferencesFormValues) => {
      // In a real app, you would make an API call here
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: currentLanguage.code === 'ar' 
          ? 'تم تحديث التفضيلات بنجاح' 
          : 'Preferences updated successfully',
        description: currentLanguage.code === 'ar'
          ? 'تم حفظ تفضيلاتك الجديدة'
          : 'Your new preferences have been saved',
      });
    },
    onError: () => {
      toast({
        title: currentLanguage.code === 'ar' 
          ? 'فشل تحديث التفضيلات' 
          : 'Failed to update preferences',
        description: currentLanguage.code === 'ar'
          ? 'حدث خطأ أثناء تحديث تفضيلاتك. يرجى المحاولة مرة أخرى'
          : 'An error occurred while updating your preferences. Please try again',
        variant: 'destructive',
      });
    },
  });

  // Handle profile form submission
  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  // Handle password form submission
  const onPasswordSubmit = (data: PasswordFormValues) => {
    updatePasswordMutation.mutate(data);
  };

  // Handle preferences form submission
  const onPreferencesSubmit = (data: PreferencesFormValues) => {
    updatePreferencesMutation.mutate(data);
  };

  // Format date for activity
  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return currentLanguage.code === 'ar' ? 'اليوم' : 'Today';
    } else if (diffDays === 1) {
      return currentLanguage.code === 'ar' ? 'أمس' : 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} ${currentLanguage.code === 'ar' ? 'أيام' : 'days ago'}`;
    } else {
      return date.toLocaleDateString(
        currentLanguage.code === 'ar' ? 'ar-EG' : undefined, 
        { day: 'numeric', month: 'short', year: 'numeric' }
      );
    }
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      case 'message':
        return <Mail className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'account':
        return <User className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Loading state
  if (isLoadingProfile) {
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

  if (!user || !profileData) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <Button
          onClick={() => navigate('/login')}
          className="gap-2"
        >
          {currentLanguage.code === 'ar' ? 'تسجيل الدخول للوصول إلى الملف الشخصي' : 'Sign in to access your profile'}
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {currentLanguage.code === 'ar' ? 'الملف الشخصي' : 'My Account'}
            </h1>
            <p className="text-muted-foreground">
              {currentLanguage.code === 'ar' 
                ? 'إدارة ملفك الشخصي وتفضيلاتك وإعدادات الأمان' 
                : 'Manage your profile, preferences, and security settings'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              {currentLanguage.code === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            </Button>
          </div>
        </div>

        {/* User summary card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.avatar || ''} alt={profileData.name || profileData.username} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profileData.name 
                      ? profileData.name.substring(0, 2).toUpperCase() 
                      : profileData.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button 
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
                  onClick={() => setIsAvatarDialogOpen(true)}
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold">{profileData.name || profileData.username}</h2>
                <p className="text-muted-foreground">{profileData.email}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.verifiedEmail && (
                    <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800">
                      <Shield className="h-3 w-3" />
                      {currentLanguage.code === 'ar' ? 'بريد إلكتروني مؤكد' : 'Verified Email'}
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {currentLanguage.code === 'ar' ? 'انضم في' : 'Joined'} {new Date(profileData.joinedDate).toLocaleDateString(
                      currentLanguage.code === 'ar' ? 'ar-EG' : undefined,
                      { year: 'numeric', month: 'short' }
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full sm:w-auto mb-4">
            <TabsTrigger value="profile" className="flex-1 sm:flex-initial">
              <User className="h-4 w-4 mr-2" />
              {currentLanguage.code === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 sm:flex-initial">
              <KeyRound className="h-4 w-4 mr-2" />
              {currentLanguage.code === 'ar' ? 'الأمان' : 'Security'}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex-1 sm:flex-initial">
              <Settings className="h-4 w-4 mr-2" />
              {currentLanguage.code === 'ar' ? 'التفضيلات' : 'Preferences'}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1 sm:flex-initial">
              <History className="h-4 w-4 mr-2" />
              {currentLanguage.code === 'ar' ? 'النشاط الأخير' : 'Activity'}
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage.code === 'ar' ? 'تحديث الملف الشخصي' : 'Update Profile'}</CardTitle>
                <CardDescription>
                  {currentLanguage.code === 'ar' 
                    ? 'قم بتحديث معلومات ملفك الشخصي وبياناتك' 
                    : 'Update your profile information and contact details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'اسم المستخدم' : 'Username'}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'البريد الإلكتروني' : 'Email'}</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'الاسم الكامل' : 'Full Name'}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'البلد' : 'Country'}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'المدينة' : 'City'}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="md:w-auto"
                      disabled={updateProfileMutation.isPending || !profileForm.formState.isDirty}
                    >
                      {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {currentLanguage.code === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage.code === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</CardTitle>
                <CardDescription>
                  {currentLanguage.code === 'ar' 
                    ? 'تحديث كلمة المرور الخاصة بك للحفاظ على أمان حسابك' 
                    : 'Update your password to keep your account secure'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-2">
                        <Separator className="my-4" />
                      </div>
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{currentLanguage.code === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="md:w-auto"
                      disabled={updatePasswordMutation.isPending || !passwordForm.formState.isDirty}
                    >
                      {updatePasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {currentLanguage.code === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage.code === 'ar' ? 'تفضيلات المستخدم' : 'User Preferences'}</CardTitle>
                <CardDescription>
                  {currentLanguage.code === 'ar' 
                    ? 'تخصيص تجربتك وتفضيلات الإشعارات' 
                    : 'Customize your experience and notification preferences'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        {currentLanguage.code === 'ar' ? 'الإشعارات' : 'Notifications'}
                      </h3>
                      
                      <FormField
                        control={preferencesForm.control}
                        name="notifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {currentLanguage.code === 'ar' ? 'إشعارات التطبيق' : 'App Notifications'}
                              </FormLabel>
                              <FormDescription>
                                {currentLanguage.code === 'ar' 
                                  ? 'تلقي إشعارات حول الحجوزات والرسائل والتذكيرات' 
                                  : 'Receive notifications about bookings, messages, and reminders'}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="emailUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {currentLanguage.code === 'ar' ? 'تحديثات البريد الإلكتروني' : 'Email Updates'}
                              </FormLabel>
                              <FormDescription>
                                {currentLanguage.code === 'ar' 
                                  ? 'تلقي رسائل بريد إلكتروني حول العروض الخاصة والأخبار' 
                                  : 'Receive emails about special offers and news'}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <h3 className="text-lg font-medium mt-6">
                        {currentLanguage.code === 'ar' ? 'التفضيلات العامة' : 'General Preferences'}
                      </h3>
                      
                      <FormField
                        control={preferencesForm.control}
                        name="darkMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {currentLanguage.code === 'ar' ? 'الوضع الداكن' : 'Dark Mode'}
                              </FormLabel>
                              <FormDescription>
                                {currentLanguage.code === 'ar' 
                                  ? 'تفعيل المظهر الداكن للتطبيق' 
                                  : 'Enable dark appearance for the application'}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {currentLanguage.code === 'ar' ? 'اللغة' : 'Language'}
                              </FormLabel>
                              <FormDescription>
                                {currentLanguage.code === 'ar' 
                                  ? 'تغيير لغة واجهة المستخدم' 
                                  : 'Change the user interface language'}
                              </FormDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                type="button" 
                                variant={field.value === 'en' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => field.onChange('en')}
                              >
                                English
                              </Button>
                              <Button 
                                type="button" 
                                variant={field.value === 'ar' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => field.onChange('ar')}
                              >
                                العربية
                              </Button>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="md:w-auto"
                      disabled={updatePreferencesMutation.isPending || !preferencesForm.formState.isDirty}
                    >
                      {updatePreferencesMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {currentLanguage.code === 'ar' ? 'حفظ التفضيلات' : 'Save Preferences'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>{currentLanguage.code === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
                <CardDescription>
                  {currentLanguage.code === 'ar' 
                    ? 'سجل نشاطك على المنصة' 
                    : 'A log of your activity on the platform'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {profileData.recentActivities.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                        <p className="mt-4 text-muted-foreground">
                          {currentLanguage.code === 'ar' 
                            ? 'لا يوجد نشاط حديث للعرض' 
                            : 'No recent activity to display'}
                        </p>
                      </div>
                    ) : (
                      profileData.recentActivities.map((activity) => (
                        <div 
                          key={activity.id} 
                          className={`flex items-start p-4 rounded-lg border ${
                            activity.link ? 'cursor-pointer hover:bg-accent/50' : ''
                          }`}
                          onClick={() => activity.link ? navigate(activity.link) : null}
                        >
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatActivityDate(activity.date)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Avatar Upload Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentLanguage.code === 'ar' ? 'تحديث صورة الملف الشخصي' : 'Update Profile Picture'}
            </DialogTitle>
            <DialogDescription>
              {currentLanguage.code === 'ar' 
                ? 'اختر صورة من جهازك لاستخدامها كصورة ملفك الشخصي' 
                : 'Choose an image from your device to use as your profile picture'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid place-items-center py-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-accent transition-colors cursor-pointer">
              <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-1">
                {currentLanguage.code === 'ar' 
                  ? 'اسحب وأفلت الصورة هنا أو انقر للتصفح' 
                  : 'Drag and drop an image here or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF {currentLanguage.code === 'ar' ? 'حتى' : 'up to'} 2MB
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAvatarDialogOpen(false)}
            >
              {currentLanguage.code === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button>
              {currentLanguage.code === 'ar' ? 'حفظ' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Missing Components
const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Settings = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);