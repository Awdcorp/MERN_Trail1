// Server/models/Blog.js
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // HTML content via React Quill
    coverImage: { type: String, default: "" },
    author: { type: String, default: "Admin" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    focusKeyword: { type: String },

    tags: [String],
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
