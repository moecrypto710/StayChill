import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Property model
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  area: text("area").notNull(), // e.g., "Sahel", "Ras El Hekma"
  price: integer("price").notNull(), // per night
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  images: text("images").array().notNull(),
  amenities: text("amenities").array().notNull(),
  featured: boolean("featured").default(false),
  isNew: boolean("is_new").default(false),
  rating: integer("rating").default(0), // out of 5, multiplied by 10 (e.g., 4.5 = 45)
  reviewCount: integer("review_count").default(0),
});

// Booking model
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guests: integer("guests").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
});

// Contact/Inquiry model
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id"), // Optional, can be a general inquiry
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  responded: boolean("responded").default(false),
});

// Property owner model (simplified for now)
export const owners = pgTable("owners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  properties: integer("properties").array(),
});

// Zod schemas for insert
export const insertPropertySchema = createInsertSchema(properties).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });
export const insertInquirySchema = createInsertSchema(inquiries).omit({ id: true, createdAt: true });
export const insertOwnerSchema = createInsertSchema(owners).omit({ id: true });

// Zod schemas with validation
export const propertySearchSchema = z.object({
  area: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  maxGuests: z.number().optional(),
});

// Add validation to booking schema
export const bookingValidationSchema = insertBookingSchema.extend({
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().min(1, "Must have at least 1 guest"),
});

// Add validation to inquiry schema
export const inquiryValidationSchema = insertInquirySchema.extend({
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Owner = typeof owners.$inferSelect;
export type InsertOwner = z.infer<typeof insertOwnerSchema>;
// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PropertySearch = z.infer<typeof propertySearchSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;
