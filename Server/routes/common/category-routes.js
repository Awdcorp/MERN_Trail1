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

// GET /api/categories/flat-with-path
router.get("/flat-with-path", async (req, res) => {
  try {
    console.log("📦 [Category API] Fetching all categories...");
    const categories = await Category.find().lean();

    console.log(`📊 Total categories fetched: ${categories.length}`);

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[String(cat._id)] = cat;
    });

    console.log("🧭 Category map constructed.");

    const buildPath = (cat) => {
      const names = [cat.name];
      let current = cat;
      let depth = 0;

      while (current.parent) {
        const parent = categoryMap[String(current.parent)];
        if (!parent) {
          console.warn(`⚠️ Missing parent for category: ${current.name} (${current._id})`);
          break;
        }
        names.unshift(parent.name);
        current = parent;
        depth++;
      }

      const path = names.join(" > ");
      console.log(`🔗 Path built: ${path}`);
      return path;
    };

    const result = categories.map(cat => {
      const label = buildPath(cat);
      return {
        value: cat._id,
        label,
      };
    });

    console.log("✅ Final flat category list with path built.");
    res.json(result);
  } catch (err) {
    console.error("❌ Error in flat-with-path category fetch:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
