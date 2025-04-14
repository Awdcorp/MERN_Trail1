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
    .limit(15)
    .lean();

  for (const product of products) {
    console.log("🛍️  Product:", product.title);
    console.log("🔗 Slug:", product.slug);
    console.log("🏷️  Brand:", product.brand || "—");
    console.log("💰 Price:", product.price, "| Sale:", product.salePrice || "—");
    console.log("📦 Stock:", product.totalStock ?? "N/A");
    console.log("🏷️  Tags:", product.tags?.join(", ") || "None");

    console.log("🗂️  Categories:");
    product.categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log("🧲 Upsells:", (product.upsellProductIds?.length ? product.upsellProductIds.join(", ") : "None"));
    console.log("🧩 Related:", (product.relatedProductIds?.length ? product.relatedProductIds.join(", ") : "None"));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }

  process.exit(0);
}

debugProducts();
