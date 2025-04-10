require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

async function testQuery() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const categoryIds = [
    new mongoose.Types.ObjectId("67f7d19ad107819e6545488e"),
    new mongoose.Types.ObjectId("67f7d19cd107819e654548e2")
  ];

  const products = await Product.find({
    categories: { $in: categoryIds }
  }).limit(5).lean();

  console.log("🔍 Products found:", products.length);
  products.forEach((p, i) => {
    console.log(`\n#${i + 1}: ${p.title}`);
    console.log("Categories:", p.categories);
  });

  process.exit(0);
}

testQuery();
