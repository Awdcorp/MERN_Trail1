const mongoose = require("mongoose");
const puppeteer = require("puppeteer");

// === MongoDB Setup ===
const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema);

// === Flipkart Scraper ===
async function fetchPriceFromFlipkart(title) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(title)}`;
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

  // Try closing login popup if shown
  try {
    await page.waitForSelector('button._2KpZ6l._2doB4z', { timeout: 3000 });
    await page.click('button._2KpZ6l._2doB4z');
  } catch (err) {
    // no popup shown — continue
  }

  const price = await page.evaluate(() => {
    const el = document.querySelector("div._30jeq3._1_WHN1");
    if (!el) return null;
    return el.innerText.replace(/[₹,]/g, "").trim();
  });

  await browser.close();

  return price ? parseInt(price) : null;
}

// === Main Workflow ===
async function updateMissingPricesFromFlipkart() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const products = await Product.find({
    $or: [
      { price: { $exists: false } },
      { price: null },
      { price: "" },
      { price: 0 },
      { price: "0" }
    ]
  });

  console.log(`🔍 Found ${products.length} products with missing or invalid price`);

  for (const product of products) {
    const title = product.title || "Unknown Product";
    console.log(`🛒 Searching Flipkart for "${title}"...`);

    const price = await fetchPriceFromFlipkart(title);

    if (price) {
      await Product.updateOne({ _id: product._id }, { $set: { price } });
      console.log(`💸 Set price ₹${price} for "${title}"`);
    } else {
      console.log(`⚠️ No price found for "${title}"`);
    }
  }

  mongoose.disconnect();
  console.log("✅ Done updating prices");
}

updateMissingPricesFromFlipkart();
