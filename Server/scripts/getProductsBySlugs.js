require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/yourdbname";

// 👇 Provide the list of product slugs
const slugsToFind = ["samsung-galaxy-s20-plus-4g"];

const productSchema = new mongoose.Schema({
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
}, { strict: false });

const categorySchema = new mongoose.Schema({}, { strict: false });

const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);

async function getProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const products = await Product.find({ slug: { $in: slugsToFind } })
      .populate("categories", "name slug") // include name and slug of each category
      .lean();

    if (products.length === 0) {
      console.warn("⚠️ No products found for slugs:", slugsToFind);
    }

    // Save all full product objects
    const fileName = "full-products-with-categories.json";
    fs.writeFileSync(fileName, JSON.stringify(products, null, 2));
    console.log(`\n💾 Saved all product details to ${fileName}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

getProducts();
