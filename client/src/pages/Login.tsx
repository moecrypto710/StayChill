import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet";
import { useAuth } from "@/lib/auth";

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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

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

export default function Login() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const { login, register: registerUser, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
        title: "Login successful!",
        description: "Welcome back to Stay Chill",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid username or password",
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
        title: "Registration successful!",
        description: "You can now log in to your account",
      });
      setActiveTab("login");
      registerForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again with different credentials",
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

  return (
    <>
      <Helmet>
        <title>Login | Stay Chill</title>
        <meta name="description" content="Log in to access premium vacation rentals in Sahel and Ras El Hekma, Egypt" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 flex items-center justify-center p-4">
        <div className="container max-w-6xl mx-auto">
          {/* Luxury Card Container */}
          <div className="bg-white/5 backdrop-filter backdrop-blur-xl rounded-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] overflow-hidden border border-white/10">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Login Form */}
              <div className="w-full lg:w-1/2 p-8 md:p-12">
                <div className="mb-8 text-center">
                  <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-amber-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md tracking-tight">STAY CHILL</h1>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-teal-400 via-blue-400 to-amber-400 mx-auto mt-4 mb-6"></div>
                  <p className="text-white/90 text-lg font-light">UNLOCK PREMIUM EXPERIENCES</p>
                  <div className="mt-3">
                    <span className="inline-block bg-teal-500/20 text-teal-300 text-xs px-2.5 py-1 rounded-full border border-teal-600/30 font-medium">Exclusive Access</span>
                    <span className="ml-2 inline-block bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full border border-amber-600/30 font-medium">Verified Properties</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/20 rounded-xl p-1">
                      <TabsTrigger 
                        value="login" 
                        className="text-white font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-white rounded-lg py-3 transition-all duration-300"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger 
                        value="register" 
                        className="text-white font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-white rounded-lg py-3 transition-all duration-300"
                      >
                        Create Account
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="animate-in fade-in-50">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white text-sm font-medium">Username</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5"/>
                                      </svg>
                                    </div>
                                    <Input 
                                      placeholder="Enter your username" 
                                      {...field} 
                                      className="bg-black/20 pl-10 border-transparent text-white placeholder:text-white/40 focus:bg-black/30 focus:border-primary/50 focus:ring-primary/50 rounded-xl h-12 transition-all duration-300"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-amber-300 text-xs" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white text-sm font-medium">Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="1.5"/>
                                      </svg>
                                    </div>
                                    <Input 
                                      type="password" 
                                      placeholder="Enter your password" 
                                      {...field} 
                                      className="bg-black/20 pl-10 border-transparent text-white placeholder:text-white/40 focus:bg-black/30 focus:border-primary/50 focus:ring-primary/50 rounded-xl h-12 transition-all duration-300"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-amber-300 text-xs" />
                              </FormItem>
                            )}
                          />
                          
                          <div className="space-y-3 mt-8">
                            <Button 
                              type="submit" 
                              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium py-3 h-12 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? 
                                <div className="flex items-center justify-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Signing In...</span>
                                </div>
                                : <div className="flex items-center justify-center">
                                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3 22C3 17.0294 7.02944 13 12 13C16.9706 13 21 17.0294 21 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Sign In</span>
                                  </div>
                              }
                            </Button>
                            
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/20"></span>
                              </div>
                              <div className="relative flex justify-center text-xs">
                                <span className="bg-slate-900/80 px-2 text-white/60">or</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-amber-300 hover:border-amber-300/50 rounded-xl py-3 h-12"
                                onClick={() => {
                                  loginForm.setValue("username", "guest");
                                  loginForm.setValue("password", "guest123");
                                  loginMutation.mutate({ username: "guest", password: "guest123" });
                                }}
                              >
                                <div className="flex items-center justify-center">
                                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 16.5C8 18.9853 10.0147 21 12.5 21C14.9853 21 17 18.9853 17 16.5C17 14.0147 14.9853 12 12.5 12C10.0147 12 8 14.0147 8 16.5Z" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M20 18C21.6569 18 23 16.6569 23 15C23 13.3431 21.6569 12 20 12C18.9143 12 17.9816 12.6255 17.5 13.5" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M4 18C2.34315 18 1 16.6569 1 15C1 13.3431 2.34315 12 4 12C5.08571 12 6.01843 12.6255 6.5 13.5" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9Z" fill="currentColor"/>
                                    <path d="M16 7C16 7.55228 15.5523 8 15 8C14.4477 8 14 7.55228 14 7C14 6.44772 14.4477 6 15 6C15.5523 6 16 6.44772 16 7Z" fill="currentColor"/>
                                    <path d="M10 7C10 7.55228 9.55228 8 9 8C8.44772 8 8 7.55228 8 7C8 6.44772 8.44772 6 9 6C9.55228 6 10 6.44772 10 7Z" fill="currentColor"/>
                                    <path d="M16 9.5C16.8284 9.5 17.5 8.82843 17.5 8C17.5 7.17157 16.8284 6.5 16 6.5C15.1716 6.5 14.5 7.17157 14.5 8C14.5 8.82843 15.1716 9.5 16 9.5Z" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M8 9.5C8.82843 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5Z" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M12 7.5C12.8284 7.5 13.5 6.82843 13.5 6C13.5 5.17157 12.8284 4.5 12 4.5C11.1716 4.5 10.5 5.17157 10.5 6C10.5 6.82843 11.1716 7.5 12 7.5Z" stroke="currentColor" strokeWidth="1.5"/>
                                  </svg>
                                  <span>Guest Access</span>
                                </div>
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-blue-300 hover:border-blue-300/50 rounded-xl py-3 h-12"
                                onClick={() => {
                                  // TODO: Implement Google auth when API is available
                                  toast({
                                    title: "Google Login",
                                    description: "Google login will be available soon.",
                                    variant: "default",
                                  });
                                }}
                              >
                                <div className="flex items-center justify-center">
                                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                                    <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                                    <path d="M5.50253 14.3002C4.99987 12.8099 4.99987 11.1961 5.50253 9.70581V6.61487H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3002Z" fill="#FBBC04"/>
                                    <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
                                  </svg>
                                  <span>Google Login</span>
                                </div>
                              </Button>
                            </div>
                          </div>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="animate-in fade-in-50">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white text-sm font-medium">Username</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5"/>
                                      </svg>
                                    </div>
                                    <Input 
                                      placeholder="Choose a username" 
                                      {...field}
                                      className="bg-black/20 pl-10 border-transparent text-white placeholder:text-white/40 focus:bg-black/30 focus:border-primary/50 focus:ring-primary/50 rounded-xl h-12 transition-all duration-300"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-amber-300 text-xs" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white text-sm font-medium">Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </div>
                                    <Input 
                                      type="email" 
                                      placeholder="Enter your email" 
                                      {...field} 
                                      className="bg-black/20 pl-10 border-transparent text-white placeholder:text-white/40 focus:bg-black/30 focus:border-primary/50 focus:ring-primary/50 rounded-xl h-12 transition-all duration-300"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-amber-300 text-xs" />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white text-sm font-medium">Password</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="1.5"/>
                                          <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="1.5"/>
                                        </svg>
                                      </div>
                                      <Input 
                                        type="password" 
                                        placeholder="Create a password" 
                                        {...field} 
                                        className="bg-black/20 pl-10 border-transparent text-white placeholder:text-white/40 focus:bg-black/30 focus:border-primary/50 focus:ring-primary/50 rounded-xl h-12 transition-all duration-300"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-amber-300 text-xs" />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white text-sm font-medium">Confirm</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="1.5"/>
                                          <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="1.5"/>
                                        </svg>
                                      </div>
                                      <Input 
                                        type="password" 
                                        placeholder="Confirm password" 
                                        {...field} 
                                        className="bg-black/20 pl-10 border-transparent text-white placeholder:text-white/40 focus:bg-black/30 focus:border-primary/50 focus:ring-primary/50 rounded-xl h-12 transition-all duration-300"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage className="text-amber-300 text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full mt-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-medium py-3 h-12 rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? 
                              <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Creating Account...</span>
                              </div>
                              : "Create Account"
                            }
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                  <div className="mt-6 bg-gradient-to-r from-slate-900/90 to-slate-800/80 p-3 rounded-lg border border-teal-500/20">
                    <p className="text-sm text-center text-white/70 flex items-center justify-center">
                      <svg className="w-4 h-4 text-teal-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      By signing in, you agree to Stay Chill's Terms of Service
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Luxury Visual & About Us */}
              <div className="w-full lg:w-1/2 bg-[url('https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-teal-800/50"></div>
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  <div className="mb-8">
                    <h2 className="text-3xl font-light text-white mb-2 tracking-wide">DISCOVER <span className="font-bold">LUXURY LIVING</span></h2>
                    <div className="h-0.5 w-16 bg-amber-400 mb-4"></div>
                    <p className="text-white/80 leading-relaxed">
                      Explore a handpicked collection of premium properties at exclusive locations, 
                      with personalized services for the ultimate vacation experience.
                    </p>
                    <div className="mt-4 bg-gradient-to-r from-teal-400/20 to-teal-600/20 rounded-lg p-3 border border-teal-500/20">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-teal-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-white/90 text-sm">Over 95% customer satisfaction rate</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-filter backdrop-blur-md rounded-lg p-5 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-white text-lg font-semibold mb-1">Elite Properties</h3>
                      <p className="text-white/70 text-sm">Ultra-luxury villas and beachfront estates in premium locations</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-filter backdrop-blur-md rounded-lg p-5 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/20">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-4">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-white text-lg font-semibold mb-1">360° Virtual Tours</h3>
                      <p className="text-white/70 text-sm">Immersive exploration of each property before booking</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-center mt-4 bg-white/10 rounded-lg p-3">
                      <div className="text-center">
                        <p className="text-white font-medium mb-1">Experience the Ultimate in Luxury</p>
                        <p className="text-amber-300 text-sm">Sign in to unlock exclusive access and special offers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}