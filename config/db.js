const mongoose = require("mongoose");

// Track the database connection status globally across serverless function invocations
let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse the existing connection instead of opening a new one
  if (isConnected) {
    console.log("Using existing database connection pool.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });

    // Update the state flag using Mongoose's internal state tracker (1 means connected)
    isConnected = conn.connections[0].readyState === 1;

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);

    // CRITICAL FOR VERCEL: Do NOT use process.exit(1) in a serverless environment.
    // Throwing the error lets Vercel gracefully handle the function fail-retry loop.
    throw error;
  }
};

module.exports = connectDB;
