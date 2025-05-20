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

    console.log("📦 Fetched", res.data.length, "categories from WooCommerce");
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
    const wcIdToMongoId = {};

    // Step 1: Create or update categories WITHOUT parents
    for (const wcCat of wooCategories) {
      let category = await Category.findOne({ wooId: wcCat.id }) || await Category.findOne({ slug: wcCat.slug });

      if (!category) {
        try {
          category = new Category({
            name: wcCat.name,
            slug: wcCat.slug,
            wooId: wcCat.id,
            description: wcCat.description || "",
            image: wcCat.image?.src || "",
          });
          await category.save();
          console.log(`✅ Created: ${category.name}`);
        } catch (err) {
          if (err.code === 11000) {
            console.warn(`⚠️ Duplicate slug: ${wcCat.slug}. Skipping...`);
            const existing = await Category.findOne({ slug: wcCat.slug });
            if (existing) category = existing;
          } else {
            throw err;
          }
        }
      } else {
        // Update existing values
        category.name = wcCat.name;
        category.slug = wcCat.slug;
        category.description = wcCat.description || "";
        category.image = wcCat.image?.src || "";
        category.wooId = wcCat.id;
        await category.save();
        console.log(`♻️ Updated: ${category.name}`);
      }

      wcIdToMongoId[wcCat.id] = category._id;
    }

    // Step 2: Link parents now that all categories exist
    for (const wcCat of wooCategories) {
      if (wcCat.parent !== 0) {
        const category = await Category.findOne({ wooId: wcCat.id });
        const parentMongoId = wcIdToMongoId[wcCat.parent];

        if (!category) {
          console.warn(`⚠️ Category not found (wooId=${wcCat.id}): ${wcCat.name}`);
          continue;
        }
        if (!parentMongoId) {
          console.warn(`⚠️ Parent not found for: ${wcCat.name} (Woo parent ID: ${wcCat.parent})`);
          continue;
        }

        category.parent = parentMongoId;
        await category.save();
        console.log(`🔗 Linked ${category.name} → parent`);
      }
    }

    const count = await Category.countDocuments();
    console.log(`🎉 Done. Total categories in DB: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error in importCategories():", err);
    process.exit(1);
  }
}

importCategories();
