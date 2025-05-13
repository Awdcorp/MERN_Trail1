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

// GET /api/products/multiple?ids=31612,31613,31626&limit=5
router.get("/multiple", async (req, res) => {
  const idsParam = req.query.ids;
  const limit = parseInt(req.query.limit) || 0;

  if (!idsParam) {
    return res.status(400).json({ error: "Missing ids parameter" });
  }

  const idArray = idsParam.split(",").map((id) => id.trim());

  try {
    console.log(`🔍 [MULTIPLE] Fetching ${idArray.length} products by externalId, limit=${limit}`);
    let query = Product.find({ externalId: { $in: idArray } }).populate("categories", "name slug");

    if (limit > 0) {
      query = query.limit(limit);
    }

    const products = await query.exec();
    console.log(`✅ [MULTIPLE] Fetched ${products.length} products`);
    res.json({ products });
  } catch (err) {
    console.error("❌ Error fetching multiple products by externalId:", err);
    res.status(500).json({ error: "Server error" });
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
