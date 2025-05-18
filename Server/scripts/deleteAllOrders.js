// scripts/deleteAllOrders.js

const mongoose = require("mongoose");
require("dotenv").config(); // optional: if using .env for DB credentials

// ✅ Replace with your actual Order model path
const Order = require("../models/Order");

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/your-db-name";

async function deleteOrders() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔌 Connected to MongoDB");

    const result = await Order.deleteMany({});
    console.log(`🧹 Deleted ${result.deletedCount} orders from the database.`);

    await mongoose.disconnect();
    console.log("🚪 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error deleting orders:", error);
    process.exit(1);
  }
}

deleteOrders();
