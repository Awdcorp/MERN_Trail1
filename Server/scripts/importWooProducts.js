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

async function fetchWooProducts(limit = 25) {
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

async function findOrCreateCategory(wpCategory, allCats, parent = null) {
  let existing = allCats.find((c) =>
    c.slug === wpCategory.slug || c.name.toLowerCase() === wpCategory.name.toLowerCase()
  );
  if (existing) return existing;

  const newCat = await Category.create({
    name: wpCategory.name,
    slug: wpCategory.slug,
    parent: parent ? parent._id : null,
  });

  allCats.push(newCat);
  return newCat;
}

async function getFullCategoryChain(wpCat, wpAllCats, dbAllCats) {
  const chain = [];
  let currentCat = wpCat;
  let parentCat = null;

  while (currentCat) {
    const dbCat = await findOrCreateCategory(currentCat, dbAllCats, parentCat);
    chain.unshift(dbCat);

    if (currentCat.parent) {
      currentCat = wpAllCats.find((c) => c.id === currentCat.parent);
      parentCat = dbCat;
    } else {
      currentCat = null;
    }
  }

  return chain;
}

async function importProducts() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const wpProducts = await fetchWooProducts(100);
  const wpAllCategories = (await axios.get("https://partyworld.ae/wp-json/wc/v3/products/categories", {
    auth: { username: WOO_API_KEY, password: WOO_API_SECRET },
  })).data;

  const dbAllCategories = await Category.find().lean();

  for (const wp of wpProducts) {
    const baseSlug = slugify(wp.name || `product-${wp.id}`, { lower: true, strict: true });

    const categoryIds = new Set();
    for (const wpCat of wp.categories || []) {
      const chain = await getFullCategoryChain(wpCat, wpAllCategories, dbAllCategories);
      chain.forEach((cat) => categoryIds.add(cat._id.toString()));
    }

    const image = wp.images?.[0]?.src ? await uploadImageToCloudinary(wp.images[0].src) : null;

    const metaMap = Object.fromEntries(wp.meta_data.map((m) => [m.key, m.value]));

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

      categories: Array.from(categoryIds),
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

    const updatedOrInserted = await Product.findOneAndUpdate(
      { $or: [{ externalId: wp.id }, { slug: baseSlug }] },
      { $set: productData },
      { new: true, upsert: true }
    );

    console.log(`✅ Updated or Inserted: ${updatedOrInserted.title}`);
  }

  console.log("🎉 Import complete.");
  process.exit(0);
}

importProducts();
