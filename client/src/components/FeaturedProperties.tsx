import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "./PropertyCard";
import { Property } from "@shared/schema";
import { ArrowRight } from "lucide-react";

export default function FeaturedProperties() {
  const { data: properties, isLoading, isError } = useQuery<Property[]>({
    queryKey: ['/api/properties/featured'],
  });

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

  if (isError) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Featured Beach Properties</h2>
            <p className="text-red-500 mt-4">Failed to load featured properties. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Beach Properties</h2>
            <p className="text-gray-600">Handpicked vacation homes for your perfect getaway</p>
          </div>
          <Link href="/properties" className="text-ocean-600 font-medium hover:text-ocean-700 transition-colors hidden md:flex items-center">
            View all properties <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties?.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              featured={property.featured} 
              isNew={property.isNew} 
            />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link href="/properties" className="inline-block text-ocean-600 font-medium hover:text-ocean-700 transition-colors">
            View all properties <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
