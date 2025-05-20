require("dotenv").config();
const mongoose = require("mongoose");

// 👉 Adjust this if your model path is different
const Category = require("../models/Category");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;

async function buildCategoryTree() {
  const all = await Category.find().lean();

  const categoryMap = new Map();
  const root = [];

  // Map all categories
  all.forEach((cat) => {
    cat.children = [];
    categoryMap.set(cat._id.toString(), cat);
  });

  // Organize into tree
  all.forEach((cat) => {
    if (cat.parent) {
      const parent = categoryMap.get(cat.parent.toString());
      if (parent) parent.children.push(cat);
    } else {
      root.push(cat);
    }
  });

  return root;
}

function printTree(nodes, depth = 0) {
  for (const node of nodes) {
    console.log("  ".repeat(depth) + "- " + node.name);
    if (node.children.length) printTree(node.children, depth + 1);
  }
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const tree = await buildCategoryTree();
  console.log("📦 Category Tree:");
  printTree(tree);

  process.exit(0);
}

main();
