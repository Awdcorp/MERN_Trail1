// File: Server/controllers/admin/media-controller.js

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/admin/media
exports.getMediaFiles = async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder=partyworld/products")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    const files = result.resources.map(file => ({
      url: file.secure_url,
      public_id: file.public_id,
      format: file.format,
      created_at: file.created_at,
    }));

    res.json(files);
  } catch (err) {
    console.error("❌ Error fetching media:", err);
    res.status(500).json({ error: "Failed to fetch media files" });
  }
};

// DELETE /api/admin/media/:public_id
exports.deleteMediaFile = async (req, res) => {
  try {
    const { public_id } = req.params;
    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ result });
  } catch (err) {
    console.error("❌ Error deleting media:", err);
    res.status(500).json({ error: "Failed to delete media file" });
  }
};
