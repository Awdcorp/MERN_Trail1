// File: scripts/listCategoriesWithCounts.js
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

async function listCategoriesWithProductCounts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const categories = await Category.find({}, "name slug _id").lean();

    console.log("📚 Categories with Product Counts:\n");

    for (const cat of categories) {
      const productCount = await Product.countDocuments({
        categories: cat._id,
      });

      console.log(
        `- ${cat.name.padEnd(25)} | slug: ${cat.slug.padEnd(30)} | id: ${cat._id} | 🛒 ${productCount} products`
      );
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

listCategoriesWithProductCounts();
