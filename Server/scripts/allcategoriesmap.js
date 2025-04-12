require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

async function listCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const categories = await Category.find({}, "name slug _id").lean();

    console.log("📚 All Categories (name | slug | _id):\n");
    for (const cat of categories) {
      console.log(`- ${cat.name} | slug: ${cat.slug} | id: ${cat._id}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error connecting or fetching categories:", err);
    process.exit(1);
  }
}

listCategories();
