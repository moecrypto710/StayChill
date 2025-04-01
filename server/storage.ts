import { 
  properties, 
  bookings, 
  inquiries, 
  owners,
  users,
  type Property, 
  type InsertProperty, 
  type Booking, 
  type InsertBooking, 
  type Inquiry, 
  type InsertInquiry,
  type Owner,
  type InsertOwner,
  type PropertySearch,
  type User,
  type InsertUser
} from "@shared/schema";
import { eq, gte, lte, inArray } from "drizzle-orm";
import { db } from "./db";

// Types are imported from shared/schema.ts

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Favorites operations
  addFavorite(userId: number, propertyId: number): Promise<boolean>;
  removeFavorite(userId: number, propertyId: number): Promise<boolean>;
  getFavorites(userId: number): Promise<number[]>;

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
  private favorites: Map<number, number[]>; // Add favorites map

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
    this.favorites = new Map(); // Initialize favorites map

    this.userCurrentId = 1;
    this.propertyCurrentId = 1;
    this.bookingCurrentId = 1;
    this.inquiryCurrentId = 1;
    this.ownerCurrentId = 1;

    // Add some initial dummy properties and guest user
    this.initializeProperties();
    this.initializeGuestUser();
  }

  // Initialize a guest account for demo purposes
  private initializeGuestUser() {
    const guestUser: InsertUser = {
      username: "guest",
      password: "$2a$10$CUd8KN.dqzTP0fWNrWMS4eDWmXFEFgH1g2JJYCVEyoQHUCg/NAFzi", // bcrypt hash for "guest123"
      email: "guest@guestemail.com"
    };

    this.createUser(guestUser).catch(err => {
      console.error("Error creating guest user:", err);
    });
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

  // Favorites operations
  async addFavorite(userId: number, propertyId: number): Promise<boolean> {
    let favorites = this.favorites.get(userId) || [];
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      this.favorites.set(userId, favorites);
      return true;
    }
    return false;
  }

  async removeFavorite(userId: number, propertyId: number): Promise<boolean> {
    const favorites = this.favorites.get(userId) || [];
    const index = favorites.indexOf(propertyId);
    if (index > -1) {
      favorites.splice(index, 1);
      this.favorites.set(userId, favorites);
      return true;
    }
    return false;
  }

  async getFavorites(userId: number): Promise<number[]> {
    return this.favorites.get(userId) || [];
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
    // Fix type issues by ensuring all fields have proper values
    const newProperty: Property = { 
      ...property, 
      id,
      featured: property.featured ?? false,
      isNew: property.isNew ?? false,
      rating: property.rating ?? 0,
      reviewCount: property.reviewCount ?? 0 
    };
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
    const newBooking: Booking = { 
      ...booking, 
      id,
      message: booking.message ?? null,
      status: booking.status ?? "pending"
    };
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
    const newInquiry: Inquiry = { 
      ...inquiry, 
      id, 
      propertyId: inquiry.propertyId ?? null,
      createdAt: now, 
      responded: false 
    };
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
    const newOwner: Owner = { 
      ...owner, 
      id,
      properties: owner.properties ?? []
    };
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

export class PostgresStorage implements IStorage {
  constructor() {
    this.initializeProperties();
    this.initializeGuestUser();
  }

  // Use the imported db
  private readonly db = db;

  // Initialize a guest account for demo purposes
  private async initializeGuestUser() {
    try {
      // Check if guest user already exists
      const existingUser = await this.getUserByUsername("guest");
      if (!existingUser) {
        const guestUser: InsertUser = {
          username: "guest",
          password: "$2b$10$5XQQgQ9PwFmtdITHkyDFEuZWVmkbTpiUOUMY0rfir6cS4bxzI4ALO", // bcrypt hash for "guest123"
          email: "guest@guestemail.com"
        };
        await this.createUser(guestUser);
        console.log("Created guest user for demo purposes");
      }
    } catch (err) {
      console.error("Error creating guest user:", err);
    }
  }

  // Initialize with sample data if DB is empty
  private async initializeProperties() {
    try {
      const existingProperties = await this.getProperties();

      // If no properties exist, seed the database
      if (existingProperties.length === 0) {
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
          }
        ];

        // Insert sample properties
        for (const property of dummyProperties) {
          await this.createProperty(property);
        }

        console.log("Database seeded with initial properties");
      }
    } catch (error) {
      console.error("Error initializing properties:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await this.db.select().from(users).where(eq(users.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error: any) {
      console.error("Error fetching user:", error);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await this.db.select().from(users).where(eq(users.username, username));
      return result.length > 0 ? result[0] : undefined;
    } catch (error: any) {
      console.error("Error fetching user by username:", error);
      throw new Error(`Failed to fetch user by username: ${error.message}`);
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByUsername(user.username);
      if (existingUser) {
        return existingUser;
      }

      // Make sure we have an email field even if it's not provided (for guest user)
      const userData = {
        ...user,
        email: user.email || `${user.username}@guestemail.com`
      };

      const result = await this.db.insert(users).values(userData).returning();
      return result[0];
    } catch (error: any) {
      console.error("Error creating user:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Property operations
  async getProperties(): Promise<Property[]> {
    return await this.db.select().from(properties);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const result = await this.db.select().from(properties).where(eq(properties.id, id));
    return result.length > 0 ? result[0] : undefined;
  }

  async getFeaturedProperties(limit: number = 3): Promise<Property[]> {
    return await this.db
      .select()
      .from(properties)
      .where(eq(properties.featured, true))
      .limit(limit);
  }

  async searchProperties(filters: PropertySearch): Promise<Property[]> {
    try {
      // Start building the query
      let query = this.db.select().from(properties);

      // Apply filters with AND logic in a simplified approach
      if (filters.area) {
        query = query.where(eq(properties.area, filters.area));
      }

      let qResult = await query;
      let results = [...qResult]; // Make a copy to avoid type issues

      // Apply remaining filters manually since the query building is causing type issues
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

      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        results = results.filter((p: Property) => 
          filters.amenities!.every(amenity => p.amenities.includes(amenity))
        );
      }

      return results;
    } catch (error: any) {
      console.error("Error searching properties:", error);
      throw new Error(`Failed to search properties: ${error.message}`);
    }
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    try {
      const result = await this.db.insert(properties).values(property).returning();
      return result[0];
    } catch (error: any) {
      console.error("Error creating property:", error);
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    try {
      const result = await this.db
        .update(properties)
        .set(updates)
        .where(eq(properties.id, id))
        .returning();

      return result.length > 0 ? result[0] : undefined;
    } catch (error: any) {
      console.error("Error updating property:", error);
      throw new Error(`Failed to update property: ${error.message}`);
    }
  }

  async deleteProperty(id: number): Promise<boolean> {
    try {
      const result = await this.db
        .delete(properties)
        .where(eq(properties.id, id))
        .returning({ id: properties.id });

      return result.length > 0;
    } catch (error: any) {
      console.error("Error deleting property:", error);
      throw new Error(`Failed to delete property: ${error.message}`);
    }
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    try {
      return await this.db.select().from(bookings);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    try {
      const result = await this.db.select().from(bookings).where(eq(bookings.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error: any) {
      console.error("Error fetching booking:", error);
      throw new Error(`Failed to fetch booking: ${error.message}`);
    }
  }

  async getBookingsByPropertyId(propertyId: number): Promise<Booking[]> {
    try {
      return await this.db
        .select()
        .from(bookings)
        .where(eq(bookings.propertyId, propertyId));
    } catch (error: any) {
      console.error("Error fetching bookings by property ID:", error);
      throw new Error(`Failed to fetch bookings by property ID: ${error.message}`);
    }
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    try {
      const result = await this.db.insert(bookings).values(booking).returning();
      return result[0];
    } catch (error: any) {
      console.error("Error creating booking:", error);
      throw new Error(`Failed to create booking: ${error.message}`);
    }
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    try {
      const result = await this.db
        .update(bookings)
        .set({ status })
        .where(eq(bookings.id, id))
        .returning();

      return result.length > 0 ? result[0] : undefined;
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      throw new Error(`Failed to update booking status: ${error.message}`);
    }
  }

  // Inquiry operations
  async getInquiries(): Promise<Inquiry[]> {
    try {
      return await this.db.select().from(inquiries);
    } catch (error: any) {
      console.error("Error fetching inquiries:", error);
      throw new Error(`Failed to fetch inquiries: ${error.message}`);
    }
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    try {
      const result = await this.db.select().from(inquiries).where(eq(inquiries.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error: any) {
      console.error("Error fetching inquiry:", error);
      throw new Error(`Failed to fetch inquiry: ${error.message}`);
    }
  }

  async getInquiriesByPropertyId(propertyId: number): Promise<Inquiry[]> {
    try {
      return await this.db
        .select()
        .from(inquiries)
        .where(eq(inquiries.propertyId, propertyId));
    } catch (error: any) {
      console.error("Error fetching inquiries by property ID:", error);
      throw new Error(`Failed to fetch inquiries by property ID: ${error.message}`);
    }
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    try {
      const result = await this.db
        .insert(inquiries)
        .values({
          ...inquiry,
          responded: false,
        })
        .returning();

      return result[0];
    } catch (error: any) {
      console.error("Error creating inquiry:", error);
      throw new Error(`Failed to create inquiry: ${error.message}`);
    }
  }

  async markInquiryAsResponded(id: number): Promise<Inquiry | undefined> {
    try {
      const result = await this.db
        .update(inquiries)
        .set({ responded: true })
        .where(eq(inquiries.id, id))
        .returning();

      return result.length > 0 ? result[0] : undefined;
    } catch (error: any) {
      console.error("Error marking inquiry as responded:", error);
      throw new Error(`Failed to mark inquiry as responded: ${error.message}`);
    }
  }

  // Owner operations
  async getOwners(): Promise<Owner[]> {
    try {
      return await this.db.select().from(owners);
    } catch (error: any) {
      console.error("Error fetching owners:", error);
      throw new Error(`Failed to fetch owners: ${error.message}`);
    }
  }

  async getOwner(id: number): Promise<Owner | undefined> {
    try {
      const result = await this.db.select().from(owners).where(eq(owners.id, id));
      return result.length > 0 ? result[0] : undefined;
    } catch (error: any) {
      console.error("Error fetching owner:", error);
      throw new Error(`Failed to fetch owner: ${error.message}`);
    }
  }

  async createOwner(owner: InsertOwner): Promise<Owner> {
    try {
      const result = await this.db.insert(owners).values(owner).returning();
      return result[0];
    } catch (error: any) {
      console.error("Error creating owner:", error);
      throw new Error(`Failed to create owner: ${error.message}`);
    }
    }

  async addPropertyToOwner(ownerId: number, propertyId: number): Promise<Owner | undefined> {
    try {
      // First get the owner
      const owner = await this.getOwner(ownerId);
      if (!owner) return undefined;

      // Update the owner's properties list
      const properties = owner.properties || [];
      if (!properties.includes(propertyId)) {
        const result = await this.db
          .update(owners)
          .set({ properties: [...properties, propertyId] })
          .where(eq(owners.id, ownerId))
          .returning();

        return result.length > 0 ? result[0] : undefined;
      }

      return owner;
    } catch (error: any) {
      console.error("Error adding property to owner:", error);
      throw new Error(`Failed to add property to owner: ${error.message}`);
    }
  }

  // Favorites operations
  async addFavorite(userId: number, propertyId: number): Promise<boolean> {
    try {
      const result = await this.db.insert(favorites).values({ userId, propertyId }).returning();
      return result.length > 0;
    } catch (error: any) {
      console.error("Error adding favorite:", error);
      throw new Error(`Failed to add favorite: ${error.message}`);
    }
  }

  async removeFavorite(userId: number, propertyId: number): Promise<boolean> {
    try {
      const result = await this.db
        .delete(favorites)
        .where(eq(favorites.userId, userId))
        .where(eq(favorites.propertyId, propertyId))
        .returning();
      return result.length > 0;
    } catch (error: any) {
      console.error("Error removing favorite:", error);
      throw new Error(`Failed to remove favorite: ${error.message}`);
    }
  }

  async getFavorites(userId: number): Promise<number[]> {
    try {
      const result = await this.db
        .select({ propertyId: favorites.propertyId })
        .from(favorites)
        .where(eq(favorites.userId, userId));
      return result.map(fav => fav.propertyId);
    } catch (error: any) {
      console.error("Error getting favorites:", error);
      throw new Error(`Failed to get favorites: ${error.message}`);
    }
  }
}

// Create and export the storage instance
// Use PostgresStorage instead of MemStorage
export const storage = new PostgresStorage();