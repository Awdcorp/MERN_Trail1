require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const slugify = require("slugify");

const Product = require("../models/Product");
const Category = require("../models/Category");

const WOO_API_URL = "https://partyworld.ae/wp-json/wc/v3/products";
const WOO_API_KEY = process.env.WOO_API_KEY;
const WOO_API_SECRET = process.env.WOO_API_SECRET;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === 🧠 UTILITIES ===
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
    console.warn("⚠️ Cloudinary Upload Failed:", originalUrl);
    return null;
  }
}

// === 🧲 MAIN FUNCTION ===
async function importSpecificUpsellProducts(wooProductIds = []) {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  for (const id of wooProductIds) {
    try {
      const res = await axios.get(`${WOO_API_URL}/${id}`, {
        auth: { username: WOO_API_KEY, password: WOO_API_SECRET },
      });

      const wp = res.data;
      const image = wp.images?.[0]?.src ? await uploadImageToCloudinary(wp.images[0].src) : null;
      const metaMap = Object.fromEntries(wp.meta_data.map((m) => [m.key, m.value]));
      const baseSlug = slugify(wp.name || `product-${wp.id}`, { lower: true, strict: true });

      const productData = {
        externalId: wp.id,
        title: wp.name,
        slug: baseSlug,
        description: wp.description || "",
        shortDescription: wp.short_description || "",

        sku: wp.sku || null,
        weight: wp.weight ? parseFloat(wp.weight) : null,
        isActive: wp.stock_status === "instock",
        isFeatured: wp.tags.some((tag) => tag.name.toLowerCase().includes("featured")),

        categories: [],
        tags: wp.tags.map((tag) => tag.name),
        brand: wp.attributes?.find(attr => attr.name.toLowerCase() === "brand")?.options?.[0] || null,

        price: parseFloat(wp.regular_price || "0"),
        salePrice: parseFloat(wp.sale_price || "0"),
        totalStock: wp.manage_stock ? wp.stock_quantity || 0 : 9999,

        images: image ? [image] : [],
        variants: [],
        attributes: wp.attributes?.map(attr => ({ name: attr.name, options: attr.options })) || [],
        upsellProductIds: wp.upsell_ids || [],
        relatedProductIds: wp.related_ids || [],

        seo: {
          metaTitle: metaMap["rank_math_title"] || "",
          metaDescription: metaMap["rank_math_description"] || "",
          focusKeyword: metaMap["rank_math_focus_keyword"] || "",
        },

        meta: wp.meta_data || [],
      };

      const savedProduct = await Product.findOneAndUpdate(
        { externalId: wp.id },
        { $set: productData },
        { new: true, upsert: true }
      );

      console.log(`✅ Imported: ${savedProduct.title}`);
    } catch (err) {
      console.error(`❌ Failed to import product ${id}:`, err.response?.data || err.message);
    }
  }

  console.log("🎉 Done importing specific upsell products");
  process.exit(0);
}

// === 🔢 REPLACE THESE IDs ===
const upsellWooIds = [
  287, 414, 386, 291, 247
];

importSpecificUpsellProducts(upsellWooIds);
