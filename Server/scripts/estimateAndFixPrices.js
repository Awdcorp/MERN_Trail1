import mongoose from "mongoose";
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config(); // loads OPENAI_API_KEY from .env

// ✅ OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ MongoDB setup
const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema);

// 🧠 Ask GPT to estimate AED price
async function estimatePriceFromAI(product) {
  const prompt = `
Estimate a realistic retail price in AED for the following product:

Title: ${product.title || "N/A"}
Brand: ${product.brand || "Unknown"}
Category: ${product.categories?.[0] || "Unknown"}
Description: ${product.description || "No description"}

Respond with only the number. No currency symbol or extra text.
  `.trim();

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const reply = res.choices[0].message.content.trim();
  const price = parseFloat(reply.replace(/[^\d.]/g, ""));
  return isNaN(price) ? null : Math.round(price);
}

// 🔁 Update price for all products
async function updatePricesWithAI() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const products = await Product.find({});
  console.log(`🧠 Updating ${products.length} products using GPT...`);

  for (const product of products) {
    try {
      const aiPrice = await estimatePriceFromAI(product);
      if (!aiPrice) {
        console.warn(`⚠️ Skipped: "${product.title}" → Invalid price`);
        continue;
      }

      const oldPrice = product.price || "N/A";
      await Product.updateOne({ _id: product._id }, { $set: { price: aiPrice } });
      console.log(`✅ "${product.title}" | Old: ${oldPrice} → New: AED ${aiPrice}`);
    } catch (err) {
      console.error(`❌ Error for "${product.title}":`, err.message);
    }
  }

  await mongoose.disconnect();
  console.log("🎉 Done! All prices updated.");
}

updatePricesWithAI();
