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

  contactForm: {
    sendEmail: { type: Boolean, default: false },
    notificationEmail: { type: String, default: "" },
    autoReplyText: { type: String, default: "" },
    successText: { type: String, default: "" },
    enableCaptcha: { type: Boolean, default: false },
  },

  activeHeaderMenu: { type: String, default: "header" }

}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
