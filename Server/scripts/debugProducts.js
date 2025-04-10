require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

async function debugProducts() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const products = await Product.find()
    .populate("categories", "name slug")
    .limit(5)
    .lean();

  for (const product of products) {
    console.log("📦", product.title);
    console.log("Categories:", product.categories);
    console.log("Slug:", product.slug);
    console.log("Tags:", product.tags);
    console.log("Brand:", product.brand);
    console.log("---------\n");
  }

  process.exit(0);
}

debugProducts();
