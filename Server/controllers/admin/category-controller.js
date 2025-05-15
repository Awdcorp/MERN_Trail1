// File: Server/controllers/admin/category-controller.js
const Category = require("../../models/Category");

// GET /api/admin/categories
exports.getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find().skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      Category.countDocuments()
    ]);

    res.json({ categories, total });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST /api/admin/categories
exports.createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/admin/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/admin/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/admin/categories (bulk)
exports.bulkDeleteCategories = async (req, res) => {
  try {
    const { ids } = req.body;
    await Category.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
