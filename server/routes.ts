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
  pricePointSchema,
  paymentIntentSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import Stripe from "stripe";

// Create memory store for sessions
const MemoryStore = memorystore(session);

// Initialize Stripe if API key is available
let stripe: Stripe | undefined;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any, // Cast to any to fix TypeScript compatibility issues
    });
    console.log('Stripe initialized successfully');
  } else {
    console.warn('STRIPE_SECRET_KEY is not set. Payment features will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
}

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
  
  // Update booking payment status
  apiRouter.patch("/bookings/:bookingId/payment-status", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const { paymentStatus, paymentIntentId } = req.body;
      
      if (!paymentStatus) {
        return res.status(400).json({ error: "Payment status is required" });
      }
      
      // Check if booking exists
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      const updatedBooking = await storage.updateBookingPaymentStatus(bookingId, paymentStatus, paymentIntentId);
      
      if (paymentStatus === 'paid') {
        // If payment is marked as paid, also update booking status to confirmed
        await storage.updateBookingStatus(bookingId, 'confirmed');
      }
      
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking payment status:", error);
      res.status(500).json({ error: "Failed to update booking payment status" });
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

  // Payment routes
  const paymentRouter = express.Router();

  // Create payment intent
  paymentRouter.post("/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
      // Check if Stripe is configured
      if (!stripe) {
        return res.status(503).json({ error: "Payment service is not available. STRIPE_SECRET_KEY is not configured." });
      }

      const paymentData = paymentIntentSchema.parse(req.body);
      const { bookingId, amount, currency = "usd", description } = paymentData;

      // Get the booking to verify it exists
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe works in cents
        currency,
        description: description || `Payment for booking #${bookingId}`,
        metadata: { bookingId: bookingId.toString() },
      });

      // Update booking with payment intent ID and total amount
      await storage.updateBookingPaymentStatus(bookingId, "processing", paymentIntent.id);
      await storage.updateBookingTotalAmount(bookingId, amount);

      // Return the client secret to the frontend
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        handleZodError(error, res);
      }
    }
  });

  // Process a payment
  paymentRouter.post("/process-payment", isAuthenticated, async (req, res) => {
    try {
      // Check if Stripe is configured
      if (!stripe) {
        return res.status(503).json({ error: "Payment service is not available. STRIPE_SECRET_KEY is not configured." });
      }

      const { paymentIntentId, bookingId } = req.body;
      
      if (!paymentIntentId || !bookingId) {
        return res.status(400).json({ error: "Missing payment intent ID or booking ID" });
      }

      // Retrieve the payment intent from Stripe to check its status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Check payment status
      if (paymentIntent.status === "succeeded") {
        // Update booking status in database
        await storage.updateBookingPaymentStatus(bookingId, "paid", paymentIntentId);
        await storage.updateBookingStatus(bookingId, "confirmed");
        
        res.json({ 
          success: true, 
          message: "Payment successful",
          status: "paid",
          bookingStatus: "confirmed"
        });
      } else if (paymentIntent.status === "requires_payment_method" || 
                paymentIntent.status === "requires_confirmation" ||
                paymentIntent.status === "requires_action") {
        // Payment still needs action
        res.json({ 
          success: false, 
          message: "Payment requires further action",
          status: paymentIntent.status
        });
      } else {
        // Payment failed or was cancelled
        await storage.updateBookingPaymentStatus(bookingId, "failed", paymentIntentId);
        
        res.json({ 
          success: false, 
          message: "Payment failed or was cancelled",
          status: paymentIntent.status
        });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to process payment" });
      }
    }
  });

  // Webhook for payment events from Stripe
  paymentRouter.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      // Check if Stripe is configured
      if (!stripe) {
        return res.status(503).json({ error: "Payment service is not available. STRIPE_SECRET_KEY is not configured." });
      }

      // Verify the webhook signature
      const signature = req.headers['stripe-signature'];
      
      if (!signature) {
        return res.status(400).json({ error: "Missing Stripe signature" });
      }

      // Verify the event
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
        );
      } catch (err) {
        return res.status(400).json({ error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
      }

      // Handle the event
      const eventObject = event.data.object as any; // Cast to any to work with the object safely
      
      // Only proceed if this is a payment intent event and has metadata with bookingId
      if (event.type.startsWith('payment_intent.') && eventObject && eventObject.metadata) {
        const bookingId = parseInt(eventObject.metadata.bookingId);
        
        if (!bookingId) {
          return res.status(400).json({ error: "Missing booking ID in payment metadata" });
        }

        switch (event.type) {
          case 'payment_intent.succeeded':
            // Payment succeeded, update booking
            await storage.updateBookingPaymentStatus(bookingId, "paid", eventObject.id);
            await storage.updateBookingStatus(bookingId, "confirmed");
            break;
          case 'payment_intent.payment_failed':
            // Payment failed, update booking
            await storage.updateBookingPaymentStatus(bookingId, "failed", eventObject.id);
            break;
          case 'payment_intent.canceled':
            // Payment canceled, update booking
            await storage.updateBookingPaymentStatus(bookingId, "canceled", eventObject.id);
            break;
          case 'payment_intent.processing':
            // Payment is processing
            await storage.updateBookingPaymentStatus(bookingId, "processing", eventObject.id);
            break;
          default:
            console.log(`Unhandled payment intent event type ${event.type}`);
        }
      } else {
        console.log(`Event type ${event.type} is not related to payment intents or lacks metadata`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Failed to process webhook" });
    }
  });

  // Get payment status for a booking
  paymentRouter.get("/booking/:bookingId/payment-status", isAuthenticated, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      // Return payment status
      res.json({
        bookingId,
        paymentStatus: booking.paymentStatus || "unpaid",
        bookingStatus: booking.status,
        paymentIntentId: booking.paymentIntentId,
        totalAmount: booking.totalAmount
      });
    } catch (error) {
      console.error("Error getting payment status:", error);
      res.status(500).json({ error: "Failed to get payment status" });
    }
  });

  // Mount payment router
  apiRouter.use("/payments", paymentRouter);
  
  // Mount API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
