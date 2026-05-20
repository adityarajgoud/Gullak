const mongoose = require("mongoose");

const connectDB = async () => {
  // Check internal readyState: 1 = Connected, 2 = Connecting
  if (mongoose.connection.readyState === 1) {
    console.log("Using existing active database connection.");
    return;
  }

  // If a connection initialization is already in progress, await it instead of starting a new pool loop
  if (mongoose.connection.readyState === 2) {
    console.log(
      "Database connection initialization in progress. Awaiting socket opening...",
    );
    await new Promise((resolve) => {
      const checkState = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(checkState);
          resolve();
        }
      }, 50);
    });
    return;
  }

  try {
    console.log("Initializing a fresh MongoDB connection pool...");

    // Configure optimized connection limits for serverless runtimes
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Drop out after 5 seconds if cluster is unreachable
      maxPoolSize: 5, // Keep connection overhead low per serverless container lambda
      connectTimeoutMS: 10000, // Give the network handshake 10 full seconds to open sockets
    });

    console.log(
      `MongoDB Socket Opened Successfully to Host: ${mongoose.connection.host}`,
    );
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);

    // CRITICAL FOR VERCEL: Throw instead of process.exit(1) so the platform can handle failures gracefully
    throw error;
  }
};

module.exports = connectDB;
