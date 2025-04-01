import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquiryValidationSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail, MapPin } from "lucide-react";
import { z } from "zod";

export default function Contact() {
  const { toast } = useToast();
  
  // Create inquiry form
  const form = useForm<z.infer<typeof inquiryValidationSchema>>({
    resolver: zodResolver(inquiryValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Inquiry mutation
  const inquiryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof inquiryValidationSchema>) => {
      const res = await apiRequest("POST", "/api/inquiries", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof inquiryValidationSchema>) => {
    inquiryMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Stay Chill</title>
        <meta name="description" content="Get in touch with Stay Chill for any questions about vacation rentals in Sahel and Ras El Hekma, Egypt." />
      </Helmet>
      
      <div className="bg-ocean-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions about our properties or services? We're here to help! Reach out to us and our team will get back to you as soon as possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center mb-4">
                    <PhoneCall className="h-6 w-6 text-ocean-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">+20 123 456 7890</p>
                  <p className="text-gray-600">Mon-Fri, 9am-6pm</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-ocean-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">info@staychill.com</p>
                  <p className="text-gray-600">support@staychill.com</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-ocean-100 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-ocean-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Office</h3>
                  <p className="text-gray-600">123 Beach Drive</p>
                  <p className="text-gray-600">Cairo, Egypt</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?"
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="bg-ocean-500 hover:bg-ocean-600 text-white"
                      disabled={inquiryMutation.isPending}
                    >
                      {inquiryMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <div className="rounded-lg overflow-hidden h-[400px] bg-gray-200 flex items-center justify-center mb-8">
              <p className="text-gray-500">Google Map will be embedded here</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
