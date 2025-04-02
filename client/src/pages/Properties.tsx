import { useEffect, useState } from "react";
import PropertyFilter from "../components/PropertyFilter";
import { PropertyListSkeleton } from "../components/PropertyListSkeleton";
import { Helmet } from "react-helmet";

export default function Properties() {
  // Get the search query from the URL
  const searchString = window.location.search;
  const searchParams = new URLSearchParams(searchString);
  const location = searchParams.get('location');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate a short loading time for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Create page title based on search parameters
  const getPageTitle = () => {
    if (location) {
      return `${location} Vacation Rentals | Stay Chill`;
    }
    return "All Properties | Stay Chill";
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content="Browse our curated selection of premium vacation rentals in Sahel and Ras El Hekma, Egypt." />
      </Helmet>
      <div className="pt-10 pb-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
            {location ? `${location} Vacation Rentals` : "All Properties"}
          </h1>
          <p className="text-gray-600">
            Find your perfect stay in Egypt's most beautiful coastal destinations
          </p>
        </div>
      </div>
      
      {isLoading ? (
        <PropertyListSkeleton />
      ) : (
        <PropertyFilter />
      )}
    </>
  );
}
