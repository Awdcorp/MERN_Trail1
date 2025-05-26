// Server/routes/admin/announcement-banner-routes.js
const express = require("express");
const router = express.Router();
const Announcement = require("../../models/AnnouncementBanner");

// GET active announcement
router.get("/active", async (req, res) => {
  try {
    const now = new Date();

    const active = await Announcement.findOne({
      isActive: true,
      $or: [
        { startDate: null, endDate: null },
        {
          startDate: { $lte: now },
          endDate: { $gte: now }
        }
      ]
    });

    res.json(active || {});
  } catch (err) {
    console.error("❌ Failed to fetch active announcement:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// POST or PUT to create/update announcement
router.post("/set", async (req, res) => {
  const {
    leftText,
    rightText,
    isActive,
    backgroundColor,
    textColor,
  } = req.body;

  try {
    const existing = await Announcement.findOne();

    if (existing) {
      existing.leftText = leftText;
      existing.rightText = rightText;
      existing.isActive = isActive;
      existing.backgroundColor = backgroundColor;
      existing.textColor = textColor;
      existing.startDate = startDate ? new Date(startDate) : null;   // ✅
existing.endDate = endDate ? new Date(endDate) : null;         // ✅
      await existing.save();
    } else {
      await Announcement.create({
        leftText,
        rightText,
        isActive,
        backgroundColor,
        textColor,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to update announcement:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
