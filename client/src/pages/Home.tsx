import { Helmet } from "react-helmet";
import { useLanguage } from "../components/LanguageSwitcher";
import { useTranslation } from "../lib/translations";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  MapPin, 
  Calendar, 
  Compass, 
  Palmtree, 
  Umbrella, 
  Waves, 
  Sun, 
  ArrowRight, 
  Camera, 
  Heart, 
  ChevronRight 
} from "lucide-react";
import { Property } from "@shared/schema";
import { useState, useEffect } from "react";

// New home page that focuses on rich destination content
export default function Home() {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);
  const [_, setLocation] = useLocation();
  const isRTL = currentLanguage.direction === 'rtl';
  const [activeDestination, setActiveDestination] = useState<string>("ras-el-hekma");
  
  // Fetch featured properties
  const { data: featuredProperties } = useQuery<Property[]>({
    queryKey: ['/api/properties/featured'],
  });
  
  // Destination data
  const destinations = {
    "ras-el-hekma": {
      title: currentLanguage.code === 'ar' ? 'رأس الحكمة' : 'Ras El Hekma',
      description: currentLanguage.code === 'ar' 
        ? 'تمتع بجمال الشواطئ البكر، والمياه الفيروزية، والرمال البيضاء في واحدة من أجمل وجهات الساحل الشمالي.'
        : 'Experience pristine beaches, turquoise waters, and white sand in one of North Coast\'s most beautiful destinations.',
      image: 'https://images.unsplash.com/photo-1535049883634-993346531df0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      highlights: [
        { 
          icon: <Umbrella className="h-5 w-5" />,
          title: currentLanguage.code === 'ar' ? 'شواطئ نقية' : 'Pristine Beaches', 
          desc: currentLanguage.code === 'ar' ? 'شواطئ بكر لم تمسها يد الإنسان' : 'Untouched, crystal-clear waters'
        },
        { 
          icon: <Sun className="h-5 w-5" />,
          title: currentLanguage.code === 'ar' ? 'طقس مثالي' : 'Perfect Weather', 
          desc: currentLanguage.code === 'ar' ? 'استمتع بأشعة الشمس على مدار العام' : 'Enjoy sunshine all year round'
        },
        { 
          icon: <Compass className="h-5 w-5" />,
          title: currentLanguage.code === 'ar' ? 'مناطق بكر' : 'Untouched Areas', 
          desc: currentLanguage.code === 'ar' ? 'اكتشف الأماكن الطبيعية الخلابة' : 'Discover natural pristine locations'
        },
      ],
    },
    "sahel": {
      title: currentLanguage.code === 'ar' ? 'الساحل الشمالي' : 'North Coast (Sahel)',
      description: currentLanguage.code === 'ar'
        ? 'الوجهة الصيفية المفضلة للمصريين، مع شواطئ جميلة وحياة ليلية نابضة بالحياة ومجموعة متنوعة من الأنشطة.'
        : 'Egyptians\' favorite summer destination, with beautiful beaches, vibrant nightlife and a variety of activities.',
      image: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
      highlights: [
        { 
          icon: <Waves className="h-5 w-5" />,
          title: currentLanguage.code === 'ar' ? 'شواطئ خلابة' : 'Stunning Coastline', 
          desc: currentLanguage.code === 'ar' ? 'كيلومترات من الشواطئ الجميلة' : 'Kilometers of beautiful beaches'
        },
        { 
          icon: <Palmtree className="h-5 w-5" />,
          title: currentLanguage.code === 'ar' ? 'منتجعات فاخرة' : 'Luxury Resorts', 
          desc: currentLanguage.code === 'ar' ? 'أفخم المنتجعات والفلل البحرية' : 'Top-tier resorts and beach houses'
        },
        { 
          icon: <Camera className="h-5 w-5" />,
          title: currentLanguage.code === 'ar' ? 'مناظر خلابة' : 'Scenic Views', 
          desc: currentLanguage.code === 'ar' ? 'استمتع بأجمل غروب الشمس' : 'Enjoy the most amazing sunsets'
        },
      ],
    },
  };
  
  // Current active destination
  const currentDestination = destinations[activeDestination as keyof typeof destinations];
  
  // Seasons to visit
  const bestTimeToVisit = [
    { month: currentLanguage.code === 'ar' ? 'مايو' : 'May', suitable: true },
    { month: currentLanguage.code === 'ar' ? 'يونيو' : 'June', suitable: true },
    { month: currentLanguage.code === 'ar' ? 'يوليو' : 'July', suitable: true },
    { month: currentLanguage.code === 'ar' ? 'أغسطس' : 'August', suitable: true },
    { month: currentLanguage.code === 'ar' ? 'سبتمبر' : 'September', suitable: true },
    { month: currentLanguage.code === 'ar' ? 'أكتوبر' : 'October', suitable: false },
    { month: currentLanguage.code === 'ar' ? 'نوفمبر' : 'November', suitable: false },
    { month: currentLanguage.code === 'ar' ? 'ديسمبر' : 'December', suitable: false },
    { month: currentLanguage.code === 'ar' ? 'يناير' : 'January', suitable: false },
    { month: currentLanguage.code === 'ar' ? 'فبراير' : 'February', suitable: false },
    { month: currentLanguage.code === 'ar' ? 'مارس' : 'March', suitable: false },
    { month: currentLanguage.code === 'ar' ? 'أبريل' : 'April', suitable: true },
  ];
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>
          {currentLanguage.code === 'ar' 
            ? 'استرخي واستمتع | شاليهات وفيلات فاخرة في الساحل ورأس الحكمة'
            : 'Stay Chill - Premium Sahel & Ras El Hekma Rentals'
          }
        </title>
        <meta 
          name="description" 
          content={
            currentLanguage.code === 'ar'
              ? 'اعثر على مكان إقامتك المثالي في الساحل ورأس الحكمة. فيلات على البحر مباشرة، شاليهات، وشقق فاخرة مع مرافق متميزة.'
              : 'Find your perfect beachside getaway in Sahel and Ras El Hekma, Egypt. Premium vacation rentals with amazing amenities and locations.'
          } 
        />
      </Helmet>
      
      {/* Hero Video Banner */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="Mediterranean Beach"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center text-white text-center p-4">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {currentLanguage.code === 'ar' 
                ? 'الوجهة المثالية لعطلتك الشاطئية في مصر'
                : 'Your Perfect Beach Getaway in Egypt'
              }
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {currentLanguage.code === 'ar'
                ? 'اكتشف أجمل الشواطئ والإقامات الفاخرة في رأس الحكمة والساحل الشمالي'
                : 'Discover the most beautiful beaches and luxury stays in Ras El Hekma and North Coast'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-full font-semibold px-8 text-lg"
                onClick={() => setLocation('/properties')}
              >
                {currentLanguage.code === 'ar' ? 'استكشف العقارات' : 'Explore Properties'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full font-semibold px-8 text-lg bg-white/20 border-white hover:bg-white/30"
                onClick={() => {
                  const element = document.getElementById('destinations');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {currentLanguage.code === 'ar' ? 'اكتشف الوجهات' : 'Discover Destinations'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Destinations */}
      <section id="destinations" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">
                {currentLanguage.code === 'ar' ? 'استكشف وجهاتنا المميزة' : 'Explore Our Featured Destinations'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
                {currentLanguage.code === 'ar' 
                  ? 'اكتشف أجمل الوجهات الساحلية في مصر والتي توفر تجارب إقامة لا تُنسى على طول البحر الأبيض المتوسط'
                  : 'Discover Egypt\'s most beautiful coastal destinations offering unforgettable stays along the Mediterranean coast'
                }
              </p>
            </div>
            
            {/* Destination Selector */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button
                variant={activeDestination === 'ras-el-hekma' ? 'default' : 'outline'}
                className="rounded-full px-6"
                onClick={() => setActiveDestination('ras-el-hekma')}
              >
                {currentLanguage.code === 'ar' ? 'رأس الحكمة' : 'Ras El Hekma'}
              </Button>
              <Button
                variant={activeDestination === 'sahel' ? 'default' : 'outline'}
                className="rounded-full px-6"
                onClick={() => setActiveDestination('sahel')}
              >
                {currentLanguage.code === 'ar' ? 'الساحل الشمالي' : 'North Coast (Sahel)'}
              </Button>
            </div>
            
            {/* Destination Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="relative rounded-xl overflow-hidden h-96">
                  <img 
                    src={currentDestination.image}
                    alt={currentDestination.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div>
                      <Badge className="mb-2">{currentLanguage.code === 'ar' ? 'وجهة مميزة' : 'Featured'}</Badge>
                      <h3 className="text-white text-2xl font-bold">{currentDestination.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4">{currentDestination.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {currentDestination.description}
                </p>
                
                <div className="space-y-4 mb-6">
                  {currentDestination.highlights.map((highlight, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {highlight.icon}
                      </div>
                      <div className="ms-4">
                        <h4 className="font-semibold">{highlight.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {highlight.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => setLocation(`/properties?location=${currentDestination.title}`)}
                  className="rounded-full px-6 gap-2"
                >
                  {currentLanguage.code === 'ar' ? 'عرض العقارات' : 'View Properties'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Best Time to Visit */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">
                {currentLanguage.code === 'ar' ? 'أفضل وقت للزيارة' : 'Best Time to Visit'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
                {currentLanguage.code === 'ar' 
                  ? 'تعرف على أفضل الأوقات لزيارة رأس الحكمة والساحل الشمالي للاستمتاع بأفضل الطقس والتجارب'
                  : 'Learn about the best times to visit Ras El Hekma and North Coast for optimal weather and experiences'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {bestTimeToVisit.map((month, index) => (
                <div 
                  key={index}
                  className={`rounded-lg p-4 text-center ${
                    month.suitable 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <Calendar className={`h-5 w-5 mx-auto mb-2 ${month.suitable ? 'text-primary' : 'text-gray-400'}`} />
                  <p className="font-medium">{month.month}</p>
                  <p className="text-xs mt-1">
                    {month.suitable 
                      ? (currentLanguage.code === 'ar' ? 'مناسب' : 'Good')
                      : (currentLanguage.code === 'ar' ? 'غير مناسب' : 'Not ideal')
                    }
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">
                  {currentLanguage.code === 'ar' ? 'عقارات مميزة' : 'Featured Properties'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {currentLanguage.code === 'ar' 
                    ? 'اكتشف أفضل العقارات في رأس الحكمة والساحل الشمالي'
                    : 'Discover our best properties in Ras El Hekma and North Coast'
                  }
                </p>
              </div>
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={() => setLocation('/properties')}
              >
                {currentLanguage.code === 'ar' ? 'عرض الكل' : 'View All'}
                <ArrowRight className="h-4 w-4 ms-2" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties?.slice(0, 3).map((property) => (
                <Card key={property.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-300">
                  <div 
                    className="relative h-56 overflow-hidden"
                    onClick={() => setLocation(`/property/${property.id}`)}
                  >
                    <img
                      src={property.images[0] || 'https://placehold.co/600x400?text=No+Image'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors duration-200">
                      <Heart className="h-4 w-4 text-red-500" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-primary hover:bg-primary">${property.price}/night</Badge>
                        <div className="flex items-center text-white">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div onClick={() => setLocation(`/property/${property.id}`)}>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div>{property.bedrooms} {currentLanguage.code === 'ar' ? 'غرف نوم' : 'Bedrooms'}</div>
                        <div>{property.bathrooms} {currentLanguage.code === 'ar' ? 'حمامات' : 'Bathrooms'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {currentLanguage.code === 'ar' 
                ? 'جاهز لحجز إقامتك المثالية على الشاطئ؟'
                : 'Ready to Book Your Perfect Beach Stay?'
              }
            </h2>
            <p className="mb-8 text-white/80 text-lg">
              {currentLanguage.code === 'ar'
                ? 'احجز الآن واستمتع بعطلة لا تُنسى على شواطئ مصر الخلابة. أفضل العقارات والخدمات بأسعار تنافسية.'
                : 'Book now and enjoy an unforgettable vacation on Egypt\'s stunning beaches. Best properties and services at competitive prices.'
              }
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="rounded-full font-semibold px-8 text-lg"
              onClick={() => setLocation('/properties')}
            >
              {currentLanguage.code === 'ar' ? 'استكشف العقارات الآن' : 'Explore Properties Now'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
