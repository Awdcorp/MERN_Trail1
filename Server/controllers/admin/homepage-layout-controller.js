const HomepageLayout = require("../../models/HomepageLayout");

// GET layout
exports.getHomepageLayout = async (req, res) => {
  try {
    console.log("📥 [GET] Request: Fetching homepage layout...");
    let layout = await HomepageLayout.findOne();

    if (!layout) {
      console.log("ℹ️ No layout found. Creating empty layout...");
      layout = await HomepageLayout.create({ sections: [] });
    }

    console.log(`✅ Homepage layout fetched with ${layout.sections.length} sections.`);
    res.json(layout.sections);
  } catch (err) {
    console.error("❌ Error fetching homepage layout:", err.message);
    res.status(500).json({ error: "Failed to fetch homepage layout" });
  }
};

// PUT layout
exports.updateHomepageLayout = async (req, res) => {
  try {
    console.log("📤 [PUT] Request: Updating homepage layout...");
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      console.warn("⚠️ Invalid format: sections is not an array");
      return res.status(400).json({ error: "Invalid layout format" });
    }

    console.log(`🛠️ Updating layout with ${sections.length} sections...`);

    const layout = await HomepageLayout.findOneAndUpdate(
      {},
      { sections },
      { upsert: true, new: true }
    );

    console.log("✅ Homepage layout updated successfully.");
    res.json(layout.sections);
  } catch (err) {
    console.error("❌ Error updating homepage layout:", err.message);
    res.status(500).json({ error: "Failed to update homepage layout" });
  }
};
