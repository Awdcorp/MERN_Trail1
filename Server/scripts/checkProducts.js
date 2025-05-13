const mongoose = require("mongoose");

// === MongoDB connection string ===
const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";

// === Product Schema ===
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema);

// === Clear all products ===
async function clearAllProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Product.deleteMany({});
    console.log(`🧹 Deleted ${result.deletedCount} products`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error clearing products:", err);
    process.exit(1);
  }
}

clearAllProducts();
