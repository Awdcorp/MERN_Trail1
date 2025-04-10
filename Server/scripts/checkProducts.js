require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product"); // Adjust path if needed

async function viewAllProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const products = await Product.find().limit(10).lean();

    products.forEach((p, i) => {
      console.log(`\n🔹 Product #${i + 1} - ${p.title}`);
      console.log("------------------------------------------------------------");
      console.dir(p, { depth: null, colors: true });
    });

    console.log(`\n✅ Total products displayed: ${products.length}`);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

viewAllProducts();
