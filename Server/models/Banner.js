// [Line 1] Import mongoose
const mongoose = require("mongoose");

// [Line 3–12] Define banner schema
const bannerSchema = new mongoose.Schema(
  {
    title: String,                       // Optional heading
    desktopImage: String,               // URL for desktop view
    mobileImage: String,                // URL for mobile view
    link: String,                       // Optional click-through link
    isActive: { type: Boolean, default: true } // Visibility toggle
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// [Line 14] Export as CommonJS module (✅ FIXED)
module.exports = mongoose.model("Banner", bannerSchema);
