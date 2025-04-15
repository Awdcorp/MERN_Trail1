const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");

// routes/common/category-routes.js
router.get("/", async (req, res) => {
  try {
    console.log("🔍 [CATEGORY TREE] Fetching all categories");
    const categories = await Category.find().lean();
    console.log(`📦 [CATEGORY TREE] Total categories fetched: ${categories.length}`);

    const categoryMap = {};

    // Step 1: Index categories by _id
    categories.forEach(cat => {
      categoryMap[cat._id] = { ...cat, children: [] };
    });

    // Step 2: Build parent-child relationships
    const rootCategories = [];

    categories.forEach(cat => {
      if (cat.parent) {
        const parentId = cat.parent.toString();
        categoryMap[parentId]?.children.push(categoryMap[cat._id]);
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    console.log(`🌳 [CATEGORY TREE] Root categories: ${rootCategories.length}`);
    res.json(rootCategories); // only top-level categories with nested children
  } catch (err) {
    console.error("❌ Error fetching nested categories:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
