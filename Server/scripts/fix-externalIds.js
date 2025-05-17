// File: scripts/normalize-externalIds.js
require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URL || "mongodb://localhost:27017/yourdbname";

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema);

async function normalizeExternalIds() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const productsWithStringIds = await Product.find({ externalId: { $type: "string" } }).lean();
    if (!productsWithStringIds.length) {
      console.log("✅ All products already have numeric externalId");
      return;
    }

    console.log(`🔍 Found ${productsWithStringIds.length} products with string externalId`);
    for (const p of productsWithStringIds) {
      const newVal = parseInt(p.externalId, 10);
      if (!isNaN(newVal)) {
        await Product.updateOne(
          { _id: p._id },
          { $set: { externalId: newVal } }
        );
        console.log(`✅ Converted externalId of ${p.title} to number: ${newVal}`);
      } else {
        console.warn(`⚠️ Skipping invalid externalId for ${p.title}: ${p.externalId}`);
      }
    }

    console.log("🎉 Normalization complete.");
  } catch (err) {
    console.error("❌ Error during normalization:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

normalizeExternalIds();
