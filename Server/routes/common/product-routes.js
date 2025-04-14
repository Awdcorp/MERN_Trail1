// File: Server/routes/common/product-routes.js

const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const Category = require("../../models/Category");

// ✅ TEMP DEBUG: GET populated products
router.get("/test-populated-products", async (req, res) => {
  try {
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
      const product = await Product.findOne({ slug }).populate("categories", "name slug");
  
      if (!product) return res.status(404).json({ error: "Product not found" });
  
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
      const category = await Category.findOne({ slug });
      if (!category) return res.status(404).json({ error: "Category not found" });
  
      const products = await Product.find({ categories: category._id })
        .skip(skip)
        .limit(limit)
        .populate("categories", "name slug");
  
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
      let query = Product.find({ externalId: { $in: idArray } }).populate("categories", "name slug");
  
      if (limit > 0) {
        query = query.limit(limit);
      }
  
      const products = await query.exec();
      res.json({ products });
    } catch (err) {
      console.error("❌ Error fetching multiple products by externalId:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("categories", "name slug");
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
