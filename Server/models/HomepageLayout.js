const mongoose = require("mongoose");

const homepageSectionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g. 'slider', 'product-slider', etc.
  data: { type: mongoose.Schema.Types.Mixed, default: {} } // section-specific config
}, { _id: false }); // we’ll manage unique _id in array if needed

const homepageLayoutSchema = new mongoose.Schema({
  sections: [homepageSectionSchema]
}, { timestamps: true });

module.exports = mongoose.model("HomepageLayout", homepageLayoutSchema);
