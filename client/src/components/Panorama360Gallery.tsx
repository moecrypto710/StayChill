import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Globe, Eye, Box, Compass } from 'lucide-react';
import VirtualTour from './VirtualTour';
import { Panorama } from '../lib/types';

interface Panorama360GalleryProps {
  propertyTitle: string;
  panoramas: Panorama[];
}

export default function Panorama360Gallery({ propertyTitle, panoramas }: Panorama360GalleryProps) {
  const [activePanorama, setActivePanorama] = useState<Panorama | null>(null);
  
  if (panoramas.length === 0) {
    return null;
  }

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
        <p className="text-sm text-gray-600 mb-4">
          Explore this property in immersive 360° views. Click on any panorama to start the virtual tour.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {panoramas.map((panorama) => (
            <div 
              key={panorama.id}
              className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setActivePanorama(panorama)}
            >
              <img 
                src={panorama.thumbnail} 
                alt={panorama.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
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
        
        <Button 
          variant="default" 
          className="mt-4 w-full"
          onClick={() => setActivePanorama(panoramas[0])}
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