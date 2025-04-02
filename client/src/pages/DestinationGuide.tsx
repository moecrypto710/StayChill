import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { ChevronRight, MapPin, Calendar, Thermometer, Info, Navigation, Map, Compass, Star, LucideIcon } from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getLocationById, LocationData, LocationNeighborhood, LocalTip } from '@shared/locationData';

// Default placeholder images in case actual images aren't available
const DEFAULT_IMAGES = [
  '/images/placeholder-beach.jpg',
  '/images/placeholder-resort.jpg',
  '/images/placeholder-activity.jpg'
];

// Mapping for icons based on icon names in the data
const ICON_MAP: Record<string, LucideIcon> = {
  Beach: MapPin,
  Hotel: MapPin,
  Music: MapPin,
  Waves: MapPin,
  Sun: MapPin,
  Sailboat: MapPin,
  Cocktail: MapPin,
  Fish: MapPin,
  ShoppingBag: MapPin,
  Building: MapPin,
  Mountain: MapPin,
  Swimmer: MapPin,
  Dive: MapPin,
  Utensils: MapPin,
  Sunset: MapPin,
};

export default function DestinationGuide() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t, language, isRtl } = useTranslation();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Load location data
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const data = getLocationById(id);
      if (data) {
        setLocationData(data);
      } else {
        // Redirect to destinations list if ID not found
        setLocation('/destinations');
      }
      setIsLoading(false);
    }
  }, [id, setLocation]);

  // Handle loading state
  if (isLoading || !locationData) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Get the appropriate name and description based on language
  const locationName = language === 'ar' ? locationData.nameAr : locationData.nameEn;
  const locationDescription = language === 'ar' ? locationData.descriptionAr : locationData.descriptionEn;
  const regionName = language === 'ar' ? locationData.regionAr : locationData.regionEn;

  // Images with fallbacks
  const locationImages = locationData.images.length > 0 
    ? locationData.images 
    : DEFAULT_IMAGES;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/destinations">
          <a className="hover:text-primary transition-colors">
            {t('destinations')}
          </a>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-foreground">{locationName}</span>
      </div>

      {/* Hero section with main image */}
      <div className="relative w-full h-[40vh] rounded-lg overflow-hidden mb-8">
        <img 
          src={locationImages[0]} 
          alt={locationName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6">
          <Badge className="mb-2 bg-primary/90">{regionName}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{locationName}</h1>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="neighborhoods">{t('neighborhoods')}</TabsTrigger>
          <TabsTrigger value="activities">{t('activities')}</TabsTrigger>
          <TabsTrigger value="tips">{t('tips')}</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('about')} {locationName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line mb-6">
                    {locationDescription}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-4">{t('highlights')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {locationData.highlights.map((highlight, index) => {
                      const IconComponent = ICON_MAP[highlight.iconName || ''] || Info;
                      const title = language === 'ar' ? highlight.titleAr : highlight.titleEn;
                      const description = language === 'ar' ? highlight.descriptionAr : highlight.descriptionEn;
                      
                      return (
                        <div key={index} className="flex items-start">
                          <div className="mr-3 mt-1 bg-primary/10 p-2 rounded-full">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{title}</h4>
                            <p className="text-sm text-muted-foreground">{description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Image gallery */}
                  <h3 className="text-lg font-semibold mb-4">{t('photos')}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {locationImages.slice(1).map((image, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${locationName} - ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar with practical information */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{t('practicalInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Best time to visit */}
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">{t('bestTimeToVisit')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' 
                          ? locationData.bestTimeToVisit.seasonsAr.join(', ')
                          : locationData.bestTimeToVisit.seasonsEn.join(', ')}
                      </p>
                      {(locationData.bestTimeToVisit.notesEn || locationData.bestTimeToVisit.notesAr) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === 'ar' 
                            ? locationData.bestTimeToVisit.notesAr 
                            : locationData.bestTimeToVisit.notesEn}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Weather information */}
                  <div className="flex items-start">
                    <Thermometer className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">{t('weather')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('summer')}: {locationData.weather.summerTempRange}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('winter')}: {locationData.weather.winterTempRange}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'ar' 
                          ? locationData.weather.rainfallAr 
                          : locationData.weather.rainfallEn}
                      </p>
                    </div>
                  </div>
                  
                  {/* Getting there information */}
                  <div className="flex items-start">
                    <Navigation className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">{t('gettingThere')}</h4>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{t('fromCairo')}: </span>
                        {language === 'ar' 
                          ? locationData.gettingThere.fromCairoAr 
                          : locationData.gettingThere.fromCairoEn}
                      </p>
                      {(locationData.gettingThere.fromAlexEn || locationData.gettingThere.fromAlexAr) && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">{t('fromAlex')}: </span>
                          {language === 'ar' 
                            ? locationData.gettingThere.fromAlexAr 
                            : locationData.gettingThere.fromAlexEn}
                        </p>
                      )}
                      {(locationData.gettingThere.nearestAirportEn || locationData.gettingThere.nearestAirportAr) && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">{t('nearestAirport')}: </span>
                          {language === 'ar' 
                            ? locationData.gettingThere.nearestAirportAr 
                            : locationData.gettingThere.nearestAirportEn}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Map information */}
                  <div className="flex items-start">
                    <Map className="h-5 w-5 mr-3 text-primary" />
                    <div>
                      <h4 className="font-medium">{t('location')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('latitude')}: {locationData.mapLocation.latitude}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('longitude')}: {locationData.mapLocation.longitude}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <a 
                      href={`https://maps.google.com/?q=${locationData.mapLocation.latitude},${locationData.mapLocation.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {t('viewOnMap')}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* CTA for properties */}
              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle>{t('findAccommodation')}</CardTitle>
                  <CardDescription className="text-primary-foreground/90">
                    {t('explorePropertiesIn').replace('{location}', locationName)}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="secondary" 
                    className="w-full" 
                    asChild
                  >
                    <Link href={`/properties?location=${id}`}>
                      <a>{t('viewProperties')}</a>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Neighborhoods tab */}
        <TabsContent value="neighborhoods">
          <Card>
            <CardHeader>
              <CardTitle>{t('neighborhoodsIn').replace('{location}', locationName)}</CardTitle>
              <CardDescription>
                {t('exploreAreasIn').replace('{location}', locationName)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {locationData.neighborhoods.map((neighborhood, index) => {
                  const name = language === 'ar' ? neighborhood.nameAr : neighborhood.nameEn;
                  const description = language === 'ar' ? neighborhood.descriptionAr : neighborhood.descriptionEn;
                  const highlights = language === 'ar' 
                    ? neighborhood.highlightsAr || [] 
                    : neighborhood.highlightsEn || [];
                  
                  return (
                    <div key={index}>
                      {index > 0 && <Separator className="my-6" />}
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{name}</h3>
                        <p className="text-muted-foreground mb-4">{description}</p>
                        
                        {highlights.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">{t('highlights')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {highlights.map((highlight, hIndex) => (
                                <Badge key={hIndex} variant="outline" className="bg-primary/5">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {neighborhood.propertyTypes && neighborhood.propertyTypes.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">{t('popularPropertyTypes')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {neighborhood.propertyTypes.map((type, tIndex) => (
                                <Badge key={tIndex} variant="secondary" className="capitalize">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>{t('thingsToDo')}</CardTitle>
              <CardDescription>
                {t('activitiesIn').replace('{location}', locationName)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locationData.activities.map((activity, index) => {
                  const IconComponent = ICON_MAP[activity.iconName || ''] || Compass;
                  const name = language === 'ar' ? activity.nameAr : activity.nameEn;
                  const description = language === 'ar' 
                    ? activity.descriptionAr || '' 
                    : activity.descriptionEn || '';
                  
                  return (
                    <div key={index} className="flex">
                      <div className="mr-3 mt-1 bg-primary/10 p-2 rounded-full">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{name}</h3>
                        {description && (
                          <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Local Tips tab */}
        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>{t('localTips')}</CardTitle>
              <CardDescription>
                {t('insiderTipsFor').replace('{location}', locationName)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Group tips by category */}
                {(['Food', 'Activities', 'Transportation', 'Culture', 'Safety', 'Budget'] as const).map(category => {
                  const tips = locationData.localTips.filter(tip => tip.categoryEn === category);
                  if (tips.length === 0) return null;
                  
                  const categoryName = language === 'ar' 
                    ? tips[0].categoryAr 
                    : tips[0].categoryEn;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3">{categoryName}</h3>
                      <ul className="space-y-3">
                        {tips.map((tip, index) => (
                          <li key={index} className="flex">
                            <Star className="h-5 w-5 mr-3 text-amber-500 shrink-0" />
                            <p className="text-muted-foreground">
                              {language === 'ar' ? tip.tipAr : tip.tipEn}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}