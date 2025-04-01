import { useState } from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import { Property } from "@shared/schema";

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
  showRating = false 
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Calculate star rating display
  const rating = property.rating / 10; // Convert from 0-50 scale to 0-5 scale
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow property-card">
      <div className="relative h-60 overflow-hidden">
        {featured && (
          <span className="absolute top-4 left-4 bg-ocean-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
            Featured
          </span>
        )}
        {isNew && (
          <span className="absolute top-4 left-4 bg-coral-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
            New
          </span>
        )}
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="w-full h-full object-cover property-image"
        />
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={toggleFavorite}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-coral-500 text-coral-500' : 'text-gray-600'}`}
            />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{property.title}</h3>
          <div>
            <span className="text-lg font-bold text-ocean-600">${property.price}</span>
            <span className="text-gray-500">/night</span>
          </div>
        </div>
        <div className="mb-4 flex items-center text-gray-600 text-sm">
          <MapPin className="mr-1 h-4 w-4 text-coral-500" />
          <span>{property.location}</span>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          {property.amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="bg-ocean-50 text-ocean-600 text-xs px-2 py-1 rounded-md">
              {amenity}
            </span>
          ))}
        </div>
        {showRating && property.reviewCount > 0 && (
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400' : i < Math.ceil(rating) ? 'fill-yellow-400/50' : ''}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {rating.toFixed(1)} ({property.reviewCount} reviews)
            </span>
          </div>
        )}
        <div className="border-t pt-4">
          <Link href={`/property/${property.id}`}>
            <Button className="w-full bg-ocean-500 hover:bg-ocean-600 text-white">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
