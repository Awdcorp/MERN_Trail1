// File: scripts/migrate-product-status.js
const mongoose = require("mongoose");
const Product = require("../models/Product");

const MONGO_URI = "mongodb+srv://awdcorp:X7rTv4oBxwdhOof3@partyworld.pikltpa.mongodb.net/"; // update this

async function migrateStatus() {
  await mongoose.connect(MONGO_URI);

  const products = await Product.find({ status: { $exists: false }, isActive: { $exists: true } });

  for (const product of products) {
    product.status = product.isActive ? "published" : "draft";
    product.isActive = undefined;
    await product.save();
    console.log(`✔ Updated: ${product.title} → status: ${product.status}`);
  }

  console.log("✅ Migration complete.");
  process.exit();
}

migrateStatus().catch(console.error);
