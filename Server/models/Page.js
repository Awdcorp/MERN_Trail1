const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, default: "" }, // legacy fallback
  status: {
    type: String,
    enum: ["published", "draft"],
    default: "draft"
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    focusKeyword: String
  },
  blocks: [ // ✅ NEW FIELD: drag-and-drop layout sections
    {
      type: {
        type: String, // e.g., "text", "gallery", "image"
        required: true
      },
      data: {
        type: Object,
        default: {}
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model("Page", PageSchema);
