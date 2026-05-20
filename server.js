const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // Imported to manage global configuration flags
const morgan = require("morgan"); // HTTP request logger middleware
const rateLimit = require("express-rate-limit"); // Basic rate-limiting middleware
const connectDB = require("./config/db");
const { swaggerUi, swaggerSpec } = require("./utils/swagger");
const { errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// CRITICAL FOR SERVERLESS: Stops Mongoose from buffering queries before the connection is active.
mongoose.set("bufferCommands", false);

const app = express();

// CRITICAL FOR VERCEL DEPLOYMENT: Tell Express to trust Vercel's proxy headers.
// This resolves the ERR_ERL_UNEXPECTED_X_FORWARDED_FOR validation crash!
app.set("trust proxy", 1);

// 1. Request / Response Logging (Good to Have Requirement)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Concise, color-coded dev logs in terminal
} else {
  app.use(morgan("combined")); // Standard Apache style logs for production logs
}

// 2. Auth Endpoint Protection (Good to Have Requirement)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 100, // Limit each IP address to 100 requests per window
  message: {
    status: "error",
    message:
      "Too many authentication attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Standard Global Middlewares
app.use(cors());
app.use(express.json());

// CRITICAL SERVERLESS GUARD: Intercepts requests and ensures database connectivity
// is fully ready before routing traffic to endpoints
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log("Database not ready yet. Awaiting active connection socket...");
    try {
      await connectDB(); // Forces the current execution thread to wait for the handshake
      next();
    } catch (err) {
      next(err); // Pass connection errors cleanly down to the centralized errorHandler
    }
  } else {
    next();
  }
});

// Apply rate limiting exclusively to security-critical Auth routes
app.use("/api/v1/auth", authLimiter);

// Swagger Documentation Route (Force asset delivery via public CDNs for Serverless Vercel)
const CDN_URLS = {
  customCssUrl: "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css",
  customJs: [
    "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js",
    "https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js",
  ],
};

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, CDN_URLS));

// Base Route
app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to the Expense Tracker API. Access documentation at /docs",
  });
});

// Import and Register Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/transactions", require("./routes/transactionRoutes"));
app.use("/api/v1/categories", require("./routes/categoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));

// Centralized Error Handling Middleware (Catches errors, screens out stack traces in prod)
app.use(errorHandler);

// Establish connection to the cloud database cluster
connectDB();

// CRITICAL FOR VERCEL DEPLOYMENT: Export the app module
module.exports = app;

// Local fallback port execution listener (Only runs if NOT in production)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally in development mode on port ${PORT}`);
  });
}
