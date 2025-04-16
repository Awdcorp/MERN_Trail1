require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

// 🎯 Replace these with WooCommerce product IDs
const WOO_PRODUCT_IDS = [
  1922, 1602, 1078, 1917, 1560,1518, 1053, 1608, 388, 1298
];

async function debugProductsByWooIds() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const products = await Product.find({ externalId: { $in: WOO_PRODUCT_IDS } })
      .populate("categories", "name slug")
      .lean();

    if (products.length === 0) {
      console.log("⚠️ No products found for these WooCommerce IDs.");
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

debugProductsByWooIds();
