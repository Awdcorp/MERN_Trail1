// Server/routes/admin/page-routes.js

const express = require("express");
const router = express.Router();
const {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage
} = require("../../controllers/admin/page-controller");

router.post("/", createPage);             // Create new page
router.get("/", getAllPages);             // Get all pages
router.get("/:id", getPageById);          // Get page by ID
router.put("/:id", updatePage);           // Update page
router.delete("/:id", deletePage);        // Delete page

module.exports = router;
