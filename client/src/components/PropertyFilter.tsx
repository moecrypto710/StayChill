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
  const getPropertiesToDisplay = () => {
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Find Your Dream Vacation Rental</h2>
          <p className="text-gray-600">Explore our selection of premium properties in Sahel and Ras El Hekma</p>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) => setFilters({...filters, propertyType: value as any})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Chalet">Chalet</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Beach House">Beach House</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <Select
                value={filters.priceRange}
                onValueChange={(value) => setFilters({...filters, priceRange: value as any})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any Price">Any Price</SelectItem>
                  <SelectItem value="$0 - $100">$0 - $100</SelectItem>
                  <SelectItem value="$100 - $200">$100 - $200</SelectItem>
                  <SelectItem value="$200 - $300">$200 - $300</SelectItem>
                  <SelectItem value="$300+">$300+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <Select
                value={filters.bedrooms}
                onValueChange={(value) => setFilters({...filters, bedrooms: value as any})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4+">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
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
          </div>
          
          {/* Advanced filters */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance to Beach</label>
                  <Select
                    value={filters.distanceToBeach}
                    onValueChange={(value) => setFilters({...filters, distanceToBeach: value as any})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select distance" />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Rating</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <Input
                    type="text"
                    placeholder="e.g., 'sea view', 'quiet', 'modern'"
                    value={filters.keywords}
                    onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Button 
              variant="ghost"
              className="text-ocean-600 font-medium flex items-center p-0 hover:bg-transparent"
              onClick={toggleAdvancedFilters}
            >
              {showAdvancedFilters ? (
                <>Less filters <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>More filters <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </Button>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={handleClearFilters}
                disabled={isLoading || searchMutation.isPending}
              >
                Clear All
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="bg-ocean-500 hover:bg-ocean-600 text-white"
                disabled={isLoading || searchMutation.isPending}
              >
                {searchMutation.isPending ? 'Applying...' : 'Apply Filters'}
              </Button>
            </div>
          </div>
        </div>
        
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
            {displayedProperties.map(property => (
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
          <div className="mt-12 flex justify-center">
            <Button 
              variant="outline"
              className="px-8 py-6 border-ocean-500 text-ocean-500 hover:bg-ocean-50"
              onClick={handleLoadMore}
            >
              Load More Properties
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
