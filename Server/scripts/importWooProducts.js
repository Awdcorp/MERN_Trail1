// File: Server/scripts/importWooProducts.js
require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product");
const Category = require("../models/Category");

const WOO_API_KEY = process.env.WOO_API_KEY;
const WOO_API_SECRET = process.env.WOO_API_SECRET;
const WOO_API_URL = "https://partyworld.ae/wp-json/wc/v3/products";
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!WOO_API_KEY || !WOO_API_SECRET || !MONGO_URI) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

async function fetchWooProducts(limit = 10) {
  try {
    const res = await axios.get(WOO_API_URL, {
      auth: { username: WOO_API_KEY, password: WOO_API_SECRET },
      params: { per_page: limit },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch WooCommerce products:", err.response?.data || err);
    process.exit(1);
  }
}

async function uploadImageToCloudinary(originalUrl) {
  try {
    const url = originalUrl.includes("i0.wp.com")
      ? originalUrl.replace("https://i0.wp.com/", "https://").split("?")[0]
      : originalUrl;

    const result = await cloudinary.uploader.upload(url, {
      folder: "partyworld/products",
    });
    return result.secure_url;
  } catch (err) {
    console.warn("⚠️ Failed to upload image to Cloudinary:", originalUrl);
    return null;
  }
}

async function importProducts() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const products = await fetchWooProducts();
  const allCategories = await Category.find().lean();
  const catMap = {};
  allCategories.forEach(cat => { catMap[cat.slug] = cat._id; });

  for (const wp of products) {
    const exists = await Product.findOne({ externalId: wp.id.toString() });
    if (exists) {
      console.log(`🔁 Skipped duplicate: ${wp.name}`);
      continue;
    }

    const categoryIds = wp.categories.map(c => catMap[c.slug]).filter(Boolean);
    const tagNames = wp.tags?.map(t => t.name) || [];

    const cloudImages = [];
    for (const img of wp.images) {
      const uploadedUrl = await uploadImageToCloudinary(img.src);
      if (uploadedUrl) cloudImages.push(uploadedUrl);
    }

    const product = new Product({
      title: wp.name,
      slug: wp.slug,
      description: wp.description || wp.short_description || "",
      categories: categoryIds,
      tags: tagNames,
      brand: wp.attributes?.find(a => a.name.toLowerCase() === "brand")?.options?.[0] || null,
      price: parseFloat(wp.regular_price || 0),
      salePrice: parseFloat(wp.sale_price || 0),
      images: cloudImages,
      totalStock: wp.stock_quantity || 0,
      externalId: wp.id.toString(),
    });

    await product.save();
    console.log(`✅ Imported: ${product.title}`);
  }

  console.log("🎉 Imported all products with Cloudinary images!");
  process.exit(0);
}

importProducts();
