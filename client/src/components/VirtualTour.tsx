import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { X, RotateCcw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
// Import pannellum from the window object (it's loaded via script)
declare global {
  interface Window {
    pannellum: any;
  }
}

interface VirtualTourProps {
  panoramaUrl: string;
  propertyTitle: string;
  onClose: () => void;
}

export default function VirtualTour({ panoramaUrl, propertyTitle, onClose }: VirtualTourProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tourRef = useRef<HTMLDivElement>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);

  // Initialize pannellum viewer
  useEffect(() => {
    if (!viewerContainerRef.current || viewer) return;
    
    // Load pannellum CSS
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(linkEl);

    // Load pannellum script if not already loaded
    if (!window.pannellum) {
      const scriptEl = document.createElement('script');
      scriptEl.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      scriptEl.onload = initViewer;
      document.body.appendChild(scriptEl);
    } else {
      initViewer();
    }

    function initViewer() {
      if (!viewerContainerRef.current) return;
      
      const newViewer = window.pannellum.viewer(viewerContainerRef.current, {
        type: 'equirectangular',
        panorama: panoramaUrl,
        autoLoad: true,
        showControls: false,
        mouseZoom: true,
        hfov: 100,
        compass: false,
        hotSpots: []
      });
      
      setViewer(newViewer);
    }

    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [panoramaUrl, viewer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const toggleFullscreen = () => {
    if (!tourRef.current) return;
    
    if (!isFullscreen) {
      if (tourRef.current.requestFullscreen) {
        tourRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const resetView = () => {
    if (viewer) {
      viewer.setPitch(0);
      viewer.setYaw(0);
      viewer.setHfov(100);
    }
  };

  const zoomIn = () => {
    if (viewer) {
      const currentHfov = viewer.getHfov();
      viewer.setHfov(currentHfov - 10);
    }
  };

  const zoomOut = () => {
    if (viewer) {
      const currentHfov = viewer.getHfov();
      viewer.setHfov(currentHfov + 10);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div 
        ref={tourRef} 
        className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden shadow-2xl"
      >
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={resetView}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={zoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={zoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black/50 py-2 px-4 rounded-lg text-white">
            <p className="text-sm font-medium">{propertyTitle} - Virtual Tour</p>
          </div>
        </div>
        
        {/* Pannellum container */}
        <div 
          ref={viewerContainerRef} 
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        ></div>
      </div>
    </div>
  );
}