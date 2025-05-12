require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");     // Adjust path if needed
const Category = require("../models/Category");   // Adjust path if needed
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;
async function getProductsByCategorySlug(slug) {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const category = await Category.findOne({ slug });

  if (!category) {
    console.error(`❌ No category found for slug: ${slug}`);
    process.exit(1);
  }

  console.log(`🔍 Searching products in category: ${category.name} (${category._id})`);

  const products = await Product.find({ categories: category._id })
    .select("title slug categories")
    .populate("categories", "name slug");

  console.log(`✅ Found ${products.length} product(s):\n`);
  products.forEach((product, i) => {
    console.log(`${i + 1}. ${product.title} [${product.slug}]`);
  });

  await mongoose.disconnect();
}

getProductsByCategorySlug("promate-accessories"); // 🔁 Change slug here
