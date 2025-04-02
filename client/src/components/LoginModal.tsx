import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "./LanguageSwitcher";
import { useTranslation } from "@/lib/translations";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Login schema with validation
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration schema with validation
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  email: z.string().email("Please enter a valid email address"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  const { login, register: registerUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);

  // Setup login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Setup registration form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const success = await login(data.username, data.password);
      if (!success) {
        throw new Error("Invalid username or password");
      }
      return success;
    },
    onSuccess: () => {
      toast({
        title: t('loginSuccess'),
        description: t('welcomeBack'),
      });
      onClose();
      loginForm.reset();
    },
    onError: (error) => {
      toast({
        title: currentLanguage.code === 'ar' ? "فشل تسجيل الدخول" : "Login failed",
        description: error instanceof Error ? error.message : 
          (currentLanguage.code === 'ar' ? "اسم المستخدم أو كلمة المرور غير صحيحة" : "Invalid username or password"),
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof registerSchema>) => {
      const { confirmPassword, ...registerData } = data;
      const success = await registerUser(registerData.username, registerData.password, registerData.email);
      if (!success) {
        throw new Error("Registration failed. Username may already exist.");
      }
      return success;
    },
    onSuccess: () => {
      toast({
        title: t('registerSuccess'),
        description: currentLanguage.code === 'ar' ? "يمكنك الآن تسجيل الدخول إلى حسابك" : "You can now log in to your account",
      });
      setActiveTab("login");
      registerForm.reset();
    },
    onError: (error) => {
      toast({
        title: currentLanguage.code === 'ar' ? "فشل التسجيل" : "Registration failed",
        description: error instanceof Error ? error.message : 
          (currentLanguage.code === 'ar' ? "يرجى المحاولة مرة أخرى باستخدام بيانات اعتماد مختلفة" : "Please try again with different credentials"),
        variant: "destructive",
      });
    },
  });

  // Handle form submissions
  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate(data);
  };

  const guestLogin = () => {
    loginMutation.mutate({ username: "guest", password: "guest123" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-md md:max-w-lg bg-white dark:bg-gray-800 border-none shadow-2xl ${currentLanguage.code === 'ar' ? 'ar' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
            {t('welcomeBack')}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
            {t('accessExclusive')}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="login" 
              className="text-slate-600 font-medium dark:text-slate-300 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400 rounded-md py-3"
            >
              {t('signIn')}
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="text-slate-600 font-medium dark:text-slate-300 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-emerald-900/20 dark:data-[state=active]:text-emerald-400 rounded-md py-3"
            >
              {t('createAccount')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-3">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">{t('username')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={currentLanguage.code === 'ar' ? "أدخل اسم المستخدم" : "Enter your username"} 
                          {...field} 
                          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                          dir={currentLanguage.direction}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">{t('password')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={currentLanguage.code === 'ar' ? "أدخل كلمة المرور" : "Enter your password"}
                          {...field} 
                          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                          dir={currentLanguage.direction}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-md transition-all duration-300"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 
                    <div className="flex items-center justify-center">
                      <svg className={`animate-spin ${currentLanguage.code === 'ar' ? 'ml-2 -mr-1' : '-ml-1 mr-2'} h-4 w-4 text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{currentLanguage.code === 'ar' ? "جاري تسجيل الدخول..." : "Signing In..."}</span>
                    </div>
                    : t('signIn')
                  }
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  {currentLanguage.code === 'ar' ? 'أو' : 'or'}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={guestLogin}
              dir={currentLanguage.direction}
            >
              {t('continueAsGuest')}
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">{t('username')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={currentLanguage.code === 'ar' ? "اختر اسم مستخدم" : "Choose a username"} 
                          {...field} 
                          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                          dir={currentLanguage.direction}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">{t('email')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={currentLanguage.code === 'ar' ? "أدخل بريدك الإلكتروني" : "Enter your email"} 
                          {...field} 
                          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                          dir={currentLanguage.direction}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">{t('password')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={currentLanguage.code === 'ar' ? "أنشئ كلمة مرور" : "Create a password"} 
                          {...field} 
                          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                          dir={currentLanguage.direction}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-300">{t('confirmPassword')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={currentLanguage.code === 'ar' ? "تأكيد كلمة المرور" : "Confirm your password"} 
                          {...field} 
                          className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                          dir={currentLanguage.direction}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 rounded-md transition-all duration-300"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 
                    <div className="flex items-center justify-center">
                      <svg className={`animate-spin ${currentLanguage.code === 'ar' ? 'ml-2 -mr-1' : '-ml-1 mr-2'} h-4 w-4 text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{currentLanguage.code === 'ar' ? "جاري إنشاء الحساب..." : "Creating Account..."}</span>
                    </div>
                    : t('createAccount')
                  }
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-center mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center" dir={currentLanguage.direction}>
            {t('termsAgreement')}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}