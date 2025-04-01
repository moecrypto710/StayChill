import express, { type Express, Response, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  propertySearchSchema, 
  insertBookingSchema, 
  insertInquirySchema,
  bookingValidationSchema,
  inquiryValidationSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

function handleZodError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return res.status(400).json({ error: validationError.message });
  }
  return res.status(500).json({ error: "An unexpected error occurred" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Properties routes
  apiRouter.get("/properties", async (req, res) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });
  
  apiRouter.get("/properties/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const featuredProperties = await storage.getFeaturedProperties(limit);
      res.json(featuredProperties);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });
  
  apiRouter.get("/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });
  
  apiRouter.post("/properties/search", async (req, res) => {
    try {
      const filters = propertySearchSchema.parse(req.body);
      const properties = await storage.searchProperties(filters);
      res.json(properties);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Booking routes
  apiRouter.post("/bookings", async (req, res) => {
    try {
      const bookingData = bookingValidationSchema.parse(req.body);
      
      // Check if property exists
      const property = await storage.getProperty(bookingData.propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Inquiry routes
  apiRouter.post("/inquiries", async (req, res) => {
    try {
      const inquiryData = inquiryValidationSchema.parse(req.body);
      
      // If propertyId is provided, check if property exists
      if (inquiryData.propertyId) {
        const property = await storage.getProperty(inquiryData.propertyId);
        if (!property) {
          return res.status(404).json({ error: "Property not found" });
        }
      }
      
      const inquiry = await storage.createInquiry(inquiryData);
      res.status(201).json(inquiry);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Mount API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
