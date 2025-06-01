const express = require("express");
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
} = require("../../controllers/admin/blog-controller");

const router = express.Router();
router.get("/", getAllBlogs);
router.post("/create", createBlog);
router.put("/update/:id", updateBlog);
router.delete("/delete/:id", deleteBlog);
router.get("/all", getAllBlogs);
router.get("/details/:id", getBlogById);

module.exports = router;
