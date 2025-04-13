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
