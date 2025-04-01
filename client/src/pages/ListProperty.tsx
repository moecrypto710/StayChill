import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPropertySchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { UmbrellaIcon, Home, CheckCircle, Upload, PlusCircle, X } from "lucide-react";

// Extend the insert schema with validation
const listPropertySchema = insertPropertySchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  location: z.string().min(5, "Location must be at least 5 characters long"),
  area: z.enum(["Sahel", "Ras El Hekma"], {
    required_error: "Please select an area",
  }),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  bedrooms: z.coerce.number().min(1, "Property must have at least 1 bedroom"),
  bathrooms: z.coerce.number().min(1, "Property must have at least 1 bathroom"),
  maxGuests: z.coerce.number().min(1, "Property must accommodate at least 1 guest"),
  images: z.array(z.string()).min(1, "Please add at least one image URL"),
  amenities: z.array(z.string()).min(1, "Please select at least one amenity"),
});

type FormValues = z.infer<typeof listPropertySchema>;

// Available amenities
const amenitiesOptions = [
  "Beachfront",
  "Private Pool",
  "Shared Pool",
  "Wi-Fi",
  "Air Conditioning",
  "Sea View",
  "BBQ",
  "Garden",
  "Parking",
  "Pet-friendly",
  "Beach Nearby",
  "Gym",
  "Kitchen",
  "Balcony/Terrace",
  "TV",
];

export default function ListProperty() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(listPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      area: "Sahel",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 1,
      images: [],
      amenities: [],
      featured: false,
      isNew: true,
      rating: 0,
      reviewCount: 0,
    },
  });

  // Property listing mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/properties", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Property Listed Successfully!",
        description: "Your property is now under review and will be published soon.",
      });
      form.reset();
      setImageUrls([]);
      setNewImageUrl("");
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to list property",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleAddImage = () => {
    if (!newImageUrl) return;
    if (!newImageUrl.startsWith("http")) {
      toast({
        title: "Invalid image URL",
        description: "Please enter a valid image URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }
    
    const updatedImages = [...imageUrls, newImageUrl];
    setImageUrls(updatedImages);
    form.setValue("images", updatedImages);
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    form.setValue("images", updatedImages);
  };

  const onSubmit = (data: FormValues) => {
    createPropertyMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>List Your Property | Stay Chill</title>
        <meta name="description" content="List your property in Sahel or Ras El Hekma with Stay Chill and start earning from your vacation home." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-ocean-600 py-16">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')"}}>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-white mb-4">List Your Property with Stay Chill</h1>
            <p className="text-xl text-white mb-6">
              Join our community of property owners and start earning from your vacation home today
            </p>
            <div className="flex items-center space-x-2 text-white">
              <CheckCircle className="h-5 w-5 text-sand-200" />
              <span>Simple listing process</span>
              <span className="mx-2">•</span>
              <CheckCircle className="h-5 w-5 text-sand-200" />
              <span>Verified renters</span>
              <span className="mx-2">•</span>
              <CheckCircle className="h-5 w-5 text-sand-200" />
              <span>Dedicated support</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Property Form Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Property Details</CardTitle>
                <CardDescription>
                  Fill out the information below to list your property on Stay Chill
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Home className="mr-2 h-5 w-5 text-ocean-500" />
                          Basic Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Property Title*</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Luxurious Beachfront Villa" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="area"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Area*</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select area" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Sahel">Sahel</SelectItem>
                                    <SelectItem value="Ras El Hekma">Ras El Hekma</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specific Location*</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., North Coast, Marina" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Enter the specific neighborhood or landmark
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price per Night (USD)*</FormLabel>
                                <FormControl>
                                  <Input type="number" min="0" placeholder="e.g., 150" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="mt-6">
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Property Description*</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe your property in detail..."
                                    className="min-h-[150px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Include details about the property, surroundings, and unique features
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Home className="mr-2 h-5 w-5 text-ocean-500" />
                          Property Specifications
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="bedrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bedrooms*</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bathrooms"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bathrooms*</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="maxGuests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Maximum Guests*</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <UmbrellaIcon className="mr-2 h-5 w-5 text-coral-500" />
                          Amenities
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="amenities"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">Select available amenities*</FormLabel>
                                <FormDescription>
                                  Choose all the amenities that your property offers
                                </FormDescription>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {amenitiesOptions.map((amenity) => (
                                  <FormField
                                    key={amenity}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={amenity}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(amenity)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, amenity])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== amenity
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {amenity}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Upload className="mr-2 h-5 w-5 text-ocean-500" />
                          Property Images
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="images"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Add Images*</FormLabel>
                              <FormDescription className="mb-2">
                                Add high-quality images of your property (exterior, interior, views)
                              </FormDescription>
                              
                              <div className="flex flex-col space-y-3">
                                <div className="flex gap-2">
                                  <FormControl>
                                    <Input
                                      placeholder="Enter image URL"
                                      value={newImageUrl}
                                      onChange={(e) => setNewImageUrl(e.target.value)}
                                    />
                                  </FormControl>
                                  <Button 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={handleAddImage}
                                    className="flex-shrink-0"
                                  >
                                    <PlusCircle className="h-4 w-4 mr-1" /> Add
                                  </Button>
                                </div>
                                
                                {imageUrls.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {imageUrls.map((url, index) => (
                                      <div key={index} className="relative group">
                                        <img
                                          src={url}
                                          alt={`Property image ${index + 1}`}
                                          className="h-40 w-full object-cover rounded-md border border-gray-200"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image+Error';
                                          }}
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeImage(index)}
                                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
                                    No images added yet
                                  </div>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <UmbrellaIcon className="mr-2 h-5 w-5 text-coral-500" />
                          Additional Options
                        </h3>
                        
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="isNew"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Mark as New Property</FormLabel>
                                  <FormDescription>
                                    This will add a "New" tag to your property listing
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <CardFooter className="flex justify-between pb-0">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-coral-500 hover:bg-coral-600"
                        disabled={createPropertyMutation.isPending}
                      >
                        {createPropertyMutation.isPending ? "Submitting..." : "Submit Property"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Listing Your Property Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our community of property owners and start earning from your vacation home with our simple process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-ocean-100 rounded-full text-ocean-600">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">List Your Property</h3>
              <p className="text-gray-600">Fill out the form with all your property details, amenities, and high-quality photos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-ocean-100 rounded-full text-ocean-600">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">We Review & Verify</h3>
              <p className="text-gray-600">Our team reviews your property to ensure it meets our quality standards</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-ocean-100 rounded-full text-ocean-600">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Start Receiving Bookings</h3>
              <p className="text-gray-600">Once approved, your property is live and you'll start receiving booking requests</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Owner Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits for Property Owners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Why property owners choose Stay Chill for their vacation rentals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Targeted Exposure</h3>
                <p className="text-gray-600">
                  We focus exclusively on Sahel and Ras El Hekma, bringing you guests who are specifically looking for properties in these areas
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Quality Guests</h3>
                <p className="text-gray-600">
                  Our verification process ensures you receive bookings from reliable, respectful guests
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Dedicated Support</h3>
                <p className="text-gray-600">
                  Our team is always available to assist with any questions or issues you may have
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-ocean-100 flex items-center justify-center text-ocean-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Maximize Your Income</h3>
                <p className="text-gray-600">
                  Our platform helps you optimize your pricing and availability to maximize your rental income
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-ocean-500 hover:bg-ocean-600"
            >
              List Your Property Now
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
