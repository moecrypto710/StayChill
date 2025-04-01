
import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Globe, Eye, Box, Compass, ArrowLeft, ArrowRight } from 'lucide-react';
import VirtualTour from './VirtualTour';
import { Panorama } from '../lib/types';
import { cn } from '../lib/utils';

interface Panorama360GalleryProps {
  propertyTitle: string;
  panoramas: Panorama[];
}

export default function Panorama360Gallery({ propertyTitle, panoramas }: Panorama360GalleryProps) {
  const [activePanorama, setActivePanorama] = useState<Panorama | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (panoramas.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : panoramas.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < panoramas.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Box className="mr-2 h-5 w-5 text-primary" />
          Virtual Tour
        </h3>
        <Badge variant="outline" className="bg-primary/10">
          360° Experience
        </Badge>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-4 border">
        <p className="text-sm text-gray-600 mb-4 flex items-center">
          <Compass className="h-4 w-4 mr-2 text-primary" />
          Explore this property in immersive 360° views. Click on any panorama to start the virtual tour.
        </p>
        
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {panoramas.map((panorama, index) => (
              <div 
                key={panorama.id}
                className={cn(
                  "aspect-square relative rounded-lg overflow-hidden cursor-pointer group transition-all duration-300",
                  index === activeIndex && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => {
                  setActiveIndex(index);
                  setActivePanorama(panorama);
                }}
              >
                <img 
                  src={panorama.thumbnail} 
                  alt={panorama.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
                  <div className="text-white text-center">
                    <Eye className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs font-medium">{panorama.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {panoramas.length > 4 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-100"
                onClick={handlePrevious}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-100"
                onClick={handleNext}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        <Button 
          variant="default" 
          className="mt-6 w-full"
          onClick={() => setActivePanorama(panoramas[activeIndex])}
        >
          <Globe className="mr-2 h-4 w-4" />
          Start Virtual Tour
        </Button>
      </div>
      
      {activePanorama && (
        <VirtualTour
          panoramaUrl={activePanorama.url}
          propertyTitle={propertyTitle}
          onClose={() => setActivePanorama(null)}
        />
      )}
    </div>
  );
}
