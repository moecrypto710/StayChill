import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, decimal, primaryKey } from "drizzle-orm/pg-core";
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
  hasPanorama: boolean("has_panorama").default(false),
  panoramas: jsonb("panoramas").default([]),
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
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  paymentStatus: text("payment_status").default("unpaid"), // unpaid, processing, paid, refunded
  paymentIntentId: text("payment_intent_id"),
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
  propertyType: z.string().optional(),
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

// Define a type for price and availability data points
export const pricePointSchema = z.object({
  date: z.string(),
  price: z.number().positive(),
  available: z.boolean(),
  bookingCount: z.number().optional()
});

// Schema for property availability data
export const availabilityDataSchema = z.object({
  id: z.number(),
  propertyId: z.number(),
  data: z.array(pricePointSchema)
});

// Define schemas for panorama and virtual tour data
export const hotspotSchema = z.object({
  id: z.string(),
  pitch: z.number(),
  yaw: z.number(),
  type: z.enum(['info', 'link']),
  text: z.string().optional(),
  URL: z.string().optional(),
  targetPanoramaId: z.string().optional()
});

export const panoramaSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  hotspots: z.array(hotspotSchema).optional()
});

// Payment schemas
export const paymentMethodSchema = z.object({
  type: z.enum(['card']),
  card: z.object({
    number: z.string().min(13).max(19),
    expMonth: z.number().min(1).max(12),
    expYear: z.number().min(new Date().getFullYear() % 100),
    cvc: z.string().min(3).max(4)
  })
});

export const paymentIntentSchema = z.object({
  bookingId: z.number(),
  amount: z.number().positive(),
  currency: z.string().default("usd"),
  description: z.string().optional(),
  paymentMethod: z.string().optional(),
  returnUrl: z.string().optional()
});

export type PropertySearch = z.infer<typeof propertySearchSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;
export type PricePoint = z.infer<typeof pricePointSchema>;
export type AvailabilityData = z.infer<typeof availabilityDataSchema>;
export type Hotspot = z.infer<typeof hotspotSchema>;
export type Panorama = z.infer<typeof panoramaSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PaymentIntent = z.infer<typeof paymentIntentSchema>;

// Message and Chat models
export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
});

export const chatParticipants = pgTable("chat_participants", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull().default("guest"), // guest, host, admin
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  senderId: integer("sender_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  readBy: integer("read_by").array().default([]),
});

// Insert schemas for chat
export const insertChatRoomSchema = createInsertSchema(chatRooms).omit({ id: true, createdAt: true, lastMessageAt: true });
export const insertChatParticipantSchema = createInsertSchema(chatParticipants).omit({ id: true, joinedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

// Types for chat
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = z.infer<typeof insertChatRoomSchema>;
export type ChatParticipant = typeof chatParticipants.$inferSelect;
export type InsertChatParticipant = z.infer<typeof insertChatParticipantSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Recommendation system types
export const travelPreferences = pgTable("travel_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  preferredLocations: text("preferred_locations").array().notNull(),
  preferredAmenities: text("preferred_amenities").array().notNull(),
  travelStyle: text("travel_style").notNull(), // 'family', 'couple', 'solo', 'friends', 'business'
  budgetRange: text("budget_range").notNull(), // 'budget', 'mid-range', 'luxury'
  tripDuration: text("trip_duration").notNull(), // 'weekend', 'week', 'long-term'
  seasonalPreference: text("seasonal_preference").notNull(), // 'summer', 'winter', 'spring', 'fall', 'any'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  score: integer("score").notNull(), // Recommendation score from 0-100
  reasonCodes: text("reason_codes").array().notNull(), // Why this property was recommended
  viewed: boolean("viewed").default(false),
  saved: boolean("saved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTravelPreferencesSchema = createInsertSchema(travelPreferences).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRecommendationSchema = createInsertSchema(recommendations).omit({ id: true, createdAt: true });

// Travel preference validation schema
export const travelPreferencesValidationSchema = insertTravelPreferencesSchema.extend({
  preferredLocations: z.array(z.string()).min(1, "Select at least one preferred location"),
  preferredAmenities: z.array(z.string()).min(1, "Select at least one preferred amenity"),
  travelStyle: z.enum(['family', 'couple', 'solo', 'friends', 'business']),
  budgetRange: z.enum(['budget', 'mid-range', 'luxury']),
  tripDuration: z.enum(['weekend', 'week', 'long-term']),
  seasonalPreference: z.enum(['summer', 'winter', 'spring', 'fall', 'any']),
});

export type TravelPreference = typeof travelPreferences.$inferSelect;
export type InsertTravelPreference = z.infer<typeof insertTravelPreferencesSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
