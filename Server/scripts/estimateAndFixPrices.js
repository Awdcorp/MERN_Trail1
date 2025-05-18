const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model("Product", productSchema);

// Map: categoryId → [min, max] price
const categoryPriceMap = {
  "68233023e415c225f88b2900": [4999, 19999], // phone
  "68233023e415c225f88b2902": [5999, 22999], // samsung-phones
  "6823302be415c225f88b2908": [149, 599], // accessories
  "6823302be415c225f88b290a": [499, 1599], // promate-accessories
  "6823303ee415c225f88b2918": [499, 1499], // powerbank
  "68233049e415c225f88b2921": [399, 1299], // xiaomi-accessories
  "68233051e415c225f88b2929": [299, 1499], // earphones
  "68233059e415c225f88b2930": [699, 2499], // anker-accessories
  "6823305fe415c225f88b2936": [4999, 13999], // xiaomi
  "68233089e415c225f88b2954": [3999, 14999], // oppo
  "682330c7e415c225f88b297d": [399, 999], // samsung-accessories
  "682330dde415c225f88b298d": [3999, 14999], // huawei
  "682330e6e415c225f88b2995": [9999, 49999], // iphone
  "6823312de415c225f88b29c2": [6999, 29999], // samsung-tablets
  "6823312de415c225f88b29c4": [6999, 29999], // tablets
  "68233134e415c225f88b29ca": [8999, 49999], // iphone-tablets
  "68233195e415c225f88b2a07": [499, 1999], // apple-accessories
  "682331aee415c225f88b2a17": [1499, 8999], // samsung-watches
  "682331aee415c225f88b2a19": [1499, 8999], // watches
  "682331b3e415c225f88b2a1e": [2499, 9999], // apple-watches
};

function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function estimatePricesByCategory() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const products = await Product.find({
    $or: [
      { price: { $exists: false } },
      { price: null },
      { price: "" },
      { price: 0 },
      { price: "0" },
    ]
  });

  console.log(`🔍 Found ${products.length} products with missing/invalid prices`);

  for (const product of products) {
    const categoryIds = product.categories || [];

    // Match to first known category
    let estimatedPrice = null;
    for (const catId of categoryIds) {
      if (categoryPriceMap[catId]) {
        const [min, max] = categoryPriceMap[catId];
        estimatedPrice = getRandomPrice(min, max);
        break;
      }
    }

    if (!estimatedPrice) {
      estimatedPrice = getRandomPrice(399, 799); // fallback price
    }

    await Product.updateOne({ _id: product._id }, { $set: { price: estimatedPrice } });
    console.log(`💰 "${product.title}" set to ₹${estimatedPrice}`);
  }

  await mongoose.disconnect();
  console.log("✅ All prices estimated and updated.");
}

estimatePricesByCategory();
