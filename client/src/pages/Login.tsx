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
                  <p className="text-white/90 text-lg font-light">EXCLUSIVE SAHEL & RAS EL HEKMA</p>
                </div>

                <div className="bg-white/10 backdrop-filter backdrop-blur-md rounded-xl p-8 shadow-lg">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/20">
                      <TabsTrigger value="login" className="text-slate-100 data-[state=active]:bg-white/20 data-[state=active]:text-white">Sign In</TabsTrigger>
                      <TabsTrigger value="register" className="text-slate-100 data-[state=active]:bg-white/20 data-[state=active]:text-white">Join Us</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white/90 text-sm font-medium">USERNAME</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your username" 
                                    {...field} 
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/30 transition-all duration-300"
                                  />
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
                                <FormLabel className="text-white/90 text-sm font-medium">PASSWORD</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    {...field} 
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/30 transition-all duration-300"
                                  />
                                </FormControl>
                                <FormMessage className="text-amber-300 text-xs" />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full mt-8 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? 
                              <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Authenticating...</span>
                              </div>
                              : "SIGN IN"
                            }
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="register">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white/90 text-sm font-medium">USERNAME</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Choose a username" 
                                    {...field} 
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/30 transition-all duration-300"
                                  />
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
                                <FormLabel className="text-white/90 text-sm font-medium">EMAIL</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    {...field} 
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/30 transition-all duration-300"
                                  />
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
                                  <FormLabel className="text-white/90 text-sm font-medium">PASSWORD</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password" 
                                      placeholder="Create a password" 
                                      {...field} 
                                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/30 transition-all duration-300"
                                    />
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
                                  <FormLabel className="text-white/90 text-sm font-medium">CONFIRM</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password" 
                                      placeholder="Confirm password" 
                                      {...field} 
                                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/30 transition-all duration-300"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-amber-300 text-xs" />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
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
                              : "BECOME A MEMBER"
                            }
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                  <p className="text-xs text-center text-white/60 mt-6 font-light">
                    By continuing, you agree to Stay Chill's Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
              
              {/* Right Side - Luxury Visual & About Us */}
              <div className="w-full lg:w-1/2 bg-[url('https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-teal-800/50"></div>
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  <div className="mb-8">
                    <h2 className="text-3xl font-light text-white mb-2 tracking-wide">EXCEPTIONAL <span className="font-bold">EXPERIENCES</span></h2>
                    <div className="h-0.5 w-16 bg-amber-400 mb-4"></div>
                    <p className="text-white/80 leading-relaxed">
                      Discover our curated collection of luxury properties in Sahel and Ras El Hekma, 
                      designed exclusively for the most discerning clientele.
                    </p>
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
                  
                  <div className="flex items-center mt-auto">
                    <div className="flex mr-4">
                      <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="Happy client" className="h-full w-full object-cover" />
                      </div>
                      <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden -ml-3">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="Happy client" className="h-full w-full object-cover" />
                      </div>
                      <div className="h-10 w-10 rounded-full border-2 border-white overflow-hidden -ml-3">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80" alt="Happy client" className="h-full w-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <p className="text-amber-400 font-medium text-sm">Join our exclusive community</p>
                      <p className="text-white/80 text-xs">5,000+ satisfied clients</p>
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