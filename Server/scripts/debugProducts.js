const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://awdheshjha0922:n1qdFe2yDJEls7H7@cluster0.01ei4iy.mongodb.net/";

const productSchema = new mongoose.Schema({}, { strict: false });
const categorySchema = new mongoose.Schema({}, { strict: false });

const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);

const externalId = process.argv[2]; // Pass WooCommerce ID in CLI argument

if (!externalId) {
  console.error("❌ Please provide a product externalId as argument.");
  process.exit(1);
}

async function showProductDetails() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const product = await Product.findOne({ externalId: Number(externalId) }).lean();
  if (!product) {
    console.log(`❌ No product found with externalId: ${externalId}`);
    return;
  }

  console.log(`\n🛒 Product: ${product.title}`);
  console.log(`🔎 Mongo ID: ${product._id}`);
  console.log(`🆔 External ID: ${product.externalId}`);
  console.log(`🔗 Slug: ${product.slug}`);
  console.log(`🏷️ Tags: ${product.tags?.join(", ")}`);
  console.log(`💰 Price: ${product.price} | Sale Price: ${product.salePrice}`);
  console.log(`📦 Stock: ${product.totalStock}`);
  console.log(`🛠️ Brand: ${product.brand}`);
  console.log(`🖼️ Image: ${product.images?.[0] || "No image"}`);

  // Categories
  if (product.categories?.length) {
    const categories = await Category.find({ _id: { $in: product.categories } }).lean();
    console.log(`📚 Categories:`);
    for (const cat of categories) {
      console.log(`  - ${cat.name} (${cat._id}, slug: ${cat.slug})`);
    }
  }

  // Related Products
  if (product.relatedProductIds?.length) {
    const related = await Product.find({ externalId: { $in: product.relatedProductIds } }).lean();
    console.log(`\n🤝 Related Products:`);
    for (const rel of related) {
      console.log(`  - ${rel.title} (extId: ${rel.externalId}, slug: ${rel.slug})`);
    }
  }

  // Upsell Products
  if (product.upsellProductIds?.length) {
    const upsell = await Product.find({ externalId: { $in: product.upsellProductIds } }).lean();
    console.log(`\n⬆️ Upsell Products:`);
    for (const up of upsell) {
      console.log(`  - ${up.title} (extId: ${up.externalId}, slug: ${up.slug})`);
    }
  }

  process.exit(0);
}

showProductDetails();
