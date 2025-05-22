const Page = require("../../models/Page");

exports.getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug, status: "published" });
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
