import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Heart, MapPin, Star, Bed, Bath, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property } from "@shared/schema";
import { useLanguage } from './LanguageSwitcher';
import { useTranslation } from "@/lib/translations";

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
  isNew?: boolean;
  showRating?: boolean;
}

export default function PropertyCard({ 
  property, 
  featured = false, 
  isNew = false, 
  showRating = true
}: PropertyCardProps) {
  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage.code);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading and animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Calculate star rating display
  const rating = (property.rating ?? 0) / 10; // Convert from 0-50 scale to 0-5 scale
  
  // Animation classes
  const animationClass = isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8';
  
  return (
    <div 
      ref={cardRef}
      className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-slate-700 card-hover transition-all duration-500 ${animationClass}`}
    >
      <div className="relative">
        {/* Image container with fixed aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Skeleton loader */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
            <div className={`${imageLoaded ? 'hidden' : 'block animate-pulse'}`}>
              <MapPin className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
          
          {isVisible && (
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className={`w-full h-full object-cover transition-all duration-500 hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          )}
          
          {/* Badge positioning */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {featured && (
              <Badge 
                className="bg-primary text-white hover:bg-primary/90"
                variant="secondary"
              >
                {currentLanguage.code === 'ar' ? 'مميز' : 'Featured'}
              </Badge>
            )}
            {isNew && (
              <Badge 
                variant="secondary"
                className="bg-amber-500 text-white hover:bg-amber-600"
              >
                {currentLanguage.code === 'ar' ? 'جديد' : 'New'}
              </Badge>
            )}
          </div>
          
          {/* Favorite button */}
          <button 
            className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-5">
        {/* Location */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
          <MapPin className="mr-1 rtl-mr h-3 w-3 text-primary/70" />
          <span className="truncate">{property.location}</span>
        </div>
        
        {/* Title & Price */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-3">
          <h3 className="text-lg font-bold leading-tight line-clamp-2 flex-1 text-foreground">
            {property.title}
          </h3>
          <div className="whitespace-nowrap">
            <span className="text-lg font-bold text-primary">${property.price}</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">/{t('perNight')}</span>
          </div>
        </div>
        
        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-gray-500 dark:text-gray-400 rtl-mr" />
            <span>{property.bedrooms} {t('bedrooms')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-gray-500 dark:text-gray-400 rtl-mr" />
            <span>{property.bathrooms} {t('bathrooms')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400 rtl-mr" />
            <span>{property.maxGuests} {t('guests')}</span>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge 
              variant="outline" 
              className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              +{property.amenities.length - 3} {currentLanguage.code === 'ar' ? 'المزيد' : 'more'}
            </Badge>
          )}
        </div>
        
        {/* Rating */}
        {showRating && property.reviewCount && property.reviewCount > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-amber-400' : i < Math.ceil(rating) ? 'fill-amber-400/50' : ''}`}
                />
              ))}
            </div>
            <span className="ml-2 rtl-ml text-sm text-gray-600 dark:text-gray-400">
              {rating.toFixed(1)} ({property.reviewCount} {currentLanguage.code === 'ar' ? 'تقييم' : 'reviews'})
            </span>
          </div>
        )}
        
        {/* Action button */}
        <div className="mt-3">
          <Link href={`/property/${property.id}`} className="block">
            <Button className="w-full rounded-full group btn-primary">
              {t('viewDetails')}
              <ArrowRight className="ml-2 rtl-mr h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
