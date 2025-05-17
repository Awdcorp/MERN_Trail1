// File: Server/models/Product.js
const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  label: String,
  price: Number,
  stock: Number,
});

const AttributeSchema = new mongoose.Schema({
  name: String,
  options: [String],
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
    shortDescription: String, // <-- NEW

    sku: { type: String },
    weight: { type: Number },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    tags: [String],
    brand: String,

    price: Number,
    salePrice: Number,

    images: [String],
    variants: [VariantSchema],

    averageReview: Number,
    totalStock: Number,

    attributes: [AttributeSchema], // <-- NEW
    upsellProductIds: [Number], // <-- NEW
    relatedProductIds: [Number], // <-- NEW

    seo: { // <-- NEW
      metaTitle: String,
      metaDescription: String,
      focusKeyword: String,
    },

    meta: Array, // <-- NEW

    externalId: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
