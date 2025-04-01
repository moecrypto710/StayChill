import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { X, RotateCcw, ZoomIn, ZoomOut, Maximize2, Compass } from 'lucide-react';
import { Badge } from './ui/badge';

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
  const [isLoading, setIsLoading] = useState(true);
  const [showCompass, setShowCompass] = useState(true);
  const tourRef = useRef<HTMLDivElement>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);

  useEffect(() => {
    if (!viewerContainerRef.current || viewer) return;

    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(linkEl);

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
        hfov: 100,
        compass: showCompass,
        northOffset: 247.5,
        hotSpotDebug: true,
        keyboardZoom: true,
        mouseZoom: true,
        draggable: true,
        disableKeyboardCtrl: false,
        touchPanSpeedCoeffFactor: 1.5,
        autoRotate: -2,
        autoRotateInactivityDelay: 3000,
        hotSpots: [
          {
            pitch: -2.1,
            yaw: 132.9,
            type: "info",
            text: "Living Room",
            cssClass: "custom-hotspot"
          }
        ],
        onLoad: () => {
          setIsLoading(false);
          // Auto-rotate will stop when user interacts
          viewer?.startAutoRotate();
        }
      });

      setViewer(newViewer);
    }

    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [panoramaUrl, viewer, showCompass]);

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
      viewer.setHfov(Math.max(30, currentHfov - 10));
    }
  };

  const zoomOut = () => {
    if (viewer) {
      const currentHfov = viewer.getHfov();
      viewer.setHfov(Math.min(120, currentHfov + 10));
    }
  };

  const toggleCompass = () => {
    setShowCompass(!showCompass);
    if (viewer) {
      viewer.setCompassVisible(!showCompass);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div 
        ref={tourRef} 
        className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden shadow-2xl"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p>Loading panorama...</p>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={resetView}
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={zoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={zoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className={`bg-black/50 hover:bg-black/70 transition-all ${showCompass ? 'text-primary' : ''}`}
            onClick={toggleCompass}
            title="Toggle Compass"
          >
            <Compass className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="bg-black/50 hover:bg-black/70 transition-all"
            onClick={onClose}
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black/50 py-2 px-4 rounded-lg text-white">
            <p className="text-sm font-medium">{propertyTitle}</p>
            <Badge variant="secondary" className="mt-1">Virtual Tour</Badge>
          </div>
        </div>

        <div 
          ref={viewerContainerRef} 
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        ></div>
      </div>
    </div>
  );
}