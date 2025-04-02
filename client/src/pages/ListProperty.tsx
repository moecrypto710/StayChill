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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Upload, CheckCircle, PlusCircle, X } from "lucide-react";
import { z } from "zod";

const listPropertySchema = insertPropertySchema.extend({
  title: z.string()
    .min(5, "العنوان يجب أن يكون 5 أحرف على الأقل")
    .max(100, "العنوان لا يجب أن يتجاوز 100 حرف")
    .refine(value => /^[\u0600-\u06FFa-zA-Z0-9\s.,'-]+$/.test(value), {
      message: "العنوان يجب أن يحتوي على حروف وأرقام فقط"
    }),
  description: z.string()
    .min(20, "الوصف يجب أن يكون 20 حرف على الأقل")
    .max(2000, "الوصف لا يجب أن يتجاوز 2000 حرف")
    .refine(value => value.split(' ').length >= 5, {
      message: "الوصف يجب أن يحتوي على 5 كلمات على الأقل"
    }),
  location: z.string()
    .min(5, "الموقع يجب أن يكون 5 أحرف على الأقل")
    .refine(value => /^[\u0600-\u06FFa-zA-Z0-9\s.,'-]+$/.test(value), {
      message: "الموقع يجب أن يحتوي على حروف وأرقام فقط"
    }),
  area: z.enum(["Sahel", "Ras El Hekma"]),
  price: z.coerce.number()
    .min(1, "السعر يجب أن يكون أكبر من 0")
    .max(10000, "السعر لا يجب أن يتجاوز 10000 دولار")
    .refine(value => Number.isInteger(value), {
      message: "السعر يجب أن يكون رقم صحيح"
    }),
  bedrooms: z.coerce.number()
    .min(1, "يجب أن تحتوي العقار على غرفة نوم واحدة على الأقل")
    .max(20, "عدد غرف النوم لا يجب أن يتجاوز 20")
    .refine(value => Number.isInteger(value), {
      message: "عدد غرف النوم يجب أن يكون رقم صحيح"
    }),
  bathrooms: z.coerce.number()
    .min(1, "يجب أن يحتوي العقار على حمام واحد على الأقل")
    .max(20, "عدد الحمامات لا يجب أن يتجاوز 20")
    .refine(value => Number.isInteger(value), {
      message: "عدد الحمامات يجب أن يكون رقم صحيح"
    }),
  maxGuests: z.coerce.number()
    .min(1, "يجب أن يستوعب العقار ضيف واحد على الأقل")
    .max(50, "عدد الضيوف لا يجب أن يتجاوز 50")
    .refine(value => Number.isInteger(value), {
      message: "عدد الضيوف يجب أن يكون رقم صحيح"
    }),
  images: z.array(z.string().url("يجب أن يكون رابط صورة صالح"))
    .min(1, "يرجى إضافة صورة واحدة على الأقل")
    .max(10, "لا يمكن إضافة أكثر من 10 صور"),
  amenities: z.array(z.string())
    .min(1, "يرجى اختيار ميزة واحدة على الأقل")
    .max(10, "لا يمكن اختيار أكثر من 10 ميزات"),
});

type FormValues = z.infer<typeof listPropertySchema>;

const amenitiesOptions = [
  "شاطئ",
  "مسبح خاص",
  "مسبح مشترك",
  "واي فاي",
  "تكييف",
  "إطلالة على البحر",
  "شواية",
  "حديقة",
  "موقف سيارات",
];

