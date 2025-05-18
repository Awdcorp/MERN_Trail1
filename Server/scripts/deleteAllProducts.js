const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema);

async function deleteAllProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Product.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} products`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from DB");
  } catch (err) {
    console.error("❌ Error deleting products:", err);
  }
}

deleteAllProducts();
