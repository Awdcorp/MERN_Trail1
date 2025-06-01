const express = require("express");
const {
  getBlogBySlug,
  getPublicBlogs, // ✅ import
} = require("../../controllers/admin/blog-controller");

const router = express.Router();

router.get("/", getPublicBlogs);     // ✅ public listing
router.get("/:slug", getBlogBySlug); // ✅ single blog

module.exports = router;
