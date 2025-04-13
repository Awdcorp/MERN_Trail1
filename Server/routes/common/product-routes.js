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
    const { color, gender, ageGroup, theme, occasion, sort, limit, offset } = req.query;
  
    try {
      const category = await Category.findOne({ slug });
      if (!category) return res.status(404).json({ error: "Category not found" });
  
      const query = { categories: category._id };
  
      // Apply filters
      if (color) {
        query["attributes.color"] = { $in: color.split(",") };
      }
      if (gender) {
        query["attributes.gender"] = { $in: gender.split(",") };
      }
      if (ageGroup) {
        query["attributes.ageGroup"] = { $in: ageGroup.split(",") };
      }
      if (theme) {
        query["attributes.theme"] = { $in: theme.split(",") };
      }
      if (occasion) {
        query["attributes.occasion"] = { $in: occasion.split(",") };
      }
  
      let productsQuery = Product.find(query).populate("categories", "name slug");
  
      // Apply sorting
      if (sort === "price-lowtohigh") {
        productsQuery = productsQuery.sort({ price: 1 });
      } else if (sort === "price-hightolow") {
        productsQuery = productsQuery.sort({ price: -1 });
      } else if (sort === "newest") {
        productsQuery = productsQuery.sort({ createdAt: -1 });
      }
  
      // Pagination
      if (limit) {
        productsQuery = productsQuery.limit(parseInt(limit)).skip(parseInt(offset || 0));
      }
  
      const products = await productsQuery;
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
