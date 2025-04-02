import { useEffect, useState } from 'react';
import { Panorama } from '../lib/types';
import { useLanguage } from './LanguageSwitcher';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VirtualTourProps {
  panoramas: Panorama[];
}

export default function VirtualTour({ panoramas }: VirtualTourProps) {
  const [currentPanorama, setCurrentPanorama] = useState(0);
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage.code === 'ar';

  useEffect(() => {
    if (!panoramas.length) return;

    const viewer = new (window as any).pannellum.viewer('panorama', {
      type: 'equirectangular',
      panorama: panoramas[currentPanorama].url,
      autoLoad: true,
      compass: true,
      title: isArabic ? 'جولة افتراضية' : 'Virtual Tour',
      strings: {
        loadButtonLabel: isArabic ? 'بدء الجولة' : 'Start Tour',
        loadingLabel: isArabic ? 'جاري التحميل...' : 'Loading...',
        bylineLabel: isArabic ? 'تصوير' : 'by',
        noPanoramaError: isArabic ? 'لم يتم تحميل أي صورة' : 'No panorama image was specified.',
        fileAccessError: isArabic ? 'خطأ في الوصول للملف' : 'The file specified could not be accessed.',
        malformedURLError: isArabic ? 'خطأ في رابط الصورة' : 'There is something wrong with the panorama URL.',
        iOS8WebGLError: isArabic ? 'خطأ في متصفحك' : 'Due to iOS 8 WebGL implementation, only progressive encoded JPEGs work.',
      }
    });

    return () => {
      viewer?.destroy();
    };
  }, [currentPanorama, panoramas, isArabic]);

  if (!panoramas.length) {
    return (
      <div className="text-center p-8 bg-gray-100 rounded-lg">
        <p>{isArabic ? 'لا تتوفر جولة افتراضية لهذا العقار' : 'No virtual tour available for this property'}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div id="panorama" className="w-full h-[400px] rounded-lg overflow-hidden" />

      {panoramas.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPanorama(prev => (prev - 1 + panoramas.length) % panoramas.length)}
            className="bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPanorama(prev => (prev + 1) % panoramas.length)}
            className="bg-white/80 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded text-sm">
        {isArabic ? 'غرفة' : 'Room'} {currentPanorama + 1} / {panoramas.length}
      </div>
    </div>
  );
}