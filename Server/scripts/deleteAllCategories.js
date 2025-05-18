const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";
const categorySchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.model("Category", categorySchema);

async function deleteAllCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const result = await Category.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} categories`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from DB");
  } catch (err) {
    console.error("❌ Error deleting categories:", err);
  }
}

deleteAllCategories();
