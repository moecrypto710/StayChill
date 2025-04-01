import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Property } from "@shared/schema";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange, Panorama } from "@/lib/types";
import Panorama360Gallery from "@/components/Panorama360Gallery";
import PropertyHeatMap, { AvailabilityData } from "@/components/PropertyHeatMap";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  inquiryValidationSchema, 
  bookingValidationSchema 
} from "@shared/schema";
import { 
  MapPin, 
  Users,
  Bed,
  Bath,
  Star,
  Calendar,
  Heart,
  Share2
} from "lucide-react";
import { z } from "zod";
import { Helmet } from "react-helmet";

export default function PropertyDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const propertyId = parseInt(id);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "This property has been removed from your favorites" 
        : "This property has been added to your favorites"
    });
  };

  // Fetch property details
  const { data: property, isLoading, isError } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
  });

  // Create booking form
  const bookingForm = useForm<z.infer<typeof bookingValidationSchema>>({
    resolver: zodResolver(bookingValidationSchema),
    defaultValues: {
      propertyId: propertyId,
      name: "",
      email: "",
      phone: "",
      guests: 1,
      message: "",
    },
  });

  // Create inquiry form
  const inquiryForm = useForm<z.infer<typeof inquiryValidationSchema>>({
    resolver: zodResolver(inquiryValidationSchema),
    defaultValues: {
      propertyId: propertyId,
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });
  
  // Sample panoramas for 360° virtual tour
  const [panoramas, setPanoramas] = useState<Panorama[]>([]);
  
  // Get property availability data
  const { data: availabilityData, isLoading: isLoadingAvailability } = useQuery<AvailabilityData>({
    queryKey: [`/api/properties/${propertyId}/availability`],
    enabled: !!property, // Only fetch when property data is available
  });
  
  // Handler for date selection from heat map
  const handleDateSelect = (date: string, price: number, available: boolean) => {
    if (!available) {
      toast({
        title: "Date not available",
        description: "This date is not available for booking.",
        variant: "destructive",
      });
      return;
    }
    
    // Parse date string to Date object
    const selectedDate = new Date(date);
    
    // Set date in date range picker
    setDateRange(prev => ({
      ...prev,
      from: selectedDate,
      to: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000) // Next day
    }));
    
    toast({
      title: "Date selected",
      description: `Selected ${date} at $${price}/night`,
    });
  };
  
  // Initialize panoramas for the current property
  useEffect(() => {
    if (property) {
      // In a real app, these would be fetched from an API
      const propertyPanoramas: Panorama[] = [
        {
          id: 'living-room',
          url: 'https://pannellum.org/images/cerro-toco-0.jpg',
          title: 'Living Room',
          thumbnail: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'kitchen',
          url: 'https://pannellum.org/images/jfk.jpg',
          title: 'Kitchen',
          thumbnail: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'bedroom',
          url: 'https://pannellum.org/images/alma.jpg',
          title: 'Master Bedroom',
          thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'bathroom',
          url: 'https://pannellum.org/images/bma-1.jpg',
          title: 'Bathroom',
          thumbnail: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
        },
      ];
      
      setPanoramas(propertyPanoramas);
    }
  }, [property]);

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof bookingValidationSchema>) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking request submitted!",
        description: "We'll get back to you soon to confirm your booking.",
      });
      bookingForm.reset();
      setDateRange({ from: undefined, to: undefined });
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
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
        title: "Inquiry sent!",
        description: "We'll get back to you as soon as possible.",
      });
      inquiryForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to send inquiry",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });

  // Handle booking submission
  const onBookingSubmit = (data: z.infer<typeof bookingValidationSchema>) => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Please select dates",
        description: "You need to select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      ...data,
      checkIn: dateRange.from,
      checkOut: dateRange.to,
    };

    bookingMutation.mutate(bookingData);
  };

  // Handle inquiry submission
  const onInquirySubmit = (data: z.infer<typeof inquiryValidationSchema>) => {
    inquiryMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 mt-8"></div>
              <div className="flex flex-wrap gap-2 mb-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
                ))}
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="mb-8">We couldn't find the property you're looking for.</p>
        <Button onClick={() => navigate("/properties")}>
          Browse All Properties
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{property.title} | Stay Chill</title>
        <meta name="description" content={property.description.substring(0, 160)} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1 text-coral-500" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-coral-500 text-coral-500' : ''}`} />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Property Images */}
        <div className="mb-10">
          <div className="rounded-lg overflow-hidden h-[400px] w-full">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-ocean-600" />
                <span>{property.maxGuests} Guests</span>
              </div>
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2 text-ocean-600" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-2 text-ocean-600" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              {property.reviewCount > 0 && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400 fill-yellow-400" />
                  <span>{(property.rating / 10).toFixed(1)} ({property.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">About this property</h2>
              <p className="text-gray-700 mb-6 whitespace-pre-line">{property.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-ocean-100 flex items-center justify-center mr-3">
                      <i className="fas fa-check text-ocean-600"></i>
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map will be displayed here</p>
              </div>
              <p className="mt-4 text-gray-700">
                Located in {property.location}, this property offers easy access to the beach and local attractions.
              </p>
            </div>
            
            {/* Availability & Pricing Heat Map */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Availability & Pricing</h2>
              {isLoadingAvailability ? (
                <div className="animate-pulse h-72 bg-gray-200 rounded-lg"></div>
              ) : availabilityData ? (
                <PropertyHeatMap
                  availabilityData={availabilityData}
                  onDateSelect={handleDateSelect}
                  isInteractive={true}
                />
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-amber-700">Availability information could not be loaded. Please try again later.</p>
                </div>
              )}
              <p className="mt-4 text-gray-700">
                Select a date on the calendar to see pricing and availability. Green dates are available for booking.
              </p>
            </div>

            {/* 360° Virtual Tour */}
            {panoramas.length > 0 && (
              <Panorama360Gallery
                propertyTitle={property.title}
                panoramas={panoramas}
              />
            )}
          </div>

          {/* Booking Card */}
          <div className="mt-10 md:mt-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>${property.price}</span>
                  <span className="text-gray-500 text-base font-normal">/night</span>
                </CardTitle>
                {property.reviewCount > 0 && (
                  <CardDescription className="flex items-center mt-1">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                    <span>{(property.rating / 10).toFixed(1)} · {property.reviewCount} reviews</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="booking">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="booking">Book</TabsTrigger>
                    <TabsTrigger value="inquiry">Inquire</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="booking">
                    <Form {...bookingForm}>
                      <form onSubmit={bookingForm.handleSubmit(onBookingSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <FormLabel>Select Dates</FormLabel>
                          <DateRangePicker
                            date={dateRange}
                            onDateChange={setDateRange}
                          />
                        </div>
                        
                        <FormField
                          control={bookingForm.control}
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
                          control={bookingForm.control}
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
                        
                        <FormField
                          control={bookingForm.control}
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
                          control={bookingForm.control}
                          name="guests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Guests</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={property.maxGuests}
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={bookingForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any special requests or questions?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button
                          type="submit"
                          className="w-full bg-coral-500 hover:bg-coral-600 text-white"
                          disabled={bookingMutation.isPending}
                        >
                          {bookingMutation.isPending ? "Sending Request..." : "Request to Book"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="inquiry">
                    <Form {...inquiryForm}>
                      <form onSubmit={inquiryForm.handleSubmit(onInquirySubmit)} className="space-y-4">
                        <FormField
                          control={inquiryForm.control}
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
                          control={inquiryForm.control}
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
                        
                        <FormField
                          control={inquiryForm.control}
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
                          control={inquiryForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Ask a question about this property"
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button
                          type="submit"
                          className="w-full bg-ocean-500 hover:bg-ocean-600 text-white"
                          disabled={inquiryMutation.isPending}
                        >
                          {inquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                <p>You won't be charged yet</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
