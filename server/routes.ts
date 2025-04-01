import express, { type Express, Response, Request, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import memorystore from "memorystore";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import "./types"; // Import session type extensions
import { 
  propertySearchSchema, 
  insertBookingSchema, 
  insertInquirySchema,
  bookingValidationSchema,
  inquiryValidationSchema,
  loginSchema,
  registerSchema,
  pricePointSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Create memory store for sessions
const MemoryStore = memorystore(session);

function handleZodError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return res.status(400).json({ error: validationError.message });
  }
  return res.status(500).json({ error: "An unexpected error occurred" });
}

// Authentication middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "staychill-secret-key",
    })
  );
  
  // API routes
  const apiRouter = express.Router();
  
  // Auth routes
  const authRouter = express.Router();
  
  // Register a new user
  authRouter.post("/register", async (req, res) => {
    try {
      // Validate request body
      const userData = registerSchema.parse(req.body);
      const { confirmPassword, ...userDataToSave } = userData;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const newUser = await storage.createUser({
        ...userDataToSave,
        password: hashedPassword,
      });
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Login
  authRouter.post("/login", async (req, res) => {
    try {
      // Validate request body
      const loginData = loginSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUserByUsername(loginData.username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set user in session
      req.session.userId = user.id;
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Logout
  authRouter.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // Get current user
  authRouter.get("/me", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId as number);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  
  // Mount auth router
  apiRouter.use("/auth", authRouter);
  
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
  apiRouter.post("/bookings", isAuthenticated, async (req, res) => {
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
  apiRouter.post("/inquiries", isAuthenticated, async (req, res) => {
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
  
  // Favorites routes
  apiRouter.post("/favorites/:propertyId", isAuthenticated, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const userId = req.session.userId as number;
      
      await storage.addFavorite(userId, propertyId);
      res.status(200).json({ message: "Added to favorites" });
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  apiRouter.delete("/favorites/:propertyId", isAuthenticated, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const userId = req.session.userId as number;
      
      await storage.removeFavorite(userId, propertyId);
      res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  apiRouter.get("/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });
  
  // Property availability and pricing routes
  apiRouter.get("/properties/:id/availability", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      
      const availabilityData = await storage.getAvailabilityData(propertyId, startDate, endDate);
      res.json(availabilityData);
    } catch (error) {
      console.error("Error fetching availability data:", error);
      res.status(500).json({ error: "Failed to fetch availability data" });
    }
  });
  
  apiRouter.post("/properties/:id/availability", isAuthenticated, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const data = pricePointSchema.array().parse(req.body);
      
      const updatedData = await storage.updateAvailabilityData(propertyId, data);
      res.json(updatedData);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // Mount API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
