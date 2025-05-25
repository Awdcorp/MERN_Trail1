const mongoose = require("mongoose");

const ProductImportLogSchema = new mongoose.Schema({
  fileName: String,
  importedCount: Number,
  skippedCount: Number,
  createdProductIds: [mongoose.Schema.Types.ObjectId],
  timestamp: { type: Date, default: Date.now },
  reverted: { type: Boolean, default: false },              // ✅ new
  revertedAt: { type: Date, default: null },                 // ✅ new
});

module.exports = mongoose.model("ProductImportLog", ProductImportLogSchema);
