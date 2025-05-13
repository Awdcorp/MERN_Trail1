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

// === Output log file ===
const logDir = path.join(__dirname, "logs");
const logFile = path.join(logDir, "product-list.txt");

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
fs.writeFileSync(logFile, "=== Product List with Categories and Related Products ===\n\n");

function logToFile(message) {
  fs.appendFileSync(logFile, message + "\n");
}

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

      // Get category names and IDs
      const productCategories = (product.categories || []).map(catId => {
        const found = categories.find(c => c._id.toString() === catId.toString());
        return found ? `${found.name} (${found._id})` : `(Unknown ${catId})`;
      });

      // Get related product titles and IDs
      const related = await Product.find({ externalId: { $in: product.relatedProductIds || [] } }).select("title externalId").lean();
      const relatedData = related.map(p => `${p.title} (extId: ${p.externalId})`);

      const output = [
        `🛒 Product: ${title}`,
        `🔎 Mongo ID: ${mongoId}`,
        `🆔 External ID: ${externalId}`,
        `🔗 Slug: ${slug}`,
        `🏷️ Categories: ${productCategories.join(", ") || "(none)"}`,
        `🤝 Related Products: ${relatedData.join(", ") || "(none)"}`,
        "------------------------------------------------------------\n"
      ].join("\n");

      console.log(output);
      logToFile(output);
    }

    console.log(`✅ Done. Output written to ${logFile}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

listProducts();
