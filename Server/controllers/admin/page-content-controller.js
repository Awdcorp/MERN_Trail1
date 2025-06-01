const PageContent = require('../../models/PageContent');

// GET all pages (admin)
exports.getAllPages = async (req, res) => {
  try {
    const pages = await PageContent.find({}, 'slug title updatedAt');
    console.log('[PageContent] All pages fetched:', pages.length);
    res.json({ success: true, data: pages });
  } catch (err) {
    console.error('[PageContent] Error fetching all pages:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pages', error: err.message });
  }
};

// GET single page by slug (public or admin)
exports.getPageBySlug = async (req, res) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) {
      console.warn(`[PageContent] Page not found: ${req.params.slug}`);
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    console.log(`[PageContent] Fetched page for slug: ${req.params.slug}`);
    res.json({ success: true, data: page });
  } catch (err) {
    console.error(`[PageContent] Error fetching page (${req.params.slug}):`, err);
    res.status(500).json({ success: false, message: 'Failed to fetch page', error: err.message });
  }
};

// PUT create or update page by slug (admin)
exports.updatePageBySlug = async (req, res) => {
  try {
    const { title, fields } = req.body;
    const slug = req.params.slug.toLowerCase();

    const page = await PageContent.findOneAndUpdate(
      { slug },
      { title, fields },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`[PageContent] Page updated for slug: ${slug}`);
    res.json({ success: true, data: page });
  } catch (err) {
    console.error(`[PageContent] Error updating page (${req.params.slug}):`, err);
    res.status(500).json({ success: false, message: 'Failed to update page', error: err.message });
  }
};
