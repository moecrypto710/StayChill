import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/translations';

interface PropertyCardProps {
  property: any;
  minimalView?: boolean;
}

export default function PropertyCard({ property, minimalView = false }: PropertyCardProps) {
  const { t } = useTranslation();
  
  // If property doesn't have required fields, return null
  if (!property || !property.images || !property.images.length) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden ${minimalView ? '' : 'h-full'}`}>
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {!minimalView && (
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
              <p className="text-muted-foreground text-sm mb-2">{property.location}</p>
            </div>
            <Badge variant="outline" className="text-xs font-medium">
              {property.rating} ★
            </Badge>
          </div>
          
          <div className="flex gap-2 mt-2">
            <div className="text-sm">
              <span className="font-medium">{property.bedrooms}</span> {t('bedrooms')}
            </div>
            <div className="text-sm">
              <span className="font-medium">{property.bathrooms}</span> {t('bathrooms')}
            </div>
            <div className="text-sm">
              <span className="font-medium">{property.maxGuests}</span> {t('guests')}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="font-bold text-lg">${property.price}</span>
              <span className="text-muted-foreground text-sm"> {t('perNight')}</span>
            </div>
          </div>
        </CardContent>
      )}
    </div>
  );
}