const mongoose = require("mongoose"); // ✅ CommonJS

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    type: {
      type: String,
      enum: ["product", "category"],
      required: true,
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, refPath: "type" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema); // ✅ CommonJS export
