const express = require("express");
const router = express.Router();
const {
  getAllCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../../controllers/admin/collection-controller");

router.get("/", getAllCollections);
router.get("/:id", getCollection);
router.post("/", createCollection);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollection);

module.exports = router;
