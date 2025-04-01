import HeroSection from "../components/HeroSection";
import FeaturedProperties from "../components/FeaturedProperties";
import PropertyFilter from "../components/PropertyFilter";
import CtaSection from "../components/CtaSection";
import BrandPromiseSection from "../components/BrandPromiseSection";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Stay Chill - Premium Sahel & Ras El Hekma Rentals</title>
        <meta name="description" content="Find your perfect beachside getaway in Sahel and Ras El Hekma, Egypt. Premium vacation rentals with amazing amenities and locations." />
      </Helmet>
      <HeroSection />
      <FeaturedProperties />
      <PropertyFilter />
      <CtaSection />
      <BrandPromiseSection />
    </>
  );
}
