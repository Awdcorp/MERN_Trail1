// File: Server/models/Product.js
const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  label: String,
  price: Number,
  stock: Number,
});

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    slug: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    description: String,

    sku: { type: String },                  // <-- NEW
    weight: { type: Number },              // <-- NEW (kg, optional)
    isActive: { type: Boolean, default: true },    // <-- NEW
    isFeatured: { type: Boolean, default: false }, // <-- NEW

    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    tags: [String],
    brand: String,

    price: Number,
    salePrice: Number,

    images: [String],
    variants: [VariantSchema],

    averageReview: Number,
    totalStock: Number,

    externalId: String, // WooCommerce ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
