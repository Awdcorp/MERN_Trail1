const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const { searchProducts } = require("../../controllers/admin/products-controller");
const mongoose = require("mongoose");


// ✅ TEMP DEBUG: GET populated products
router.get("/test-populated-products", async (req, res) => {
  try {
    console.log("🔍 [TEST] Fetching 5 populated products");
    const products = await Product.find().limit(5).populate("categories", "name slug");
    res.json(products);
  } catch (err) {
    console.error("❌ Error in test-populated-products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/slug/:slug
router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    console.log(`🔍 [SLUG] Looking for product with slug: ${slug}`);
    const product = await Product.findOne({ slug }).populate("categories", "name slug");

    if (!product) {
      console.warn(`⚠️ Product not found for slug: ${slug}`);
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("✅ [SLUG] Product found:", product.title);
    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching product by slug:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/category/:slug
router.get("/category/:slug", async (req, res) => {
  const { slug } = req.params;
  const limit = parseInt(req.query.limit) || 25;
  const skip = parseInt(req.query.skip) || 0;

  try {
    console.log(`🔍 [CATEGORY] Fetching category: ${slug}, skip=${skip}, limit=${limit}`);
    const category = await Category.findOne({ slug });

    if (!category) {
      console.warn(`⚠️ Category not found: ${slug}`);
      return res.status(404).json({ error: "Category not found" });
    }

    const products = await Product.find({ categories: category._id })
      .skip(skip)
      .limit(limit)
      .populate("categories", "name slug");

    console.log(`✅ [CATEGORY] Fetched ${products.length} products for category: ${category.name}`);
    res.json({ category: category.name, products });
  } catch (err) {
    console.error("❌ Error fetching category products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/by-external-ids?ids=5027,4380,5001
router.get("/by-external-ids", async (req, res) => {
  const idsParam = req.query.ids;
  const limit = parseInt(req.query.limit) || 10;

  if (!idsParam) {
    console.warn("⚠️ Missing ids parameter");
    return res.status(400).json({ error: "Missing ids parameter" });
  }

  const rawIds = idsParam.split(",").map((id) => id.trim());
  console.log("🔍 [BY-EXTERNAL-IDS] Raw IDs:", rawIds);

  try {
    const products = await Product.find({ externalId: { $in: rawIds } })
      .populate("categories", "name slug")
      .limit(limit);

    const foundIds = products.map((p) => p.externalId);
    const notFound = rawIds.filter((id) => !foundIds.includes(id));

    console.log(`✅ [BY-EXTERNAL-IDS] Found ${products.length} products`);
    console.log("📦 External IDs found:", foundIds);
    if (notFound.length > 0) {
      console.warn("⚠️ External IDs not found:", notFound);
    }

    res.json({ success: true, products });
  } catch (err) {
    console.error("❌ Error in /by-external-ids:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/products/by-ids?ids=<comma-separated-_ids>
router.get("/by-ids", async (req, res) => {
  const idsParam = req.query.ids;
  const limit = parseInt(req.query.limit) || 0;

  if (!idsParam) {
    return res.status(400).json({ error: "Missing ids parameter" });
  }

  let idArray;
  try {
    idArray = idsParam.split(",").map((id) => new mongoose.Types.ObjectId(id.trim()));
  } catch (err) {
    console.error("❌ Invalid ObjectId format:", err);
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    console.log(`🔍 [BY-IDS] Fetching ${idArray.length} products by _id`);
    let query = Product.find({ _id: { $in: idArray } }).populate("categories", "name slug");

    if (limit > 0) query = query.limit(limit);

    const products = await query.exec();
    console.log(`✅ [BY-IDS] Fetched ${products.length} products`);
    res.json({ products });
  } catch (err) {
    console.error("❌ Error fetching products by _id:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// GET /api/products
router.get("/", async (req, res) => {
  try {
    console.log("🔍 [ALL] Fetching all products");
    const products = await Product.find().populate("categories", "name slug");
    console.log(`✅ [ALL] Fetched ${products.length} products`);
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/search", searchProducts);
module.exports = router;
