// ✅ Backend: New route to get products by category slug
// File: Server/routes/common/product-routes.js (append this)

const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const Category = require("../../models/Category");

// GET /api/products/category/:slug
router.get("/category/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ error: "Category not found" });

    const products = await Product.find({ categories: category._id });
    res.json({ category: category.name, products });
  } catch (err) {
    console.error("❌ Error fetching category products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
