import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { queryClient } from "@/lib/queryClient";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property, PropertySearch } from "@shared/schema";
import { PropertyFilters } from "@/lib/types";

export default function PropertyFilter() {
  const [search] = useSearch();
  const searchParams = new URLSearchParams(search);
  
  // Get initial values from URL if present
  const initialLocation = searchParams.get('location') || undefined;
  const initialGuests = searchParams.get('guests') ? `${searchParams.get('guests')} People` : undefined;
  
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: 'All Types',
    priceRange: 'Any Price',
    bedrooms: 'Any',
    amenities: ['Select Amenities'],
    location: initialLocation as any,
    distanceToBeach: 'Any Distance',
    guestRating: 'Any Rating',
    keywords: '',
  });
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;
  
  // Convert UI filters to API search parameters
  const getSearchParams = (): PropertySearch => {
    const params: PropertySearch = {};
    
    if (filters.location && filters.location !== 'All Locations') {
      params.area = filters.location;
    }
    
    if (filters.bedrooms && filters.bedrooms !== 'Any') {
      params.bedrooms = parseInt(filters.bedrooms.replace('+', ''));
    }
    
    if (filters.priceRange && filters.priceRange !== 'Any Price') {
      const priceRange = filters.priceRange;
      if (priceRange === '$0 - $100') {
        params.minPrice = 0;
        params.maxPrice = 100;
      } else if (priceRange === '$100 - $200') {
        params.minPrice = 100;
        params.maxPrice = 200;
      } else if (priceRange === '$200 - $300') {
        params.minPrice = 200;
        params.maxPrice = 300;
      } else if (priceRange === '$300+') {
        params.minPrice = 300;
      }
    }
    
    if (filters.amenities && filters.amenities.length > 0 && !filters.amenities.includes('Select Amenities')) {
      params.amenities = filters.amenities;
    }
    
    return params;
  };
  
  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (searchParams: PropertySearch) => {
      const res = await apiRequest('POST', '/api/properties/search', searchParams);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties/search'] });
    },
  });
  
  // Default query to get all properties
  const { data: allProperties, isLoading, isError } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Apply filters when search button is clicked
  const handleApplyFilters = () => {
    const searchParams = getSearchParams();
    searchMutation.mutate(searchParams);
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      propertyType: 'All Types',
      priceRange: 'Any Price',
      bedrooms: 'Any',
      amenities: ['Select Amenities'],
      location: 'All Locations',
      distanceToBeach: 'Any Distance',
      guestRating: 'Any Rating',
      keywords: '',
    });
    
    // Reset to default properties
    queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
  };
  
  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Get properties to display
  const getPropertiesToDisplay = (): Property[] => {
    if (searchMutation.data) {
      return searchMutation.data;
    }
    return allProperties || [];
  };
  
  // Pagination
  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };
  
  const displayedProperties = getPropertiesToDisplay().slice(0, currentPage * propertiesPerPage);
  const hasMoreProperties = displayedProperties.length < getPropertiesToDisplay().length;

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Explore all properties</h2>
          <p className="text-gray-600 dark:text-gray-400">Discover amazing stays in Sahel and Ras El Hekma</p>
        </div>
        
        {/* Horizontal filter pills - Airbnb style */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            <div>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full border border-gray-200 dark:border-gray-700 font-normal text-sm flex items-center gap-1 hover:border-gray-400 dark:hover:border-gray-500"
                onClick={toggleAdvancedFilters}
              >
                <ChevronDown className="h-3.5 w-3.5" />
                Filters
              </Button>
            </div>
            
            <Select
              value={filters.propertyType}
              onValueChange={(value) => setFilters({...filters, propertyType: value as any})}
            >
              <SelectTrigger className="w-auto border-gray-200 dark:border-gray-700 font-normal text-sm rounded-full px-4 py-1 hover:border-gray-400 dark:hover:border-gray-500">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Chalet">Chalet</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Beach House">Beach House</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.priceRange}
              onValueChange={(value) => setFilters({...filters, priceRange: value as any})}
            >
              <SelectTrigger className="w-auto border-gray-200 dark:border-gray-700 font-normal text-sm rounded-full px-4 py-1 hover:border-gray-400 dark:hover:border-gray-500">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any Price">Any Price</SelectItem>
                <SelectItem value="$0 - $100">$0 - $100</SelectItem>
                <SelectItem value="$100 - $200">$100 - $200</SelectItem>
                <SelectItem value="$200 - $300">$200 - $300</SelectItem>
                <SelectItem value="$300+">$300+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.bedrooms}
              onValueChange={(value) => setFilters({...filters, bedrooms: value as any})}
            >
              <SelectTrigger className="w-auto border-gray-200 dark:border-gray-700 font-normal text-sm rounded-full px-4 py-1 hover:border-gray-400 dark:hover:border-gray-500">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any">Any</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4+">4+</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.distanceToBeach}
              onValueChange={(value) => setFilters({...filters, distanceToBeach: value as any})}
            >
              <SelectTrigger className="w-auto border-gray-200 dark:border-gray-700 font-normal text-sm rounded-full px-4 py-1 hover:border-gray-400 dark:hover:border-gray-500">
                <SelectValue placeholder="Beach Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any Distance">Any Distance</SelectItem>
                <SelectItem value="Beachfront">Beachfront</SelectItem>
                <SelectItem value="< 5 min walk">&lt; 5 min walk</SelectItem>
                <SelectItem value="< 10 min walk">&lt; 10 min walk</SelectItem>
                <SelectItem value="< 15 min walk">&lt; 15 min walk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Advanced filters panel */}
        {showAdvancedFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
                <Select
                  value={filters.amenities?.[0] || "Select Amenities"}
                  onValueChange={(value) => setFilters({...filters, amenities: [value as any]})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select amenities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Select Amenities">Select Amenities</SelectItem>
                    <SelectItem value="Pool">Pool</SelectItem>
                    <SelectItem value="Beachfront">Beachfront</SelectItem>
                    <SelectItem value="Air Conditioning">Air Conditioning</SelectItem>
                    <SelectItem value="WiFi">WiFi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guest Rating</label>
                <Select
                  value={filters.guestRating}
                  onValueChange={(value) => setFilters({...filters, guestRating: value as any})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Rating">Any Rating</SelectItem>
                    <SelectItem value="4+ Stars">4+ Stars</SelectItem>
                    <SelectItem value="4.5+ Stars">4.5+ Stars</SelectItem>
                    <SelectItem value="5 Stars">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Keywords</label>
                <Input
                  type="text"
                  placeholder="e.g., 'sea view', 'quiet', 'modern'"
                  value={filters.keywords}
                  onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                  className="border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                disabled={isLoading || searchMutation.isPending}
                className="text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
              >
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={handleApplyFilters}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={isLoading || searchMutation.isPending}
              >
                {searchMutation.isPending ? 'Applying...' : 'Show Results'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Property Results */}
        {isLoading || searchMutation.isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-60 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-red-500">Error loading properties. Please try again later.</p>
          </div>
        ) : displayedProperties.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No properties found matching your criteria. Please try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProperties.map((property: Property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                showRating={true}
              />
            ))}
          </div>
        )}
        
        {/* Load More button */}
        {hasMoreProperties && !isLoading && !searchMutation.isPending && (
          <div className="mt-10 flex justify-center">
            <Button 
              variant="outline"
              className="px-8 py-2 rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-500"
              onClick={handleLoadMore}
            >
              Show more
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
