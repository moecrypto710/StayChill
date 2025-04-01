// Additional types for the frontend

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export type PropertyType = 'All Types' | 'Villa' | 'Chalet' | 'Apartment' | 'Beach House';

export type PriceRange = 
  | 'Any Price' 
  | '$0 - $100' 
  | '$100 - $200' 
  | '$200 - $300' 
  | '$300+';

export type BedroomsFilter = 'Any' | '1' | '2' | '3' | '4+';

export type AmenitiesFilter = 
  | 'Select Amenities' 
  | 'Pool' 
  | 'Beachfront' 
  | 'Air Conditioning' 
  | 'WiFi';

export type LocationFilter = 'All Locations' | 'Sahel' | 'Ras El Hekma';

export type DistanceToBeach = 
  | 'Any Distance' 
  | 'Beachfront' 
  | '< 5 min walk' 
  | '< 10 min walk' 
  | '< 15 min walk';

export type GuestRating = 
  | 'Any Rating' 
  | '4+ Stars' 
  | '4.5+ Stars' 
  | '5 Stars';

export interface PropertyFilters {
  propertyType?: PropertyType;
  priceRange?: PriceRange;
  bedrooms?: BedroomsFilter;
  amenities?: AmenitiesFilter[];
  location?: LocationFilter;
  distanceToBeach?: DistanceToBeach;
  guestRating?: GuestRating;
  keywords?: string;
  dateRange?: DateRange;
  guests?: number;
}
