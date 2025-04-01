import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet";

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
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
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
      const res = await apiRequest("POST", "/api/auth/register", registerData);
      return res.json();
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

      <div className="min-h-screen bg-gradient-to-b from-ocean-800 via-ocean-600 to-ocean-400 flex items-center justify-center p-4">
        <div className="container max-w-6xl mx-auto">
          {/* Glass Card Container */}
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Login Form */}
              <div className="w-full lg:w-1/2 p-8 md:p-12">
                <div className="mb-8 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">Stay Chill</h1>
                  <div className="h-1 w-16 bg-coral-400 mx-auto mt-3 mb-6 rounded-full"></div>
                  <p className="text-white text-lg opacity-90">Extraordinary Vacation Experiences</p>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-md rounded-xl p-6 md:p-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-white bg-opacity-40">
                      <TabsTrigger value="login" className="text-ocean-900 data-[state=active]:bg-white data-[state=active]:text-ocean-800">Login</TabsTrigger>
                      <TabsTrigger value="register" className="text-ocean-900 data-[state=active]:bg-white data-[state=active]:text-ocean-800">Register</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Username</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your username" 
                                    {...field} 
                                    className="bg-white bg-opacity-30 border-0 text-white placeholder:text-white placeholder:text-opacity-60 focus:bg-white focus:bg-opacity-40"
                                  />
                                </FormControl>
                                <FormMessage className="text-coral-300" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    {...field} 
                                    className="bg-white bg-opacity-30 border-0 text-white placeholder:text-white placeholder:text-opacity-60 focus:bg-white focus:bg-opacity-40"
                                  />
                                </FormControl>
                                <FormMessage className="text-coral-300" />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full mt-6 bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 focus:scale-95"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? "Logging in..." : "Log In"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="register">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Username</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Choose a username" 
                                    {...field} 
                                    className="bg-white bg-opacity-30 border-0 text-white placeholder:text-white placeholder:text-opacity-60 focus:bg-white focus:bg-opacity-40"
                                  />
                                </FormControl>
                                <FormMessage className="text-coral-300" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    {...field} 
                                    className="bg-white bg-opacity-30 border-0 text-white placeholder:text-white placeholder:text-opacity-60 focus:bg-white focus:bg-opacity-40"
                                  />
                                </FormControl>
                                <FormMessage className="text-coral-300" />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Password</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password" 
                                      placeholder="Create a password" 
                                      {...field} 
                                      className="bg-white bg-opacity-30 border-0 text-white placeholder:text-white placeholder:text-opacity-60 focus:bg-white focus:bg-opacity-40"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-coral-300" />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">Confirm</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="password" 
                                      placeholder="Confirm password" 
                                      {...field} 
                                      className="bg-white bg-opacity-30 border-0 text-white placeholder:text-white placeholder:text-opacity-60 focus:bg-white focus:bg-opacity-40"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-coral-300" />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full mt-6 bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2 rounded-lg transition-transform duration-200 hover:scale-105 focus:scale-95"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? "Creating account..." : "Create Account"}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                  <p className="text-xs text-center text-white text-opacity-80 mt-6">
                    By continuing, you agree to Stay Chill's Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
              
              {/* Right Side - Luxury Visual & About Us */}
              <div className="w-full lg:w-1/2 bg-[url('https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-ocean-900/80 to-ocean-800/30 backdrop-blur-sm"></div>
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  <div className="mb-6 border-l-4 border-coral-400 pl-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Egypt's Premier Luxury Rentals</h2>
                    <p className="text-white text-opacity-90">
                      Discover exceptional properties in Sahel and Ras El Hekma, handpicked for discerning travelers.
                    </p>
                  </div>
                  
                  <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-xl p-5 mb-8 border border-white border-opacity-20">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-coral-500 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-white font-semibold">Seamless Experience</h3>
                        <p className="text-white text-opacity-80 text-sm">Virtual tours, easy booking, concierge service</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-coral-500 flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-white font-semibold">Luxury Guaranteed</h3>
                        <p className="text-white text-opacity-80 text-sm">Verified quality standards for every property</p>
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