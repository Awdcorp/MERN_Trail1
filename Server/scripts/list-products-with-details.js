const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// === MongoDB connection string ===
const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";

// === Define schemas ===
const productSchema = new mongoose.Schema({}, { strict: false });
const categorySchema = new mongoose.Schema({}, { strict: false });

const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);

// === Output log files ===
const logDir = path.join(__dirname, "logs");
const textLogFile = path.join(logDir, "product-list.txt");
const jsLogFile = path.join(logDir, "product-list.js");

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
fs.writeFileSync(textLogFile, "=== Product List with Categories and Related Products ===\n\n");

function logToTextFile(message) {
  fs.appendFileSync(textLogFile, message + "\n");
}

// 💾 Will collect minimal product info for JS export
const productExportList = [];

async function listProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const products = await Product.find().lean();
    const categories = await Category.find().lean();

    for (const product of products) {
      const title = product.title || "Untitled";
      const slug = product.slug || "(no slug)";
      const externalId = product.externalId || "(no externalId)";
      const mongoId = product._id.toString();

      // Get category names and IDs (optional for txt log)
      const productCategories = (product.categories || []).map(catId => {
        const found = categories.find(c => c._id.toString() === catId.toString());
        return found ? `${found.name} (${found._id})` : `(Unknown ${catId})`;
      });

      // Get related product titles and IDs (optional for txt log)
      const related = await Product.find({ externalId: { $in: product.relatedProductIds || [] } }).select("title externalId").lean();
      const relatedData = related.map(p => `${p.title} (extId: ${p.externalId})`);

      // 📋 TEXT log
      const output = [
        `🛒 Product: ${title}`,
        `🔎 Mongo ID: ${mongoId}`,
        `🆔 External ID: ${externalId}`,
        `🔗 Slug: ${slug}`,
        `💰 Price: AED ${product.price || "(no price)"}`,
        `🖼️ Image URL: ${product.image || "(no image)"}`,
        "------------------------------------------------------------\n"
      ].join("\n");

      console.log(output);
      logToTextFile(output);

      // 📋 JS log entry
      productExportList.push({
        _id: mongoId,
        title,
        price: product.price || 0,
        image: product.image || ""
      });
    }

    // Save to product-list.js
    const jsExport = `module.exports = ${JSON.stringify(productExportList, null, 2)};\n`;
    fs.writeFileSync(jsLogFile, jsExport, "utf-8");

    console.log(`✅ Done. Text output → ${textLogFile}`);
    console.log(`✅ Done. JS export   → ${jsLogFile}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

listProducts();
