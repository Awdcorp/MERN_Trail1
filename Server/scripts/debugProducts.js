require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

// 🏷️ Change this to the category slug you want to search for
const CATEGORY_SLUG = "baby"; // example slug

async function debugProductsByCategory() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // 1. Find category by slug
    const category = await Category.findOne({ slug: CATEGORY_SLUG }).lean();
    if (!category) {
      console.error(`❌ Category with slug "${CATEGORY_SLUG}" not found`);
      return process.exit(1);
    }

    console.log(`🔎 Found Category: ${category.name} (slug: ${category.slug}, id: ${category._id})\n`);

    // 2. Fetch products in that category
    const products = await Product.find({ categories: category._id })
      .populate("categories", "name slug")
      .limit(15)
      .lean();

    if (products.length === 0) {
      console.log("⚠️ No products found in this category.");
    }

    for (const product of products) {
      console.log("🛍️  Product:", product.title);
      console.log("🖼️  Image:", product.images || "—");
      console.log("🔗 Slug:", product.slug);
      console.log("🏷️  Brand:", product.brand || "—");
      console.log("💰 Price:", product.price, "| Sale:", product.salePrice || "—");
      console.log("📦 Stock:", product.totalStock ?? "N/A");
      console.log("🏷️  Tags:", product.tags?.join(", ") || "None");

      console.log("🗂️  Categories:");
      product.categories.forEach((cat) => {
        console.log(`   - ${cat.name} (${cat.slug})`);
      });

      console.log("🧲 Upsells:", product.upsellProductIds?.join(", ") || "None");
      console.log("🧩 Related:", product.relatedProductIds?.join(", ") || "None");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Script error:", err);
    process.exit(1);
  }
}

debugProductsByCategory();
