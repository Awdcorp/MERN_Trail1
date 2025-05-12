require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/yourdbname";

// 👇 Provide the list of product slugs
const slugsToFind = ["promate-voltrip-uni"];

// ✅ Define Product and Category Schemas
const productSchema = new mongoose.Schema({
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
}, { strict: false });

const categorySchema = new mongoose.Schema({}, { strict: false });

const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);

async function getProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const products = await Product.find({ slug: { $in: slugsToFind } })
      .populate("categories", "name slug") // ✅ populate full category info
      .lean();

    const formatted = products.map((product) => ({
      _id: product._id.toString(),
      title: product.title || "",
      slug: product.slug || "",
      isActive: product.isActive,
      categories: (product.categories || []).map((cat) => ({
        _id: cat._id?.toString?.(),
        name: cat.name,
        slug: cat.slug,
      })),
      price: product.price || 0,
      salePrice: product.salePrice || null,
      stock: product.totalStock || 0,
    }));

    // ✅ Log to console
    console.log("🔍 Retrieved Products:\n");
    console.log(JSON.stringify(formatted, null, 2));

    // Optional: Write to file
    fs.writeFileSync("output-products-with-categories.json", JSON.stringify(formatted, null, 2));
    console.log("\n💾 Saved to output-products-with-categories.json");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

getProducts();
