// scripts/importWooCategories.js
console.log("📁 Current script path:", __dirname);
console.log("📁 Resolved model path:", require.resolve("../models/Category"));

require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const Category = require("../models/Category");

const WOO_API_BASE = "https://partyworld.ae/wp-json/wc/v3/products/categories";
const WOO_API_KEY = process.env.WOO_API_KEY;
const WOO_API_SECRET = process.env.WOO_API_SECRET;
const MONGO_URL = process.env.MONGO_URL;

if (!WOO_API_KEY || !WOO_API_SECRET || !MONGO_URL) {
  console.error("❌ Missing environment variables. Check your .env file.");
  process.exit(1);
}

async function fetchWooCategories() {
    try {
      const res = await axios.get(WOO_API_BASE, {
        auth: {
          username: WOO_API_KEY,
          password: WOO_API_SECRET,
        },
        params: {
          per_page: 100,
        },
      });
  
      console.log("🔎 Sample Woo item:", res.data[0]); // <-- ADD THIS
      return res.data;
    } catch (err) {
      console.error("❌ Failed to fetch from WooCommerce API:");
      console.error(err.response?.data || err.message);
      process.exit(1);
    }
  }

async function importCategories() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const wooCategories = await fetchWooCategories();
    console.log(`📦 Fetched ${wooCategories.length} categories from WooCommerce`);

    const wcIdToMongoId = {};

    for (const wcCat of wooCategories) {
      console.log(`➡ Importing: ${wcCat.name}`);
      console.log("📦 Category type:", typeof Category);
      console.log("📦 Category object preview:", Category);
      // Check if this category already exists by name
let existing = await Category.findOne({ name: wcCat.name });

if (!existing) {
  const category = new Category({
    name: wcCat.name,
    slug: wcCat.slug,
    description: wcCat.description || "",
    image: wcCat.image?.src || "",
  });

  await category.save();
  wcIdToMongoId[wcCat.id] = category._id;
  console.log(`✅ Saved new category: ${wcCat.name}`);
} else {
  wcIdToMongoId[wcCat.id] = existing._id;
  console.log(`🔁 Skipped duplicate: ${wcCat.name}`);
}

    }

    for (const wcCat of wooCategories) {
        if (wcCat.parent !== 0) {
          const category = await Category.findOne({ slug: wcCat.slug });
      
          if (!category) {
            console.warn(`⚠️ Category not found by slug: ${wcCat.slug}`);
            continue;
          }
      
          const parentId = wcIdToMongoId[wcCat.parent];
          if (!parentId) {
            console.warn(`⚠️ Parent ID not mapped for Woo ID: ${wcCat.parent}`);
            continue;
          }
      
          category.parent = parentId;
          await category.save();
          console.log(`🔗 Linked "${category.name}" → parent`);
        }
      }
      

    console.log("🎉 All WooCommerce categories imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error in importCategories():", err);
    process.exit(1);
  }
}

importCategories();
