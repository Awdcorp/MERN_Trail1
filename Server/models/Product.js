const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  label: String,           // e.g. "Red / M"
  price: Number,
  stock: Number,
});

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    tags: [String],
    brand: String,

    price: Number,
    salePrice: Number,

    images: [String],           // Cloudinary or Woo URLs
    variants: [VariantSchema],  // Optional

    averageReview: Number,
    totalStock: Number,

    externalId: String,         // WooCommerce product ID (for reference)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
