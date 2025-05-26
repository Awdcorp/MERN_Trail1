// Server/models/Settings.js

const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema({
  metaTitle: { type: String, default: "" },
  metaDescription: { type: String, default: "" },
  ogImage: { type: String, default: "" },
});

const settingsSchema = new mongoose.Schema({
  homepageSeo: seoSchema,

  organization: {
    name: { type: String, default: "" },
    url: { type: String, default: "" },
    logo: { type: String, default: "" },
  },
activeHeaderMenu: { type: String, default: "header" }
}, { timestamps: true });



module.exports = mongoose.model("Settings", settingsSchema);