export default function ListProperty() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

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

  const createPropertyMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/properties", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إضافة العقار بنجاح!",
        description: "سيتم مراجعة العقار ونشره قريباً",
      });
      form.reset();
      setImageUrls([]);
      setNewImageUrl("");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "فشل في إضافة العقار",
        description: error instanceof Error ? error.message : "الرجاء المحاولة مرة أخرى لاحقاً",
        variant: "destructive",
      });
    },
  });

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return contentType?.startsWith('image/') ?? false;
    } catch {
      return false;
    }
  };

  const handleAddImage = async () => {
    if (!newImageUrl) return;
    
    // Show loading state
    toast({
      title: "جاري التحقق من الصورة...",
      description: "يرجى الانتظار",
    });

    // Validate image URL
    const isValid = await validateImageUrl(newImageUrl);
    if (!isValid) {
      toast({
        title: "خطأ في إضافة الصورة",
        description: "يرجى التأكد من أن الرابط يشير إلى صورة صالحة",
        variant: "destructive",
      });
      return;
    }

    // Check max images limit
    if (imageUrls.length >= 10) {
      toast({
        title: "تم الوصول للحد الأقصى",
        description: "لا يمكن إضافة أكثر من 10 صور",
        variant: "destructive",
      });
      return;
    }

    const updatedImages = [...imageUrls, newImageUrl];
    setImageUrls(updatedImages);
    form.setValue("images", updatedImages);
    setNewImageUrl("");
    
    toast({
      title: "تم إضافة الصورة بنجاح",
      description: `تم إضافة ${updatedImages.length} من 10 صور`,
    });
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
        <title>إضافة عقار جديد | Stay Chill</title>
        <meta name="description" content="أضف عقارك في الساحل أو رأس الحكمة مع Stay Chill وابدأ في تحقيق الدخل من منزلك لقضاء العطلات." />
      </Helmet>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-right">تفاصيل العقار</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>عنوان العقار*</FormLabel>
                            <FormControl>
                              <Input placeholder="مثال: فيلا فاخرة على شاطئ البحر" {...field} />
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
                            <FormLabel>المنطقة*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر المنطقة" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sahel">الساحل</SelectItem>
                                <SelectItem value="Ras El Hekma">رأس الحكمة</SelectItem>
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
                            <FormLabel>الموقع المحدد*</FormLabel>
                            <FormControl>
                              <Input placeholder="مثال: الساحل الشمالي، مارينا" {...field} />
                            </FormControl>
                            <FormDescription>
                              أدخل الحي أو المعلم المحدد
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
                            <FormLabel>السعر لليلة الواحدة (دولار أمريكي)*</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" placeholder="مثال: 150" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>وصف العقار*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="صف عقارك بالتفصيل..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            تضمن تفاصيل حول العقار، والمناطق المحيطة، والميزات الفريدة
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Home className="mr-2 h-5 w-5 text-ocean-500" />
                        مواصفات العقار
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="bedrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>غرف النوم*</FormLabel>
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
                              <FormLabel>الحمامات*</FormLabel>
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
                              <FormLabel>الحد الأقصى للضيوف*</FormLabel>
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
                        <Upload className="mr-2 h-5 w-5 text-ocean-500" />
                        صور العقار
                      </h3>

                      <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>أضف الصور*</FormLabel>
                            <FormDescription className="mb-2">
                              أضف صورًا عالية الجودة لعقارك (الواجهة الخارجية، والداخلية، والمشاهد)
                            </FormDescription>

                            <div className="flex flex-col space-y-3">
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input
                                    placeholder="أدخل رابط الصورة"
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
                                  <PlusCircle className="h-4 w-4 mr-1" /> إضافة
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
                                  لم يتم إضافة صور بعد
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
                        <Home className="mr-2 h-5 w-5 text-ocean-500" />
                        خيارات إضافية
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
                                <FormLabel>وضع علامة على العقار بأنه جديد</FormLabel>
                                <FormDescription>
                                  سيضيف هذا علامة "جديد" إلى قائمة عقارك
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>


                    <CardFooter className="flex justify-between pb-0">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/")}
                      >
                        إلغاء
                      </Button>
                      <Button
                        type="submit"
                        className="bg-coral-500 hover:bg-coral-600"
                        disabled={createPropertyMutation.isPending}
                      >
                        {createPropertyMutation.isPending ? "جاري الإرسال..." : "إضافة العقار"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

// Component content ends here