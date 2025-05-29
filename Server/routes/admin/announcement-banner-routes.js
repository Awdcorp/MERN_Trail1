const express = require("express");
const router = express.Router();
const Announcement = require("../../models/AnnouncementBanner");

// GET active announcement
router.get("/active", async (req, res) => {
  try {
    const now = new Date();
    console.log("📥 [GET] /active called at", now.toISOString());

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

    if (active) {
      console.log("✅ Active announcement found:", active);
    } else {
      console.log("ℹ️ No active announcement found.");
    }

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
    startDate,
    endDate,
  } = req.body;

  console.log("📥 [POST] /set called with data:", req.body);

  try {
    const existing = await Announcement.findOne();

    if (existing) {
      console.log("🔄 Updating existing announcement with ID:", existing._id);
      existing.leftText = leftText;
      existing.rightText = rightText;
      existing.isActive = isActive;
      existing.backgroundColor = backgroundColor;
      existing.textColor = textColor;
      existing.startDate = startDate ? new Date(startDate) : null;
      existing.endDate = endDate ? new Date(endDate) : null;
      await existing.save();
      console.log("✅ Announcement updated.");
    } else {
      console.log("🆕 Creating new announcement.");
      await Announcement.create({
        leftText,
        rightText,
        isActive,
        backgroundColor,
        textColor,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      });
      console.log("✅ Announcement created.");
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to update announcement:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET latest announcement (for admin view, no filters)
router.get("/latest", async (req, res) => {
  try {
    console.log("📥 [GET] /latest called");

    const latest = await Announcement.findOne().sort({ updatedAt: -1 });

    if (latest) {
      console.log("✅ Latest announcement found:", latest);
    } else {
      console.log("ℹ️ No announcement found.");
    }

    res.json(latest || {});
  } catch (err) {
    console.error("❌ Failed to fetch latest announcement:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
