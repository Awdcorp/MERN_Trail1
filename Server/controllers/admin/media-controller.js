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
    const folder = req.query.folder || "uploads/products";
    const max_results = parseInt(req.query.max_results) || 20;
    const next_cursor = req.query.next_cursor;

    const search = cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("created_at", "desc")
      .max_results(max_results);

    if (next_cursor) {
      search.next_cursor(next_cursor);
    }

    const result = await search.execute();

    const files = result.resources.map(file => ({
      url: file.secure_url,
      public_id: file.public_id,
      format: file.format,
      created_at: file.created_at,
      width: file.width,
      height: file.height,
      bytes: file.bytes,
    }));

    res.json({ files, next_cursor: result.next_cursor || null });
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
