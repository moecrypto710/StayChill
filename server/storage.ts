import { 
  properties, 
  bookings, 
  inquiries, 
  owners,
  type Property, 
  type InsertProperty, 
  type Booking, 
  type InsertBooking, 
  type Inquiry, 
  type InsertInquiry,
  type Owner,
  type InsertOwner,
  type PropertySearch
} from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations - keeping original ones
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  searchProperties(filters: PropertySearch): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByPropertyId(propertyId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Inquiry operations
  getInquiries(): Promise<Inquiry[]>;
  getInquiry(id: number): Promise<Inquiry | undefined>;
  getInquiriesByPropertyId(propertyId: number): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  markInquiryAsResponded(id: number): Promise<Inquiry | undefined>;
  
  // Owner operations
  getOwners(): Promise<Owner[]>;
  getOwner(id: number): Promise<Owner | undefined>;
  createOwner(owner: InsertOwner): Promise<Owner>;
  addPropertyToOwner(ownerId: number, propertyId: number): Promise<Owner | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private bookings: Map<number, Booking>;
  private inquiries: Map<number, Inquiry>;
  private owners: Map<number, Owner>;
  
  private userCurrentId: number;
  private propertyCurrentId: number;
  private bookingCurrentId: number;
  private inquiryCurrentId: number;
  private ownerCurrentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.bookings = new Map();
    this.inquiries = new Map();
    this.owners = new Map();
    
    this.userCurrentId = 1;
    this.propertyCurrentId = 1;
    this.bookingCurrentId = 1;
    this.inquiryCurrentId = 1;
    this.ownerCurrentId = 1;
    
    // Add some initial dummy properties
    this.initializeProperties();
  }

  // Initialize with sample properties to get started
  private initializeProperties() {
    const dummyProperties: InsertProperty[] = [
      {
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
      },
      {
        title: "Seaside Retreat Villa",
        description: "Elegant villa with direct beach access and stunning views of the Mediterranean.",
        location: "Premium Sahel Neighborhood",
        area: "Sahel",
        price: 450,
        bedrooms: 5,
        bathrooms: 4,
        maxGuests: 10,
        images: [
          "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Private Beach", "Infinity Pool", "Wi-Fi", "Air Conditioning", "Gym"],
        featured: false,
        isNew: false,
        rating: 50,
        reviewCount: 28
      },
      {
        title: "Ras El Hekma Getaway",
        description: "Perfect beachfront property for a relaxing vacation with friends and family.",
        location: "Ras El Hekma, Seafront",
        area: "Ras El Hekma",
        price: 275,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 7,
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Ocean View", "Pool", "Wi-Fi", "Air Conditioning", "BBQ"],
        featured: false,
        isNew: false,
        rating: 47,
        reviewCount: 19
      },
      {
        title: "Coastal Charm House",
        description: "Charming house with a beautiful garden, just a 5-minute walk to the beach.",
        location: "North Sahel, Beach Area",
        area: "Sahel",
        price: 195,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 5,
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: ["Garden", "5 min to Beach", "Wi-Fi", "Air Conditioning"],
        featured: false,
        isNew: false,
        rating: 42,
        reviewCount: 15
      }
    ];

    dummyProperties.forEach(property => {
      this.createProperty(property);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getFeaturedProperties(limit: number = 3): Promise<Property[]> {
    return Array.from(this.properties.values())
      .filter(property => property.featured)
      .slice(0, limit);
  }

  async searchProperties(filters: PropertySearch): Promise<Property[]> {
    let results = Array.from(this.properties.values());
    
    if (filters.area) {
      results = results.filter(p => p.area === filters.area);
    }
    
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }
    
    if (filters.bedrooms !== undefined) {
      results = results.filter(p => p.bedrooms >= filters.bedrooms!);
    }
    
    if (filters.maxGuests !== undefined) {
      results = results.filter(p => p.maxGuests >= filters.maxGuests!);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter(p => 
        filters.amenities!.every(amenity => p.amenities.includes(amenity))
      );
    }
    
    return results;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = this.propertyCurrentId++;
    const newProperty: Property = { ...property, id };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...updates };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }
  
  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByPropertyId(propertyId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.propertyId === propertyId);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingCurrentId++;
    const newBooking: Booking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    booking.status = status;
    return booking;
  }
  
  // Inquiry operations
  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async getInquiriesByPropertyId(propertyId: number): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values())
      .filter(inquiry => inquiry.propertyId === propertyId);
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.inquiryCurrentId++;
    const now = new Date();
    const newInquiry: Inquiry = { ...inquiry, id, createdAt: now, responded: false };
    this.inquiries.set(id, newInquiry);
    return newInquiry;
  }

  async markInquiryAsResponded(id: number): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    
    inquiry.responded = true;
    return inquiry;
  }
  
  // Owner operations
  async getOwners(): Promise<Owner[]> {
    return Array.from(this.owners.values());
  }

  async getOwner(id: number): Promise<Owner | undefined> {
    return this.owners.get(id);
  }

  async createOwner(owner: InsertOwner): Promise<Owner> {
    const id = this.ownerCurrentId++;
    const newOwner: Owner = { ...owner, id };
    this.owners.set(id, newOwner);
    return newOwner;
  }

  async addPropertyToOwner(ownerId: number, propertyId: number): Promise<Owner | undefined> {
    const owner = this.owners.get(ownerId);
    if (!owner) return undefined;
    
    const properties = owner.properties || [];
    if (!properties.includes(propertyId)) {
      owner.properties = [...properties, propertyId];
    }
    
    return owner;
  }
}

export const storage = new MemStorage();
