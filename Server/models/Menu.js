const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  link: { type: String, required: true },
  type: { type: String, enum: ["internal", "external"], default: "internal" },
  children: [this] // recursive for submenus
});

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  items: [menuItemSchema],
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
