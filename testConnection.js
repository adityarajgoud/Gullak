require("dotenv").config();

const mongoose = require("mongoose");

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");

    // Optional: show DB name
    console.log("Database:", mongoose.connection.name);

    process.exit(0);
  } catch (error) {
    console.log("❌ Connection Failed");
    console.error(error);

    process.exit(1);
  }
}

testConnection();
