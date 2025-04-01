import HeroSection from "../components/HeroSection";
import FeaturedProperties from "../components/FeaturedProperties";
import PropertyFilter from "../components/PropertyFilter";
import CtaSection from "../components/CtaSection";
import BrandPromiseSection from "../components/BrandPromiseSection";
import { Helmet } from "react-helmet";
import { useLanguage } from "../components/LanguageSwitcher";
import { useTranslation } from "../lib/translations";

export default function Home() {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage.code);
  
  return (
    <div className={currentLanguage.code === 'ar' ? 'ar' : ''}>
      <Helmet>
        <title>
          {currentLanguage.code === 'ar' 
            ? 'استرخي واستمتع | شاليهات وفيلات فاخرة في الساحل ورأس الحكمة'
            : 'Stay Chill - Premium Sahel & Ras El Hekma Rentals'
          }
        </title>
        <meta 
          name="description" 
          content={
            currentLanguage.code === 'ar'
              ? 'اعثر على مكان إقامتك المثالي في الساحل ورأس الحكمة. فيلات على البحر مباشرة، شاليهات، وشقق فاخرة مع مرافق متميزة.'
              : 'Find your perfect beachside getaway in Sahel and Ras El Hekma, Egypt. Premium vacation rentals with amazing amenities and locations.'
          } 
        />
      </Helmet>
      <HeroSection />
      <FeaturedProperties />
      <PropertyFilter />
      <CtaSection />
      <BrandPromiseSection />
    </div>
  );
}
