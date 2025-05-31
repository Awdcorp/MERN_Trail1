const Collection = require("../../models/Collection");

// GET all
const getAllCollections = async (req, res) => {
  try {
    console.log("📦 [GET] Fetching all collections...");
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.json({ data: collections });
  } catch (err) {
    console.error("❌ Failed to fetch collections:", err);
    res.status(500).json({ message: "Failed to fetch collections" });
  }
};

// GET single
const getCollection = async (req, res) => {
  try {
    console.log(`📦 [GET] Fetching collection with ID: ${req.params.id}`);
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.json({ data: collection });
  } catch (err) {
    console.error("❌ Failed to fetch collection:", err);
    res.status(500).json({ message: "Failed to fetch collection" });
  }
};

// POST create
const createCollection = async (req, res) => {
  try {
    console.log("📦 [POST] Creating collection:", req.body);
    const newItem = new Collection(req.body);
    const saved = await newItem.save();
    res.json({ message: "Collection created", data: saved });
  } catch (err) {
    console.error("❌ Failed to create collection:", err);
    res.status(500).json({ message: "Failed to create collection" });
  }
};

// PUT update
const updateCollection = async (req, res) => {
  try {
    console.log(`📦 [PUT] Updating collection ${req.params.id}:`, req.body);
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Collection updated", data: updated });
  } catch (err) {
    console.error("❌ Failed to update collection:", err);
    res.status(500).json({ message: "Failed to update collection" });
  }
};

// DELETE
const deleteCollection = async (req, res) => {
  try {
    console.log(`📦 [DELETE] Deleting collection ${req.params.id}`);
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: "Collection deleted" });
  } catch (err) {
    console.error("❌ Failed to delete collection:", err);
    res.status(500).json({ message: "Failed to delete collection" });
  }
};

module.exports = {
  getAllCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection
};
