import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Heart, MapPin, Star, Bed, Bath, Users, View, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property, Panorama } from "@shared/schema";
import { useLanguage } from './LanguageSwitcher';
import { useTranslation } from "@/lib/translations";
import VirtualTour from "./VirtualTour";

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
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isRtl = currentLanguage.direction === 'rtl';

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
  
  // Determine which panorama to show
  const getFirstPanoramaUrl = () => {
    if (!property.panoramas || (property.panoramas as any[]).length === 0) {
      return '';
    }
    return (property.panoramas as any[])[0].url;
  };

  const handleCloseVirtualTour = () => {
    setShowVirtualTour(false);
  };

  // Calculate feature text with proper localization
  const getFeatureText = () => {
    if (currentLanguage.code === 'ar') {
      return `${property.bedrooms} ${property.bedrooms > 1 ? 'غرف نوم' : 'غرفة نوم'} • ${property.bathrooms} ${property.bathrooms > 1 ? 'حمامات' : 'حمام'} • ${property.maxGuests} ${property.maxGuests > 1 ? 'ضيوف' : 'ضيف'}`;
    } else {
      return `${property.bedrooms} ${property.bedrooms > 1 ? 'beds' : 'bed'} • ${property.bathrooms} ${property.bathrooms > 1 ? 'baths' : 'bath'} • ${property.maxGuests} ${property.maxGuests > 1 ? 'guests' : 'guest'}`;
    }
  };

  return (
    <>
      {showVirtualTour && (
        <VirtualTour 
          panoramaUrl={getFirstPanoramaUrl()} 
          propertyTitle={property.title}
          onClose={handleCloseVirtualTour}
        />
      )}
      <div 
        ref={cardRef}
        className={`group flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 ${animationClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          {/* Image container with aspect ratio */}
          <div className="relative aspect-[1/1] sm:aspect-[4/3] overflow-hidden rounded-t-xl">
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
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'scale-110 filter saturate-110' : 'scale-100'} ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            )}
            
            {/* Gradient overlay that appears on hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Badge positioning - adjust for RTL */}
            <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} flex flex-col gap-2 transition-transform duration-300 group-hover:translate-y-1`}>
              {featured && (
                <Badge 
                  className="bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 group-hover:scale-105"
                  variant="secondary"
                >
                  {currentLanguage.code === 'ar' ? 'مميز' : 'Superhost'}
                </Badge>
              )}
              {isNew && (
                <Badge 
                  variant="secondary"
                  className="bg-black/75 text-white hover:bg-black/80 transition-all duration-300 group-hover:scale-105"
                >
                  {currentLanguage.code === 'ar' ? 'جديد' : 'New'}
                </Badge>
              )}
            </div>
            
            {/* Favorite button - adjust for RTL */}
            <button 
              className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} p-2 hover:scale-125 transition-all duration-300 z-20`}
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`h-6 w-6 drop-shadow-xl transition-all duration-300 ${
                  isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'fill-white/80 text-white/80 stroke-gray-600/50 group-hover:fill-white group-hover:text-white'
                }`}
                strokeWidth={1.5}
              />
            </button>
            
            {/* Virtual Tour button - only show if property has panorama */}
            {property.hasPanorama && (
              <button 
                className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'} p-2 bg-black/60 hover:bg-black/80 rounded-full hover:scale-110 transition-all duration-300 z-20 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVirtualTour(true);
                }}
                aria-label="View 360° tour"
              >
                <View 
                  className="h-5 w-5 text-white"
                  strokeWidth={1.5}
                />
              </button>
            )}
            
            {/* View details button that appears on hover */}
            <div 
              className={`absolute bottom-0 inset-x-0 p-4 flex justify-center transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="bg-white/90 dark:bg-gray-800/90 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
                {isRtl ? (
                  <>
                    <span>{t('viewDetails')}</span>
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </>
                ) : (
                  <>
                    <span>{t('viewDetails')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 transition-all duration-300 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50">
          <div className="flex justify-between">
            <div className="flex-1">
              {/* Location */}
              <h3 className="font-medium line-clamp-1 text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                {property.location}
              </h3>
            </div>

            {/* Rating with animation */}
            {showRating && property.reviewCount && property.reviewCount > 0 && (
              <div className="flex items-center transition-transform duration-300 group-hover:scale-110">
                <Star className="h-4 w-4 fill-current text-emerald-500 mr-1 group-hover:text-yellow-500 transition-colors duration-300" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          {/* Description with hover effect */}
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
            {property.title}
          </p>
          
          {/* Features with proper localization */}
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
            {getFeatureText()}
          </p>
          
          {/* Price with animation */}
          <div className="mt-2 transition-all duration-300 group-hover:translate-y-0">
            <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">${property.price}</span>
            <span className="text-gray-700 dark:text-gray-300"> {t('perNight')}</span>
          </div>
          
          {/* No visible button - the entire card is clickable */}
          <Link href={`/property/${property.id}`} className="absolute inset-0 z-10" aria-label={`View details of ${property.title}`}>
            <span className="sr-only">{t('viewDetails')}</span>
          </Link>
        </div>
      </div>
    </>
  );
}