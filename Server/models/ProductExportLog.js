// File: Server/models/ProductExportLog.js

const mongoose = require("mongoose");

const exportLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fields: [String],
  productIds: [mongoose.Schema.Types.ObjectId],
  count: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProductExportLog", exportLogSchema);
