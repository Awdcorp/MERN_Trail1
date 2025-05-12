require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

async function assignCategory() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected");

  const categorySlug = "promate-accessories";
  const productSlug = "promate-voltrip-uni";

  const category = await Category.findOne({ slug: categorySlug });
  if (!category) return console.error("❌ Category not found");

  const product = await Product.findOne({ slug: productSlug });
  if (!product) return console.error("❌ Product not found");

  if (!product.categories.map(id => id.toString()).includes(category._id.toString())) {
    product.categories.push(category._id);
    await product.save();
    console.log(`✅ Updated '${product.title}' with category '${category.name}'`);
  } else {
    console.log("⚠️ Product already has this category assigned.");
  }

  await mongoose.disconnect();
  console.log("🔌 Done");
}

assignCategory();
