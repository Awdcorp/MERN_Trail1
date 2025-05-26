// Server/models/AnnouncementBanner.js
const mongoose = require("mongoose");

const announcementBannerSchema = new mongoose.Schema({
  leftText: { type: String, default: "" },
  rightText: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  backgroundColor: { type: String, default: "#00B0BA" },
  textColor: { type: String, default: "#FFFFFF" },
  startDate: { type: Date, default: null },
endDate: { type: Date, default: null },
}, { timestamps: true });


module.exports = mongoose.model("AnnouncementBanner", announcementBannerSchema);
