// [Line 1] Import Banner model
const Banner = require("../../models/Banner");

// [Line 4–7] Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};

// [Line 11–16] Create new banner
const createBanner = async (req, res) => {
  try {
    const newBanner = await Banner.create(req.body);
    res.status(201).json(newBanner);
     } catch (err) {
           console.error("Banner creation failed:", err); // 🐛 Add this
           res.status(400).json({ error: err.message || "Failed to create banner" });
  }
};

// [Line 20–27] Update banner
const updateBanner = async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update banner" });
  }
};

// [Line 31–36] Delete banner
const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete banner" });
  }
};

// [Line 39] Export all
module.exports = {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
