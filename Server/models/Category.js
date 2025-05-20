// models/Category.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },               // ✅ remove unique
  slug: { type: String, required: true, unique: true }, // ✅ enforce slug uniqueness
  wooId: { type: Number, unique: true },                // ✅ match WooCommerce categories
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  description: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);
