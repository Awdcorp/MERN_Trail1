// Server/controllers/admin/settings-controller.js

const Settings = require("../../models/Settings");

// GET /api/admin/settings
const getSettings = async (req, res) => {
  try {
    console.log("📥 [GET] /api/admin/settings - Fetching global settings");

    let settings = await Settings.findOne();

    if (!settings) {
      console.log("⚠️ No settings found. Creating default settings...");
      settings = await Settings.create({
        homepageSeo: {},
        organization: {
          name: "PartyWorld UAE",
          url: "https://partyworld.ae",
          logo: "https://partyworld.ae/wp-content/uploads/2025/03/logo.png"
        }
      });
    }

    console.log("✅ Settings fetched:", settings);
    res.json(settings);
  } catch (err) {
    console.error("❌ Error fetching settings:", err.message);
    res.status(500).json({ error: "Failed to fetch settings", details: err.message });
  }
};

// PUT /api/admin/settings
const updateSettings = async (req, res) => {
  try {
    console.log("📥 [PUT] /api/admin/settings - Payload:", req.body);

    const update = req.body;
    const options = { upsert: true, new: true };
    await Settings.findOneAndUpdate({}, update, options);

    const refreshed = await Settings.findOne();
    console.log("✅ Settings updated:", refreshed);
    res.json(refreshed);
  } catch (err) {
    console.error("❌ Error updating settings:", err.message);
    res.status(500).json({ error: "Failed to update settings", details: err.message });
  }
};


module.exports = {
  getSettings,
  updateSettings,
};
