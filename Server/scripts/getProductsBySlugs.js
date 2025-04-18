require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/yourdbname";

// 👇 Provide the list of slugs you want to fetch
const slugsToFind = [
    "magical-unicorn-foil-balloon-selfie-frame-66-x-68-cm-party-decoration-copy",
    "enchanted-unicorn-supershape-foil-balloon-83x73cm-magical-party-decoration",
    "time-to-be-a-unicorn-pink-foil-balloon-magical-birthday-party-balloon-for-girls",
    "magical-unicorn-head-foil-balloon-enchanting-party-decor",
    "3d-stand-alone-unicorn-foil-balloon-magical-party-decoration",
    "despicable-me-party-balloon-bouquet-5pcs",
    "blush-wedding-ring-super-shape-balloon",
    "blush-wedding-foil-balloon",
    "mermaid-wishes-and-kisses-foil-balloon-45cm",
    "mermaid-wishes-clear-orbz-foil-balloon",
    "transformers-animated-square-foil-balloon-18in",
    "finding-dory-square-foil-balloon",
    "pi-masks-airwalker-balloon",
    "baby-shark-airwalker-balloon",
    "paw-patrol-happy-birthday-square-balloon-18in"
  ];
  
  

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema);

async function getProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const products = await Product.find({ slug: { $in: slugsToFind } }).lean();

    const formatted = products.map((product) => ({
      _id: product._id.toString(),
      title: product.title || "",
      images: product.images || [],
      price: product.price || 0,
      salePrice: product.salePrice || null,
      slug: product.slug || "",
      totalStock: product.totalStock || 0,
    }));

    // ✅ Print to console
    console.log("🔍 Retrieved Products:\n");
    console.log(JSON.stringify(formatted, null, 2));

    // Optional: Write to file
    fs.writeFileSync("output-unicornProducts.json", JSON.stringify(formatted, null, 2));
    console.log("\n💾 Saved to output-unicornProducts.json");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

getProducts();
