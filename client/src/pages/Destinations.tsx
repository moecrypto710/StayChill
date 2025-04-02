import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllLocations, LocationData } from '@shared/locationData';

export default function Destinations() {
  const { t, language, isRtl } = useTranslation();
  const [destinations, setDestinations] = useState<LocationData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load all destinations
  useEffect(() => {
    setIsLoading(true);
    const allDestinations = getAllLocations();
    setDestinations(allDestinations);
    setIsLoading(false);
  }, []);

  // Filter destinations based on search query
  const filteredDestinations = destinations.filter(dest => {
    const query = searchQuery.toLowerCase();
    const nameEn = dest.nameEn.toLowerCase();
    const nameAr = dest.nameAr.toLowerCase();
    const regionEn = dest.regionEn.toLowerCase();
    const regionAr = dest.regionAr.toLowerCase();
    
    return nameEn.includes(query) || 
           nameAr.includes(query) || 
           regionEn.includes(query) || 
           regionAr.includes(query);
  });

  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">{t('destinations')}</h1>
        <p className="text-muted-foreground mb-8">{t('exploreDestinations')}</p>
        
        <div className="mb-8">
          <Skeleton className="h-12 w-full md:w-1/3 rounded-md" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{t('destinations')}</h1>
      <p className="text-muted-foreground mb-8">{t('exploreDestinations')}</p>
      
      {/* Search input */}
      <div className="mb-8">
        <Input
          type="text"
          placeholder={t('searchDestinations')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {/* Destinations grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => {
            const name = language === 'ar' ? destination.nameAr : destination.nameEn;
            const region = language === 'ar' ? destination.regionAr : destination.regionEn;
            const description = language === 'ar' 
              ? destination.descriptionAr.substring(0, 120) + '...' 
              : destination.descriptionEn.substring(0, 120) + '...';
            
            // Get the best visiting seasons
            const bestSeasons = language === 'ar' 
              ? destination.bestTimeToVisit.seasonsAr 
              : destination.bestTimeToVisit.seasonsEn;
            
            // Use the first image as the cover, or a placeholder
            const coverImage = destination.images.length > 0 
              ? destination.images[0] 
              : '/images/placeholder-destination.jpg';
            
            return (
              <Card key={destination.id} className="overflow-hidden h-full flex flex-col">
                <div className="aspect-video relative">
                  <img 
                    src={coverImage} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-1">{name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {region}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-xs">
                      {destination.neighborhoods.length} {t('areas')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-4">
                    {description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {t('bestTimeToVisit')}: {bestSeasons.join(', ')}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className={`pt-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Button asChild className="w-full">
                    <Link href={`/destinations/${destination.id}`}>
                      <a className="flex items-center justify-center">
                        {t('exploreDestination')}
                        <ArrowRight className={`h-4 w-4 ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </a>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('noDestinationsFound')}</p>
          <Button 
            variant="outline" 
            onClick={() => setSearchQuery('')} 
            className="mt-4"
          >
            {t('clearSearch')}
          </Button>
        </div>
      )}
    </div>
  );
}