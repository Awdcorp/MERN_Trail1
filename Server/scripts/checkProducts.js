// File: scripts/delete-all-categories.js

require("dotenv").config();
const mongoose = require("mongoose");

// Import your Category model
const Category = require("../models/Category");

// MongoDB URI from .env or hardcoded
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/your-database-name";

async function deleteAllCategories() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const result = await Category.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} categories.`);

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error deleting categories:", err);
    process.exit(1);
  }
}

deleteAllCategories();
