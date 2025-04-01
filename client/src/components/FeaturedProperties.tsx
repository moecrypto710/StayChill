import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "./PropertyCard";
import { Property } from "@shared/schema";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

// Example properties to show when not logged in or when there's an error
const exampleProperties: Property[] = [
  {
    id: 1,
    title: "Luxurious Beachfront Villa",
    description: "Stunning villa right on the beach with private access to the sea. Perfect for family getaways.",
    location: "North Coast, Sahel",
    area: "Sahel",
    price: 350,
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    images: [
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Beachfront", "Private Pool", "Wi-Fi", "Air Conditioning", "BBQ"],
    featured: true,
    isNew: false,
    rating: 50,
    reviewCount: 15
  },
  {
    id: 2,
    title: "Ras El Hekma Chalet",
    description: "Beautiful chalet with amazing sea views, just a few steps from the beach.",
    location: "Ras El Hekma",
    area: "Ras El Hekma",
    price: 220,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Sea View", "Shared Pool", "Wi-Fi", "Air Conditioning"],
    featured: true,
    isNew: true,
    rating: 45,
    reviewCount: 8
  },
  {
    id: 3,
    title: "Modern Sahel Apartment",
    description: "Contemporary apartment near the marina with all modern amenities for a comfortable stay.",
    location: "Marina, Sahel",
    area: "Sahel",
    price: 180,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    images: [
      "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["Beach Nearby", "Pool Access", "Wi-Fi", "Air Conditioning"],
    featured: true,
    isNew: false,
    rating: 40,
    reviewCount: 12
  }
];

export default function FeaturedProperties() {
  const { isAuthenticated } = useAuth();
  const { data: properties, isLoading, isError } = useQuery<Property[]>({
    queryKey: ['/api/properties/featured'],
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  // Determine which properties to display
  const displayProperties = isAuthenticated && !isError && properties ? properties : exampleProperties;

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Beach Properties</h2>
              <p className="text-gray-600">Handpicked vacation homes for your perfect getaway</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3 inline-block">Featured Properties</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Handpicked Beach Escapes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our premium selection of beachfront villas, cozy chalets, and modern apartments for your perfect Sahel and Ras El Hekma getaway.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              featured={property.featured} 
              isNew={property.isNew} 
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/properties" className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg">
            Explore All Properties
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
