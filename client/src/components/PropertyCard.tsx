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
  const { t } = useTranslation(currentLanguage.code);
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
      className={`group flex flex-col bg-white dark:bg-gray-900 overflow-hidden transition-all duration-500 ${animationClass}`}
    >
      <div className="relative">
        {/* Image container with aspect ratio */}
        <div className="relative aspect-[1/1] sm:aspect-[4/3] overflow-hidden rounded-xl">
          {/* Skeleton loader */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className={`${imageLoaded ? 'hidden' : 'block animate-pulse'}`}>
              <MapPin className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
          </div>
          
          {isVisible && (
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
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
                className="bg-rose-500 text-white hover:bg-rose-600"
                variant="secondary"
              >
                {currentLanguage.code === 'ar' ? 'مميز' : 'Superhost'}
              </Badge>
            )}
            {isNew && (
              <Badge 
                variant="secondary"
                className="bg-black/75 text-white hover:bg-black/80"
              >
                {currentLanguage.code === 'ar' ? 'جديد' : 'New'}
              </Badge>
            )}
          </div>
          
          {/* Favorite button */}
          <button 
            className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-6 w-6 drop-shadow-xl transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'fill-white/80 text-white/80 stroke-gray-600/50'
              }`}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>
      
      <div className="pt-3">
        <div className="flex justify-between">
          <div className="flex-1">
            {/* Location and Title combined */}
            <h3 className="font-medium line-clamp-1 text-gray-900 dark:text-gray-100">
              {property.location}
            </h3>
          </div>

          {/* Rating */}
          {showRating && property.reviewCount && property.reviewCount > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-current text-rose-500 mr-1" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 mt-1">
          {property.title}
        </p>
        
        {/* Features in simplified form */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-1">
          {property.bedrooms} {property.bedrooms > 1 ? 'beds' : 'bed'} • {property.bathrooms} {property.bathrooms > 1 ? 'baths' : 'bath'} • {property.maxGuests} {property.maxGuests > 1 ? 'guests' : 'guest'}
        </p>
        
        {/* Price */}
        <div className="mt-2">
          <span className="font-bold text-gray-900 dark:text-gray-100">${property.price}</span>
          <span className="text-gray-700 dark:text-gray-300"> {t('perNight')}</span>
        </div>
        
        {/* No visible button - the entire card is clickable */}
        <Link href={`/property/${property.id}`} className="absolute inset-0 z-10" aria-label={`View details of ${property.title}`}>
          <span className="sr-only">{t('viewDetails')}</span>
        </Link>
      </div>
    </div>
  );
}
