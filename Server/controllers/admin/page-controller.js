// Server/controllers/admin/page-controller.js

const Page = require("../../models/Page");

// @desc Create new page
exports.createPage = async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ updatedAt: -1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get single page by ID
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update page
exports.updatePage = async (req, res) => {
  try {
    const updated = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Page not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Delete page
exports.deletePage = async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
